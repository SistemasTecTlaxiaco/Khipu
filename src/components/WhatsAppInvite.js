/**
 * 📲 WhatsApp Invite Component for Khipu
 * 
 * Generates referral links and WhatsApp invite messages
 * Includes user referral tracking
 */

class WhatsAppInvite {
  constructor() {
    this.baseUrl = 'https://juntacripto.xyz/khipu';
    this.whatsappApiUrl = 'https://wa.me/';
  }
  
  // Generate referral link for user
  generateReferralLink(userEmail, userName = '') {
    const referralCode = btoa(userEmail).replace(/[=+/]/g, '').substr(0, 10);
    return `${this.baseUrl}?ref=${referralCode}&user=${encodeURIComponent(userName)}`;
  }
  
  // Create WhatsApp invite message
  createInviteMessage(userEmail, userName = 'Usuario') {
    const referralLink = this.generateReferralLink(userEmail, userName);
    
    const messages = [
      // Spanish version
      `🙌 ¡Hola! Estoy ahorrando $10 semanales en una tanda blockchain con Khipu.

💰 ¿Cómo funciona?
✅ Ahorras $10 cada semana
✅ Todo queda registrado en blockchain
✅ Sistema transparente y seguro
✅ Reputación basada en puntualidad

📱 Únete aquí: ${referralLink}

¡Es súper fácil y seguro! 🚀`,
      
      // English version
      `🙌 Hey! I'm saving $10/week in a blockchain tanda with Khipu.

💰 How it works:
✅ Save $10 every week
✅ Everything recorded on blockchain  
✅ Transparent and secure system
✅ Reputation based on punctuality

📱 Join here: ${referralLink}

It's super easy and secure! 🚀`,
      
      // Short version
      `💰 Estoy ahorrando $10/semana en una tanda blockchain. ¡Únete! ${referralLink} 🚀`
    ];
    
    return messages;
  }
  
  // Generate WhatsApp share URLs
  generateWhatsAppUrls(userEmail, userName = 'Usuario') {
    const messages = this.createInviteMessage(userEmail, userName);
    
    return messages.map((message, index) => ({
      id: index,
      type: index === 0 ? 'spanish' : index === 1 ? 'english' : 'short',
      message: message,
      url: `${this.whatsappApiUrl}?text=${encodeURIComponent(message)}`
    }));
  }
  
  // Share to specific WhatsApp contact
  shareToContact(phoneNumber, userEmail, userName = 'Usuario') {
    const message = this.createInviteMessage(userEmail, userName)[0]; // Use Spanish version
    
    // Format phone number (remove non-digits)
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    return `${this.whatsappApiUrl}${cleanPhone}?text=${encodeURIComponent(message)}`;
  }
  
  // Track referral clicks (for analytics)
  trackReferralClick(referralCode, source = 'whatsapp') {
    const clickData = {
      referralCode,
      source,
      timestamp: Date.now(),
      userAgent: navigator.userAgent
    };
    
    // Store in localStorage for demo
    const clicks = JSON.parse(localStorage.getItem('referralClicks') || '[]');
    clicks.push(clickData);
    localStorage.setItem('referralClicks', JSON.stringify(clicks));
    
    console.log('📊 Referral click tracked:', clickData);
  }
  
  // Get referral statistics for user
  getReferralStats(userEmail) {
    const referralCode = btoa(userEmail).replace(/[=+/]/g, '').substr(0, 10);
    const allClicks = JSON.parse(localStorage.getItem('referralClicks') || '[]');
    
    const userClicks = allClicks.filter(click => click.referralCode === referralCode);
    
    return {
      totalClicks: userClicks.length,
      clicksBySource: userClicks.reduce((acc, click) => {
        acc[click.source] = (acc[click.source] || 0) + 1;
        return acc;
      }, {}),
      recentClicks: userClicks.slice(-10), // Last 10 clicks
      firstClick: userClicks[0]?.timestamp || null,
      lastClick: userClicks[userClicks.length - 1]?.timestamp || null
    };
  }
  
  // Create social media sharing buttons HTML
  createSharingButtons(userEmail, userName = 'Usuario') {
    const whatsappUrls = this.generateWhatsAppUrls(userEmail, userName);
    
    return `
      <div class="sharing-buttons">
        <h3>📲 Comparte con tus amigos</h3>
        
        ${whatsappUrls.map(item => `
          <div class="share-option">
            <h4>${item.type === 'spanish' ? '🇪🇸 Español' : 
                 item.type === 'english' ? '🇺🇸 English' : '⚡ Corto'}</h4>
            <div class="message-preview">
              ${item.message.substring(0, 100)}...
            </div>
            <a href="${item.url}" 
               target="_blank" 
               class="whatsapp-btn"
               onclick="WhatsAppInvite.trackClick('${btoa(userEmail).substr(0, 10)}')">
              📱 Compartir en WhatsApp
            </a>
          </div>
        `).join('')}
        
        <div class="referral-stats">
          <h4>📊 Tus estadísticas de referidos</h4>
          <div id="referral-stats-content">
            <p>Cargando estadísticas...</p>
          </div>
        </div>
      </div>
    `;
  }
  
  // Initialize sharing component in DOM
  initializeComponent(containerId, userEmail, userName = 'Usuario') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = this.createSharingButtons(userEmail, userName);
    
    // Load and display stats
    setTimeout(() => {
      const stats = this.getReferralStats(userEmail);
      const statsContainer = document.getElementById('referral-stats-content');
      
      if (statsContainer) {
        statsContainer.innerHTML = `
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-number">${stats.totalClicks}</span>
              <span class="stat-label">Clicks totales</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">${Object.keys(stats.clicksBySource).length}</span>
              <span class="stat-label">Fuentes</span>
            </div>
          </div>
        `;
      }
    }, 500);
  }
  
  // Static method for tracking clicks (can be called from HTML)
  static trackClick(referralCode) {
    const instance = new WhatsAppInvite();
    instance.trackReferralClick(referralCode, 'whatsapp');
  }
}

// Make available globally for HTML onclick handlers
window.WhatsAppInvite = WhatsAppInvite;

// Export for module use
export default WhatsAppInvite;
