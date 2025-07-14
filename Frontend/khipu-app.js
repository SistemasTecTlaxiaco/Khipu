// Variables del contrato Khipu
const CONTRACT_ID = 'CDS3VGIAZFIZUG3GL6LWAXLOXWCRIIBDPPRS4225LLLEHPGTFDNF4PQK';
const RPC_URL = 'https://rpc-futurenet.stellar.org';

// Variables globales para Freighter
let kit = null;
let publicKey = null;
let networkPassphrase = 'Test SDF Future Network ; October 2022'; // Para Futurenet

// Verificar si Freighter está instalado
function isFreighterAvailable() {
    return typeof window.freighterApi !== 'undefined';
}

// Función para inicializar la wallet
async function initializeWallet() {
    const connectBtn = document.getElementById('connect-wallet');
    const walletStatus = document.getElementById('wallet-status');
    
    if (!isFreighterAvailable()) {
        walletStatus.textContent = 'Freighter wallet no instalada';
        connectBtn.textContent = 'Instalar Freighter';
        connectBtn.onclick = () => window.open('https://freighter.app/', '_blank');
        return;
    }

    try {
        const isAllowed = await window.freighterApi.isAllowed();
        
        if (isAllowed) {
            publicKey = await window.freighterApi.getPublicKey();
            kit = window.freighterApi;
            window.kit = kit; // Make it globally available
            
            walletStatus.textContent = `Conectada: ${publicKey.slice(0, 8)}...${publicKey.slice(-8)}`;
            connectBtn.textContent = 'Desconectar';
            connectBtn.onclick = disconnectWallet;
            
            console.log('✅ Wallet conectada:', publicKey);
        } else {
            connectBtn.onclick = connectWallet;
        }
        
    } catch (error) {
        console.error('Error inicializando wallet:', error);
        walletStatus.textContent = 'Error de conexión';
    }
}

// Conectar wallet
async function connectWallet() {
    try {
        await window.freighterApi.setAllowed();
        await initializeWallet();
    } catch (error) {
        console.error('Error conectando wallet:', error);
        alert('Error al conectar la wallet: ' + error.message);
    }
}

// Desconectar wallet
function disconnectWallet() {
    kit = null;
    publicKey = null;
    window.kit = null;
    
    const connectBtn = document.getElementById('connect-wallet');
    const walletStatus = document.getElementById('wallet-status');
    
    walletStatus.textContent = 'Desconectada';
    connectBtn.textContent = 'Conectar Wallet';
    connectBtn.onclick = connectWallet;
    
    console.log('❌ Wallet desconectada');
}

// ==== FUNCIONES DEL CONTRATO KHIPU ====

// Contribuir a la tanda
async function contribute(userAddress, amount) {
    if (!kit) throw new Error('Wallet no conectada');
    
    try {
        console.log('💰 Realizando contribución:', { userAddress, amount });
        
        const server = new StellarSdk.Server(RPC_URL);
        const account = await server.getAccount(publicKey);
        
        const contract = new StellarSdk.Contract(CONTRACT_ID);
        
        const transaction = new StellarSdk.TransactionBuilder(account, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: networkPassphrase,
        })
        .addOperation(
            contract.call(
                'contribute',
                StellarSdk.Address.fromString(userAddress).toScVal(),
                StellarSdk.nativeToScVal(amount, { type: 'i128' })
            )
        )
        .setTimeout(30)
        .build();
        
        const signedTransaction = await kit.signTransaction(transaction.toXDR(), {
            networkPassphrase: networkPassphrase,
        });
        
        const transactionResult = await server.submitTransaction(
            StellarSdk.TransactionBuilder.fromXDR(signedTransaction, networkPassphrase)
        );
        
        console.log('✅ Contribución exitosa:', transactionResult);
        return transactionResult;
        
    } catch (error) {
        console.error('❌ Error en contribución:', error);
        throw error;
    }
}

