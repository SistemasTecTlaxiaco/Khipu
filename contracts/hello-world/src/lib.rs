//! Smart Contract for "Khipu" built with Soroban
//! GOAL: Track weekly contributions ("aportaciones") from users in a social savings group.
//! Each user commits to sending a weekly amount (e.g. $10), tracked on-chain.
//!
//! FEATURES:
//! - Store user deposits with timestamps.
//! - Track punctuality and number of fulfilled contributions.
//! - Generate a compliance score based on contribution history.
//!
//! STRUCTURE:
//! - User is identified by their public key (Address).
//! - Each contribution is stored as (user, amount, timestamp).
//! - Score is calculated as (on-time contributions / total expected).
//!
//! STORAGE:
//! - contributions: Map<Address, Vec<Timestamp>>
//! - expected_weeks: u32 (e.g., 3 weeks tanda)
//!
//! ENTRYPOINTS:
//! - fn contribute(env: Env, from: Address, amount: i128) → stores timestamp
//! - fn get_reputation(env: Env, user: Address) -> Score
//! - fn set_expected_weeks(env: Env, weeks: u32) → for admin

#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Symbol, Vec, symbol_short};

#[contract]
pub struct KhipuContract;

#[derive(Clone, Debug, Eq, PartialEq)]
#[contracttype]
pub struct Score {
    pub total: u32,
    pub on_time: u32,
    pub level: Symbol,
}

#[derive(Clone, Debug, Eq, PartialEq)]
#[contracttype]
pub struct Contribution {
    pub amount: i128,
    pub timestamp: u64,
    pub week_number: u32,
}

#[contractimpl]
impl KhipuContract {
    /// Store a contribution from a user with timestamp
    pub fn contribute(env: Env, from: Address, amount: i128) {
        from.require_auth();
        
        // Get current timestamp
        let now = env.ledger().timestamp();
        
        // Get existing contributions for user
        let mut user_contributions: Vec<Contribution> = env
            .storage()
            .persistent()
            .get(&from)
            .unwrap_or_else(|| Vec::new(&env));
        
        // Calculate week number based on contribution count
        let week_number = user_contributions.len() as u32 + 1;
        
        // Create new contribution
        let contribution = Contribution {
            amount,
            timestamp: now,
            week_number,
        };
        
        // Add to user's contributions
        user_contributions.push_back(contribution);
        
        // Store updated contributions
        env.storage().persistent().set(&from, &user_contributions);
        
        // Update total participants count
        let participants_key = symbol_short!("parts");
        let mut participants: Vec<Address> = env
            .storage()
            .persistent()
            .get(&participants_key)
            .unwrap_or_else(|| Vec::new(&env));
        
        // Add user to participants if not already present
        if !participants.iter().any(|addr| addr == from) {
            participants.push_back(from.clone());
            env.storage().persistent().set(&participants_key, &participants);
        }
    }
    
    /// Get reputation score for a user
    pub fn get_reputation(env: Env, user: Address) -> Score {
        let user_contributions: Vec<Contribution> = env
            .storage()
            .persistent()
            .get(&user)
            .unwrap_or_else(|| Vec::new(&env));
            
        let expected_weeks: u32 = env
            .storage()
            .persistent()
            .get(&symbol_short!("weeks"))
            .unwrap_or(3); // default 3-week khipu
        
        let on_time = user_contributions.len() as u32;
        
        // Calculate level based on completion percentage
        let completion_rate = if expected_weeks > 0 {
            (on_time * 100) / expected_weeks
        } else {
            0
        };
        
        let level = if completion_rate >= 100 {
            symbol_short!("Aplus")
        } else if completion_rate >= 80 {
            symbol_short!("A")
        } else if completion_rate >= 60 {
            symbol_short!("B")
        } else if completion_rate >= 40 {
            symbol_short!("C")
        } else {
            symbol_short!("D")
        };
        
        Score {
            total: expected_weeks,
            on_time,
            level,
        }
    }
    
    /// Set expected weeks for the khipu (admin function)
    pub fn set_expected_weeks(env: Env, admin: Address, weeks: u32) {
        admin.require_auth();
        
        // Store admin if not set
        let admin_key = symbol_short!("admin");
        if env.storage().persistent().get::<Symbol, Address>(&admin_key).is_none() {
            env.storage().persistent().set(&admin_key, &admin);
        }
        
        // Verify caller is admin
        let stored_admin: Address = env
            .storage()
            .persistent()
            .get(&admin_key)
            .unwrap();
        
        if admin != stored_admin {
            panic!("Only admin can set expected weeks");
        }
        
        env.storage().persistent().set(&symbol_short!("weeks"), &weeks);
    }
    
    /// Get user's contribution history
    pub fn get_user_contributions(env: Env, user: Address) -> Vec<Contribution> {
        env.storage()
            .persistent()
            .get(&user)
            .unwrap_or_else(|| Vec::new(&env))
    }
    
    /// Get all participants in the khipu
    pub fn get_participants(env: Env) -> Vec<Address> {
        env.storage()
            .persistent()
            .get(&symbol_short!("parts"))
            .unwrap_or_else(|| Vec::new(&env))
    }
    
    /// Get total amount contributed by a user
    pub fn get_user_total(env: Env, user: Address) -> i128 {
        let contributions: Vec<Contribution> = env
            .storage()
            .persistent()
            .get(&user)
            .unwrap_or_else(|| Vec::new(&env));
        
        let mut total = 0i128;
        for contribution in contributions.iter() {
            total += contribution.amount;
        }
        total
    }
    
    /// Get khipu configuration (weeks and admin)
    pub fn get_khipu_config(env: Env) -> (u32, Option<Address>) {
        let weeks: u32 = env
            .storage()
            .persistent()
            .get(&symbol_short!("weeks"))
            .unwrap_or(3);
            
        let admin: Option<Address> = env
            .storage()
            .persistent()
            .get(&symbol_short!("admin"));
            
        (weeks, admin)
    }
    
    /// Initialize khipu with admin and expected weeks
    pub fn initialize(env: Env, admin: Address, weeks: u32) {
        admin.require_auth();
        
        // Only initialize once
        if env.storage().persistent().get::<Symbol, bool>(&symbol_short!("init")).is_some() {
            panic!("Khipu already initialized");
        }
        
        // Set admin and weeks
        env.storage().persistent().set(&symbol_short!("admin"), &admin);
        env.storage().persistent().set(&symbol_short!("weeks"), &weeks);
        env.storage().persistent().set(&symbol_short!("init"), &true);
    }
}

mod test;
