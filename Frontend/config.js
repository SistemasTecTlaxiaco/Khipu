// Configuración global de Khipu
window.APP_CONFIG = {
    // Configuración del contrato Soroban
    CONTRACT_ID: 'CDS3VGIAZFIZUG3GL6LWAXLOXWCRIIBDPPRS4225LLLEHPGTFDNF4PQK',
    RPC_URL: 'https://rpc-futurenet.stellar.org',
    NETWORK_PASSPHRASE: 'Test SDF Future Network ; October 2022',
    
    // URLs de la aplicación
    APP_BASE_URL: window.location.origin,
    
    // Configuración de la red
    NETWORK: 'futurenet', // 'testnet', 'futurenet', 'mainnet'
    
    // Configuración de la wallet
    WALLET_CONNECT_TIMEOUT: 30000, // 30 segundos
    
    // Configuración de la UI - Tema Verde para Khipu
    THEME: {
        PRIMARY_COLOR: '#10b981',
        SECONDARY_COLOR: '#059669',
        ACCENT_COLOR: '#047857'
    },
    
    // URLs de las páginas de Khipu
    PAGES: {
        HOME: '/index.html',
        DASHBOARD: '/khipu.html',
        CONTRIBUTIONS: '/contribuciones.html',
        PARTICIPANTS: '/participantes.html',
        USERS: '/Usuarios.html',
        WALLET: '/Wallet.html',
        CURRENCY: '/Moneda.html',
        LEVELS: '/niveles.html'
    }
};

// Función para obtener la configuración
window.getConfig = () => window.APP_CONFIG;

console.log('🔧 Configuración de la aplicación cargada:', window.APP_CONFIG);