// Obtener reputación de un usuario
async function getReputation(userAddress) {
    try {
        console.log('📊 Obteniendo reputación para:', userAddress);
        
        const server = new StellarSdk.Server(RPC_URL);
        const contract = new StellarSdk.Contract(CONTRACT_ID);
        
        const account = await server.getAccount(publicKey || 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF');
        
        const transaction = new StellarSdk.TransactionBuilder(account, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: networkPassphrase,
        })
        .addOperation(
            contract.call(
                'get_reputation',
                StellarSdk.Address.fromString(userAddress).toScVal()
            )
        )
        .setTimeout(30)
        .build();
        
        const result = await server.simulateTransaction(transaction);
        
        if (result.error) {
            throw new Error(result.error);
        }
        
        const scVal = result.result?.retval;
        if (scVal && scVal.instance) {
            const scoreData = scVal.instance().map;
            return {
                total: scoreData.get(StellarSdk.scValToNative(StellarSdk.nativeToScVal('total', { type: 'symbol' })))?.val || 0,
                on_time: scoreData.get(StellarSdk.scValToNative(StellarSdk.nativeToScVal('on_time', { type: 'symbol' })))?.val || 0,
                level: scoreData.get(StellarSdk.scValToNative(StellarSdk.nativeToScVal('level', { type: 'symbol' })))?.val || 'D'
            };
        }
        
        return { total: 0, on_time: 0, level: 'D' };
        
    } catch (error) {
        console.error('❌ Error obteniendo reputación:', error);
        return { total: 0, on_time: 0, level: 'D' };
    }
}

// Obtener total de contribuciones de un usuario
async function getUserTotal(userAddress) {
    try {
        console.log('💵 Obteniendo total del usuario:', userAddress);
        
        const server = new StellarSdk.Server(RPC_URL);
        const contract = new StellarSdk.Contract(CONTRACT_ID);
        
        const account = await server.getAccount(publicKey || 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF');
        
        const transaction = new StellarSdk.TransactionBuilder(account, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: networkPassphrase,
        })
        .addOperation(
            contract.call(
                'get_user_total',
                StellarSdk.Address.fromString(userAddress).toScVal()
            )
        )
        .setTimeout(30)
        .build();
        
        const result = await server.simulateTransaction(transaction);
        
        if (result.error) {
            throw new Error(result.error);
        }
        
        return StellarSdk.scValToNative(result.result?.retval) || 0;
        
    } catch (error) {
        console.error('❌ Error obteniendo total del usuario:', error);
        return 0;
    }
}

// Obtener contribuciones de un usuario
async function getUserContributions(userAddress) {
    try {
        console.log('📋 Obteniendo contribuciones del usuario:', userAddress);
        
        const server = new StellarSdk.Server(RPC_URL);
        const contract = new StellarSdk.Contract(CONTRACT_ID);
        
        const account = await server.getAccount(publicKey || 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF');
        
        const transaction = new StellarSdk.TransactionBuilder(account, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: networkPassphrase,
        })
        .addOperation(
            contract.call(
                'get_user_contributions',
                StellarSdk.Address.fromString(userAddress).toScVal()
            )
        )
        .setTimeout(30)
        .build();
        
        const result = await server.simulateTransaction(transaction);
        
        if (result.error) {
            throw new Error(result.error);
        }
        
        const contributions = StellarSdk.scValToNative(result.result?.retval) || [];
        return contributions;
        
    } catch (error) {
        console.error('❌ Error obteniendo contribuciones:', error);
        return [];
    }
}

// Obtener todos los participantes
async function getParticipants() {
    try {
        console.log('👥 Obteniendo participantes...');
        
        const server = new StellarSdk.Server(RPC_URL);
        const contract = new StellarSdk.Contract(CONTRACT_ID);
        
        const account = await server.getAccount(publicKey || 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF');
        
        const transaction = new StellarSdk.TransactionBuilder(account, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: networkPassphrase,
        })
        .addOperation(
            contract.call('get_participants')
        )
        .setTimeout(30)
        .build();
        
        const result = await server.simulateTransaction(transaction);
        
        if (result.error) {
            throw new Error(result.error);
        }
        
        const participants = StellarSdk.scValToNative(result.result?.retval) || [];
        return participants;
        
    } catch (error) {
        console.error('❌ Error obteniendo participantes:', error);
        return [];
    }
}

