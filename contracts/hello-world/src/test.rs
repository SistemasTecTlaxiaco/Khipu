#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env};

#[test]
fn test_initialize_khipu() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register_contract(None, KhipuContract);
    let client = KhipuContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);

    // Initialize khipu with 4 weeks
    client.initialize(&admin, &4);

    // Check configuration
    let (weeks, admin_opt) = client.get_khipu_config();
    assert_eq!(weeks, 4);
    assert_eq!(admin_opt, Some(admin));
}

#[test]
fn test_contribute() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register_contract(None, KhipuContract);
    let client = KhipuContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let user = Address::generate(&env);

    // Initialize khipu
    client.initialize(&admin, &3);

    // Contribute
    client.contribute(&user, &1000000000); // 10 USDC in stroops

    // Check total
    let total = client.get_user_total(&user);
    assert_eq!(total, 1000000000);

    // Check user is in participants
    let participants = client.get_participants();
    assert!(participants.contains(&user));
}

#[test]
fn test_reputation_scoring() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register_contract(None, KhipuContract);
    let client = KhipuContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let user = Address::generate(&env);

    // Initialize khipu
    client.initialize(&admin, &3);

    // User contributes twice (2 out of 3 weeks = 66.67%)
    client.contribute(&user, &1000000000);
    client.contribute(&user, &1000000000);

    let score = client.get_reputation(&user);
    assert_eq!(score.total, 3);
    assert_eq!(score.on_time, 2);
    // Should be level "B" (60-79% range)
    let expected_level = Symbol::new(&env, "B");
    assert_eq!(score.level, expected_level);
}

#[test]
fn test_participants_tracking() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register_contract(None, KhipuContract);
    let client = KhipuContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let user1 = Address::generate(&env);
    let user2 = Address::generate(&env);
    let user3 = Address::generate(&env);

    // Initialize khipu
    client.initialize(&admin, &4);

    // Multiple users contribute
    client.contribute(&user1, &1000000000);
    client.contribute(&user2, &2000000000);
    client.contribute(&user3, &1500000000);

    let participants = client.get_participants();
    assert_eq!(participants.len(), 3);
    assert!(participants.contains(&user1));
    assert!(participants.contains(&user2));
    assert!(participants.contains(&user3));

    // Check individual totals
    assert_eq!(client.get_user_total(&user1), 1000000000);
    assert_eq!(client.get_user_total(&user2), 2000000000);
    assert_eq!(client.get_user_total(&user3), 1500000000);
}

#[test]
fn test_admin_only_functions() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register_contract(None, KhipuContract);
    let client = KhipuContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);

    // Initialize khipu
    client.initialize(&admin, &4);

    // Admin can set expected weeks
    client.set_expected_weeks(&admin, &6);

    let (weeks, _) = client.get_khipu_config();
    assert_eq!(weeks, 6);
}

#[test]
fn test_multiple_contributions() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register_contract(None, KhipuContract);
    let client = KhipuContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let user = Address::generate(&env);

    // Initialize khipu
    client.initialize(&admin, &4);

    // User makes multiple contributions
    client.contribute(&user, &1000000000); // Week 1
    client.contribute(&user, &1000000000); // Week 2
    client.contribute(&user, &1000000000); // Week 3

    // Check cumulative total
    let total = client.get_user_total(&user);
    assert_eq!(total, 3000000000);

    // Check reputation (3 out of 4 weeks = 75%)
    let score = client.get_reputation(&user);
    assert_eq!(score.total, 4);
    assert_eq!(score.on_time, 3);
    let expected_level = Symbol::new(&env, "B");
    assert_eq!(score.level, expected_level);
}

#[test]
fn test_reputation_levels() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register_contract(None, KhipuContract);
    let client = KhipuContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);

    // Initialize 5-week khipu for better level testing
    client.initialize(&admin, &5);

    // Test A+ level (100% completion)
    let user_a_plus = Address::generate(&env);
    for _ in 0..5 {
        client.contribute(&user_a_plus, &1000000000);
    }
    let score_a_plus = client.get_reputation(&user_a_plus);
    assert_eq!(score_a_plus.level, Symbol::new(&env, "Aplus"));

    // Test A level (80-99% completion) - 4 out of 5
    let user_a = Address::generate(&env);
    for _ in 0..4 {
        client.contribute(&user_a, &1000000000);
    }
    let score_a = client.get_reputation(&user_a);
    assert_eq!(score_a.level, Symbol::new(&env, "A"));

    // Test B level (60-79% completion) - 3 out of 5
    let user_b = Address::generate(&env);
    for _ in 0..3 {
        client.contribute(&user_b, &1000000000);
    }
    let score_b = client.get_reputation(&user_b);
    assert_eq!(score_b.level, Symbol::new(&env, "B"));

    // Test C level (40-59% completion) - 2 out of 5
    let user_c = Address::generate(&env);
    for _ in 0..2 {
        client.contribute(&user_c, &1000000000);
    }
    let score_c = client.get_reputation(&user_c);
    assert_eq!(score_c.level, Symbol::new(&env, "C"));

    // Test D level (<40% completion) - 1 out of 5
    let user_d = Address::generate(&env);
    client.contribute(&user_d, &1000000000);
    let score_d = client.get_reputation(&user_d);
    assert_eq!(score_d.level, Symbol::new(&env, "D"));
}

#[test]
fn test_estudiante_operations() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register_contract(None, KhipuContract);
    let client = KhipuContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let student = Address::generate(&env);

    // Initialize khipu
    client.initialize(&admin, &12); // 12-week semester

    // Student makes regular contributions
    for _week in 1..=8 {
        client.contribute(&student, &1000000000); // 10 USDC per week
    }

    // Check student progress
    let total = client.get_user_total(&student);
    assert_eq!(total, 8000000000); // 80 USDC total

    let reputation = client.get_reputation(&student);
    assert_eq!(reputation.on_time, 8);
    assert_eq!(reputation.total, 12);
    
    // 8/12 = 66.67% -> Level B
    let expected_level = Symbol::new(&env, "B");
    assert_eq!(reputation.level, expected_level);

    // Verify student is tracked
    let participants = client.get_participants();
    assert!(participants.contains(&student));
}
