/**
 * 🔥 Firebase Auth Service for Khipu
 * 
 * Handles Google/Facebook authentication using Firebase
 * Auto-generates Soroban wallets for authenticated users
 */

class AuthService {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
    this.authCallbacks = [];
    
    // Initialize Firebase (using CDN in HTML)
    this.initializeAuth();
  }
  
  initializeAuth() {
    // Firebase will be loaded via CDN in HTML
    // This is a simulation for the MVP
    console.log('🔥 Firebase Auth initialized');
    
    // Check for existing session
    const storedUser = localStorage.getItem('khipuUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      this.isAuthenticated = true;
      this.notifyAuthChange();
    }
  }
  
  // Simulate Google Login
  async loginWithGoogle() {
    try {
      // In real Firebase implementation:
      // const provider = new firebase.auth.GoogleAuthProvider();
      // const result = await firebase.auth().signInWithPopup(provider);
      
      // For MVP demo, simulate successful login
      const mockUser = {
        uid: 'user_' + Date.now(),
        email: 'demo@khipu.com',
        displayName: 'Demo User',
        photoURL: 'https://via.placeholder.com/100',
        provider: 'google'
      };
      
      this.currentUser = mockUser;
      this.isAuthenticated = true;
      
      // Store user session
      localStorage.setItem('khipuUser', JSON.stringify(mockUser));
      
      // Generate Soroban wallet
      await this.generateSorobanWallet();
      
      this.notifyAuthChange();
      
      console.log('✅ Google login successful:', mockUser);
      return mockUser;
      
    } catch (error) {
      console.error('❌ Google login error:', error);
      throw error;
    }
  }
  
  // Simulate Facebook Login
  async loginWithFacebook() {
    try {
      const mockUser = {
        uid: 'user_fb_' + Date.now(),
        email: 'demo.fb@khipu.com',
        displayName: 'Demo FB User',
        photoURL: 'https://via.placeholder.com/100',
        provider: 'facebook'
      };
      
      this.currentUser = mockUser;
      this.isAuthenticated = true;
      
      localStorage.setItem('khipuUser', JSON.stringify(mockUser));
      await this.generateSorobanWallet();
      this.notifyAuthChange();
      
      console.log('✅ Facebook login successful:', mockUser);
      return mockUser;
      
    } catch (error) {
      console.error('❌ Facebook login error:', error);
      throw error;
    }
  }
  
  // Generate Soroban wallet for user
  async generateSorobanWallet() {
    if (!this.currentUser) return;
    
    const walletKey = `wallet_${this.currentUser.uid}`;
    
    // Check if wallet already exists
    if (localStorage.getItem(walletKey)) {
      console.log('💎 Existing Soroban wallet found');
      return;
    }
    
    try {
      // Simulate Stellar SDK Keypair generation
      // In real implementation: const pair = StellarSdk.Keypair.random();
      
      const mockKeyPair = {
        publicKey: 'G' + 'DEMO'.repeat(10) + Math.random().toString(36).substr(2, 9).toUpperCase(),
        secret: 'S' + 'DEMO'.repeat(10) + Math.random().toString(36).substr(2, 9).toUpperCase()
      };
      
      // Encrypt and store wallet
      const { simpleEncrypt } = await import('../utils/crypto.js');
      const encryptedSecret = simpleEncrypt(this.currentUser.email, mockKeyPair.secret);
      
      const walletData = {
        publicKey: mockKeyPair.publicKey,
        encryptedSecret: encryptedSecret,
        createdAt: Date.now()
      };
      
      localStorage.setItem(walletKey, JSON.stringify(walletData));
      
      console.log('💎 Soroban wallet generated and encrypted:', {
        publicKey: mockKeyPair.publicKey,
        encrypted: true
      });
      
    } catch (error) {
      console.error('❌ Wallet generation error:', error);
    }
  }
  
  // Get user's Soroban wallet
  async getSorobanWallet() {
    if (!this.currentUser) return null;
    
    const walletKey = `wallet_${this.currentUser.uid}`;
    const walletData = localStorage.getItem(walletKey);
    
    if (!walletData) return null;
    
    try {
      const wallet = JSON.parse(walletData);
      const { simpleDecrypt } = await import('../utils/crypto.js');
      
      return {
        publicKey: wallet.publicKey,
        secret: simpleDecrypt(this.currentUser.email, wallet.encryptedSecret),
        createdAt: wallet.createdAt
      };
      
    } catch (error) {
      console.error('❌ Wallet decryption error:', error);
      return null;
    }
  }
  
  // Logout
  async logout() {
    this.currentUser = null;
    this.isAuthenticated = false;
    
    localStorage.removeItem('khipuUser');
    this.notifyAuthChange();
    
    console.log('👋 User logged out');
  }
  
  // Subscribe to auth changes
  onAuthStateChanged(callback) {
    this.authCallbacks.push(callback);
    
    // Call immediately with current state
    callback(this.currentUser);
    
    // Return unsubscribe function
    return () => {
      const index = this.authCallbacks.indexOf(callback);
      if (index > -1) {
        this.authCallbacks.splice(index, 1);
      }
    };
  }
  
  // Notify all subscribers of auth changes
  notifyAuthChange() {
    this.authCallbacks.forEach(callback => {
      callback(this.currentUser);
    });
  }
  
  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }
  
  // Check if user is authenticated
  isUserAuthenticated() {
    return this.isAuthenticated;
  }
}

// Export singleton instance
export default new AuthService();