// Obtener configuración de la tanda
async function getTandaConfig() {
    try {
        console.log('⚙️ Obteniendo configuración de la tanda...');
        
        const server = new StellarSdk.Server(RPC_URL);
        const contract = new StellarSdk.Contract(CONTRACT_ID);
        
        const account = await server.getAccount(publicKey || 'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF');
        
        const transaction = new StellarSdk.TransactionBuilder(account, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: networkPassphrase,
        })
        .addOperation(
            contract.call('get_tanda_config')
        )
        .setTimeout(30)
        .build();
        
        const result = await server.simulateTransaction(transaction);
        
        if (result.error) {
            throw new Error(result.error);
        }
        
        const config = StellarSdk.scValToNative(result.result?.retval) || [0, null];
        return {
            weeks: config[0] || 0,
            admin: config[1] || null
        };
        
    } catch (error) {
        console.error('❌ Error obteniendo configuración:', error);
        return { weeks: 0, admin: null };
    }
}

// Inicializar tanda (solo admin)
async function initialize(adminAddress, weeks) {
    if (!kit) throw new Error('Wallet no conectada');
    
    try {
        console.log('🚀 Inicializando tanda:', { adminAddress, weeks });
        
        const server = new StellarSdk.Server(RPC_URL);
        const account = await server.getAccount(publicKey);
        
        const contract = new StellarSdk.Contract(CONTRACT_ID);
        
        const transaction = new StellarSdk.TransactionBuilder(account, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: networkPassphrase,
        })
        .addOperation(
            contract.call(
                'initialize',
                StellarSdk.Address.fromString(adminAddress).toScVal(),
                StellarSdk.nativeToScVal(weeks, { type: 'u32' })
            )
        )
        .setTimeout(30)
        .build();
        
        const signedTransaction = await kit.signTransaction(transaction.toXDR(), {
            networkPassphrase: networkPassphrase,
        });
        
        const transactionResult = await server.submitTransaction(
            StellarSdk.TransactionBuilder.fromXDR(signedTransaction, networkPassphrase)
        );
        
        console.log('✅ Tanda inicializada:', transactionResult);
        return transactionResult;
        
    } catch (error) {
        console.error('❌ Error inicializando tanda:', error);
        throw error;
    }
}

// Establecer semanas esperadas (solo admin)
async function setWeeks(adminAddress, weeks) {
    if (!kit) throw new Error('Wallet no conectada');
    
    try {
        console.log('📅 Estableciendo semanas:', { adminAddress, weeks });
        
        const server = new StellarSdk.Server(RPC_URL);
        const account = await server.getAccount(publicKey);
        
        const contract = new StellarSdk.Contract(CONTRACT_ID);
        
        const transaction = new StellarSdk.TransactionBuilder(account, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: networkPassphrase,
        })
        .addOperation(
            contract.call(
                'set_expected_weeks',
                StellarSdk.Address.fromString(adminAddress).toScVal(),
                StellarSdk.nativeToScVal(weeks, { type: 'u32' })
            )
        )
        .setTimeout(30)
        .build();
        
        const signedTransaction = await kit.signTransaction(transaction.toXDR(), {
            networkPassphrase: networkPassphrase,
        });
        
        const transactionResult = await server.submitTransaction(
            StellarSdk.TransactionBuilder.fromXDR(signedTransaction, networkPassphrase)
        );
        
        console.log('✅ Semanas establecidas:', transactionResult);
        return transactionResult;
        
    } catch (error) {
        console.error('❌ Error estableciendo semanas:', error);
        throw error;
    }
}

// ==== FUNCIONES AUXILIARES ====

// Formatear fecha
function formatDate(timestamp) {
    return new Date(timestamp * 1000).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Formatear cantidad
function formatAmount(amount) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Obtener clase CSS para status
function getStatusClass(level) {
    const statusMap = {
        'Aplus': 'status-a-plus',
        'A': 'status-a',
        'B': 'status-b',
        'C': 'status-c',
        'D': 'status-d'
    };
    return statusMap[level] || 'status-d';
}

// Mostrar notificación
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

console.log('📱 Khipu App cargada');
