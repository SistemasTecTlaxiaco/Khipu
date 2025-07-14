/**
 * 🌌 Soroban Contract Client for Khipu
 * 
 * Handles interaction with the deployed Khipu smart contract
 * Integrates with user wallets for transaction signing
 */

class ContractClient {
  constructor() {
    // Use existing contract configuration
    this.contractId = 'CDS3VGIAZFIZUG3GL6LWAXLOXWCRIIBDPPRS4225LLLEHPGTFDNF4PQK';
    this.rpcUrl = 'https://rpc-futurenet.stellar.org';
    this.networkPassphrase = 'Test SDF Future Network ; October 2022';
    
    // Convert fiat amounts to stroops (1 USD = 10,000,000 stroops for demo)
    this.USDC_STROOPS_PER_DOLLAR = 10000000;
    
    console.log('🌌 Soroban Contract Client initialized');
    console.log('📄 Contract ID:', this.contractId);
  }
  
  // Convert $10 to USDC stroops
  dollarToStroops(dollars) {
    return dollars * this.USDC_STROOPS_PER_DOLLAR;
  }
  
  // Convert stroops back to dollars for display
  stroopsToDollar(stroops) {
    return stroops / this.USDC_STROOPS_PER_DOLLAR;
  }
  
  // Make a $10 weekly contribution
  async makeWeeklyContribution(userWallet) {
    try {
      const amount = this.dollarToStroops(10); // $10 in stroops
      
      console.log('💰 Making $10 weekly contribution...');
      console.log('👤 User wallet:', userWallet.publicKey);
      console.log('💵 Amount (stroops):', amount);
      
      // Simulate transaction building and submission
      // In real implementation, this would use StellarSdk
      
      const transaction = {
        source: userWallet.publicKey,
        contract: this.contractId,
        function: 'contribute',
        parameters: [userWallet.publicKey, amount],
        network: this.networkPassphrase,
        timestamp: Date.now()
      };
      
      // Simulate transaction signing
      const signedTx = await this.signTransaction(transaction, userWallet.secret);
      
      // Simulate submission to network
      const result = await this.submitTransaction(signedTx);
      
      console.log('✅ Contribution successful:', result);
      
      return {
        success: true,
        txHash: result.hash,
        amount: amount,
        dollarAmount: 10,
        timestamp: Date.now()
      };
      
    } catch (error) {
      console.error('❌ Contribution failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  // Get user's reputation score
  async getReputationScore(publicKey) {
    try {
      console.log('🏆 Fetching reputation for:', publicKey);
      
      // Simulate contract call
      const mockScore = {
        total: 12, // Expected weeks
        on_time: Math.floor(Math.random() * 12) + 1, // Random contributions
        level: 'A' // Grade level
      };
      
      // Calculate completion percentage
      const completionRate = Math.floor((mockScore.on_time / mockScore.total) * 100);
      
      // Determine level based on completion rate
      if (completionRate >= 100) mockScore.level = 'Aplus';
      else if (completionRate >= 80) mockScore.level = 'A';
      else if (completionRate >= 60) mockScore.level = 'B';
      else if (completionRate >= 40) mockScore.level = 'C';
      else mockScore.level = 'D';
      
      const result = {
        ...mockScore,
        completionRate,
        totalContributed: mockScore.on_time * 10, // $10 per contribution
        nextContributionDue: this.getNextContributionDate()
      };
      
      console.log('✅ Reputation retrieved:', result);
      return result;
      
    } catch (error) {
      console.error('❌ Failed to get reputation:', error);
      return null;
    }
  }
  
  // Get user's contribution history
  async getContributionHistory(publicKey) {
    try {
      console.log('📊 Fetching contribution history for:', publicKey);
      
      // Simulate contribution history
      const history = [];
      const now = Date.now();
      const weekMs = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds
      
      // Generate mock contributions for the last few weeks
      for (let i = 0; i < 8; i++) {
        const contributionDate = now - (i * weekMs);
        const isOnTime = Math.random() > 0.2; // 80% chance of being on time
        
        if (isOnTime || i < 3) { // Always show recent contributions
          history.push({
            week: i + 1,
            amount: 10, // $10
            stroops: this.dollarToStroops(10),
            date: contributionDate,
            onTime: isOnTime,
            txHash: 'TX' + Math.random().toString(36).substr(2, 16).toUpperCase()
          });
        }
      }
      
      console.log('✅ History retrieved:', history.length, 'contributions');
      return history.reverse(); // Show oldest first
      
    } catch (error) {
      console.error('❌ Failed to get history:', error);
      return [];
    }
  }
  
  // Get all tanda participants
  async getTandaParticipants() {
    try {
      console.log('👥 Fetching tanda participants...');
      
      // Mock participants data
      const participants = [
        {
          address: 'GDEM' + 'O'.repeat(50),
          name: 'María González',
          contributions: 12,
          reputation: 'A',
          totalAmount: 120
        },
        {
          address: 'GTES' + 'T'.repeat(50),
          name: 'Carlos Rodríguez',
          contributions: 10,
          reputation: 'B',
          totalAmount: 100
        },
        {
          address: 'GMOC' + 'K'.repeat(50),
          name: 'Ana Martínez',
          contributions: 15,
          reputation: 'Aplus',
          totalAmount: 150
        }
      ];
      
      console.log('✅ Participants retrieved:', participants.length);
      return participants;
      
    } catch (error) {
      console.error('❌ Failed to get participants:', error);
      return [];
    }
  }
  
  // Get next contribution due date
  getNextContributionDate() {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));
    return nextWeek;
  }
  
  // Simulate transaction signing
  async signTransaction(transaction, secretKey) {
    console.log('✍️ Signing transaction...');
    
    // In real implementation, use StellarSdk to sign
    return {
      ...transaction,
      signature: 'SIG' + Math.random().toString(36).substr(2, 32).toUpperCase(),
      signed: true
    };
  }
  
  // Simulate transaction submission
  async submitTransaction(signedTransaction) {
    console.log('📡 Submitting transaction to network...');
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate successful response
    return {
      hash: 'TXH' + Math.random().toString(36).substr(2, 32).toUpperCase(),
      status: 'SUCCESS',
      ledger: Math.floor(Math.random() * 1000000),
      timestamp: Date.now()
    };
  }
  
  // Check if user can make contribution (once per week)
  canMakeContribution(lastContribution) {
    if (!lastContribution) return true;
    
    const now = Date.now();
    const weekMs = 7 * 24 * 60 * 60 * 1000;
    const timeSinceLastContribution = now - lastContribution;
    
    return timeSinceLastContribution >= weekMs;
  }
  
  // Get formatted time until next contribution
  getTimeUntilNextContribution(lastContribution) {
    if (!lastContribution) return 'Available now';
    
    const now = Date.now();
    const weekMs = 7 * 24 * 60 * 60 * 1000;
    const nextContribution = lastContribution + weekMs;
    const timeLeft = nextContribution - now;
    
    if (timeLeft <= 0) return 'Available now';
    
    const days = Math.floor(timeLeft / (24 * 60 * 60 * 1000));
    const hours = Math.floor((timeLeft % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  }
}

// Export singleton instance
export default new ContractClient();
