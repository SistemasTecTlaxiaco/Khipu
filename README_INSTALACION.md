# 🏦 Khipu - Guía de Instalación Completa

> **Sistema de Ahorro Grupal Descentralizado con Blockchain**  
> Una aplicación moderna que combina la tradición de las tandas mexicanas con tecnología blockchain

## 📋 ¿Qué es Khipu?

**Khipu** es una aplicación web que digitaliza el sistema tradicional de ahorro grupal mexicano (tandas) usando tecnología blockchain- 📧 **Email**: soporte@khipu.com
- 💬 **Discord**: [Únete a nuestra comunidad](https://discord.gg/khipu)
- 🐛 **Issues**: [GitHub Issues](https://github.com/tu-usuario/Contrato-Proyecto/issues)
- 📚 **Documentación**: [Docs completas](https://docs.khipu.com)rmite a grupos de personas ahorrar juntos de forma transparente y segura.

### 🎯 Características Principales
- 💰 **Aportes Semanales**: $10 USD por semana por participante
- 🔐 **Seguridad Blockchain**: Transacciones verificables en Stellar
- 📱 **Login Social**: Ingresa con Google o Facebook
- 🤝 **Invitaciones WhatsApp**: Invita amigos fácilmente
- 📊 **Reputación**: Sistema de calificación transparente
- 💎 **Wallet Automático**: Se crea tu billetera digital automáticamente

---

## 🚀 INSTALACIÓN RÁPIDA (Para Usuarios)

### Opción 1: Solo Ver el Demo 🎮
```bash
# 1. Descargar el proyecto
git clone https://github.com/tu-usuario/Contrato-Proyecto.git
cd Contrato-Proyecto

# 2. Instalar dependencias (solo una vez)
npm install

# 3. Ejecutar la aplicación
npm run mvp
```

**¡Listo!** Tu navegador abrirá automáticamente en: `http://localhost:3000`

### Opción 2: Instalación Completa ⚡

#### **Pre-requisitos:**
- **Node.js** (versión 16 o superior) - [Descargar aquí](https://nodejs.org)
- **Git** - [Descargar aquí](https://git-scm.com)

#### **Pasos de Instalación:**

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/Contrato-Proyecto.git
cd Contrato-Proyecto

# 2. Instalar dependencias
npm install

# 3. Compilar el contrato blockchain (opcional)
npm run compile-contract

# 4. Ejecutar tests (opcional)
npm run test-contract

# 5. Iniciar la aplicación
npm start
```

---

## 🛠️ INSTALACIÓN PARA DESARROLLADORES

### **Requisitos del Sistema:**
- **Rust** 1.70+ - [Instalar Rust](https://rustup.rs)
- **Node.js** 16+ - [Instalar Node](https://nodejs.org)
- **Soroban CLI** - [Instalar Soroban](https://soroban.stellar.org/docs/getting-started/setup)

### **1. Configuración del Entorno:**

```bash
# Instalar Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# Agregar target wasm32
rustup target add wasm32-unknown-unknown

# Instalar Soroban CLI
cargo install soroban-cli

# Verificar instalación
soroban --version
```

### **2. Configuración del Proyecto:**

```bash
# Clonar repositorio
git clone <repository-url>
cd Contrato-Proyecto

# Instalar dependencias Node.js
npm install

# Instalar dependencias Rust (para el contrato)
cargo build
```

### **3. Compilación del Smart Contract:**

```bash
# Compilar contrato para WASM
npm run compile-contract

# O manualmente:
CARGO_TARGET_DIR=/tmp/cargo-target cargo build --target wasm32-unknown-unknown --release
cp /tmp/cargo-target/wasm32-unknown-unknown/release/hello_world.wasm ./
```

### **4. Ejecutar Tests:**

```bash
# Tests del contrato
npm run test-contract

# Tests específicos
cargo test test_contribute
cargo test test_reputation_scoring
```

---

## 🌐 CONFIGURACIÓN DE RED

### **Para Desarrollo (Testnet):**
```javascript
// src/services/ContractClient.js
const CONFIG = {
    CONTRACT_ID: 'CDS3VGIAZFIZUG3GL6LWAXLOXWCRIIBDPPRS4225LLLEHPGTFDNF4PQK',
    RPC_URL: 'https://rpc-futurenet.stellar.org',
    NETWORK_PASSPHRASE: 'Test SDF Future Network ; October 2022'
};
```

### **Para Producción (Mainnet):**
```javascript
const CONFIG = {
    CONTRACT_ID: 'TU_CONTRACT_ID_MAINNET',
    RPC_URL: 'https://rpc-mainnet.stellar.org',
    NETWORK_PASSPHRASE: 'Public Global Stellar Network ; September 2015'
};
```

---

## 📱 VERSIONES DISPONIBLES

### **🚀 MVP Version (Recomendada)**
- **Comando**: `npm run mvp`
- **URL**: `http://localhost:3000/mvp-khipu.html`
- **Características**: Login social, wallet automático, WhatsApp
- **Para**: Usuarios finales y demos

### **🔧 Versión Original**
- **Comando**: `npm run original`
- **URL**: `http://localhost:3000/khipu.html`
- **Características**: Versión básica con Freighter Wallet
- **Para**: Desarrolladores y testing

### **⚙️ Versión de Desarrollo**
- **Comando**: `npm run dev`
- **URL**: `http://localhost:3000`
- **Características**: Live reload, debugging
- **Para**: Desarrollo activo

---

## 🎮 CÓMO USAR LA APLICACIÓN

### **Para Usuarios Finales:**

#### **1. Primer Acceso:**
1. Abre `http://localhost:3000` en tu navegador
2. Haz clic en "Ingresar con Google" o "Ingresar con Facebook"
3. Tu wallet blockchain se crea automáticamente
4. ¡Ya puedes usar la aplicación!

#### **2. Unirte a una Tanda:**
1. En el dashboard, ve la información de la tanda actual
2. Haz clic en "Contribuir $10 USD"
3. Confirma la transacción
4. Tu contribución queda registrada en blockchain

#### **3. Invitar Amigos:**
1. Haz clic en "Invitar por WhatsApp"
2. Selecciona contactos de WhatsApp
3. Se envía automáticamente tu código de referido
4. Ganas puntos de reputación por cada invitado

#### **4. Ver tu Progreso:**
- **Reputación**: A+, A, B, C, o D según puntualidad
- **Contribuciones**: Historial completo de aportes
- **Participantes**: Quién más está en tu tanda

### **Para Administradores:**

#### **Crear Nueva Tanda:**
```javascript
// En la consola del navegador (F12)
await ContractClient.initializeKhipu(admin_address, 12); // 12 semanas
```

#### **Configurar Tanda:**
```javascript
await ContractClient.setExpectedWeeks(admin_address, 16); // Cambiar a 16 semanas
```

---

## 🔧 COMANDOS DISPONIBLES

### **Comandos de Usuario:**
```bash
npm start          # Iniciar aplicación (producción)
npm run mvp        # Ejecutar MVP demo
npm run dev        # Servidor desarrollo con live reload
```

### **Comandos de Desarrollo:**
```bash
npm run compile-contract    # Compilar smart contract
npm run test-contract      # Ejecutar tests del contrato
npm run build             # Build completo del proyecto
npm run serve             # Servidor estático simple
```

### **Scripts Personalizados:**
```bash
# Ejecutar solo el frontend original
npm run original

# Limpiar y recompilar todo
npm run clean && npm run build

# Ejecutar en modo debug
DEBUG=true npm start
```

---

## 🏗️ ARQUITECTURA DEL PROYECTO

```
📦 Khipu
├── 🦀 Smart Contract (Rust/Soroban)
│   ├── contracts/hello-world/src/lib.rs    # Lógica principal de tanda
│   ├── Funciones: contribute(), get_reputation()
│   └── Almacena: participantes, contribuciones, scores
│
├── 🌐 Frontend Moderno (JavaScript/HTML)
│   ├── mvp-khipu.html                      # Interfaz principal MVP
│   ├── src/services/AuthService.js         # Login con Firebase
│   ├── src/services/ContractClient.js      # Comunicación blockchain
│   └── src/components/WhatsAppInvite.js    # Sistema de invitaciones
│
├── 🔐 Servicios Backend
│   ├── Firebase Auth (login social)
│   ├── Stellar Network (blockchain)
│   └── WhatsApp Business API (invitaciones)
│
└── 💾 Almacenamiento
    ├── Blockchain (contribuciones, reputación)
    ├── LocalStorage (wallets encriptados)
    └── Firebase (perfiles de usuario)
```

---

## 🔍 SOLUCIÓN DE PROBLEMAS

### **Problemas Comunes:**

#### **❌ Error: "npm not found"**
```bash
# Solución: Instalar Node.js
# Descargar desde: https://nodejs.org
# Verificar: node --version && npm --version
```

#### **❌ Error: "cargo not found"**
```bash
# Solución: Instalar Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env
```

#### **❌ Error: "Port 3000 already in use"**
```bash
# Solución: Cambiar puerto
npx http-server . -p 8080 -o mvp-khipu.html --cors
```

#### **❌ Error: "Contract not found"**
```bash
# Solución: Compilar contrato primero
npm run compile-contract
```

#### **❌ Error: "Wallet connection failed"**
- Asegúrate de que el navegador permita popups
- Refresca la página e intenta de nuevo
- Verifica que JavaScript esté habilitado

### **Logs y Debugging:**

#### **Ver logs del contrato:**
```bash
# Ejecutar tests con output detallado
RUST_LOG=debug cargo test test_contribute -- --nocapture
```

#### **Debug en navegador:**
```javascript
// Abrir consola del navegador (F12)
// Ver logs de la aplicación
console.log(window.Khipu);
```

---

## 🚀 DESPLIEGUE A PRODUCCIÓN

### **1. Preparar para Producción:**
```bash
# Build optimizado
npm run build

# Verificar funcionamiento
npm run serve
```

### **2. Configurar Dominio:**
```bash
# Ejemplo con GitHub Pages
npm install -g gh-pages

# Deploy
npm run build
gh-pages -d .
```

### **3. Variables de Entorno:**
```javascript
// Crear config.prod.js
const PRODUCTION_CONFIG = {
    CONTRACT_ID: 'tu_contract_id_real',
    RPC_URL: 'https://rpc-mainnet.stellar.org',
    FIREBASE_CONFIG: {
        apiKey: 'tu_api_key_real',
        authDomain: 'tu_dominio.firebaseapp.com'
    }
};
```

---

## 📞 SOPORTE Y COMUNIDAD

### **🆘 Necesitas Ayuda:**
- 📧 **Email**: soporte@tandaexpress.com
- 💬 **Discord**: [Únete a nuestra comunidad](https://discord.gg/tandaexpress)
- 📋 **Issues**: [GitHub Issues](https://github.com/tu-usuario/Contrato-Proyecto/issues)
- 📚 **Documentación**: [Docs completas](https://docs.tandaexpress.com)

### **🤝 Contribuir al Proyecto:**
1. Fork del repositorio
2. Crear rama: `git checkout -b feature/mi-nueva-feature`
3. Commit: `git commit -am 'Agregar nueva feature'`
4. Push: `git push origin feature/mi-nueva-feature`
5. Crear Pull Request

### **📚 Recursos Adicionales:**
- [Soroban Documentation](https://soroban.stellar.org/docs)
- [Stellar Developer Portal](https://developers.stellar.org)
- [Firebase Auth Guide](https://firebase.google.com/docs/auth)
- [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)

---

## 📄 LICENCIA

Este proyecto está bajo la **Licencia MIT**. Puedes usarlo, modificarlo y distribuirlo libremente.

---

## 🌟 ¿Te Gusta el Proyecto?

Si **Khipu** te resulta útil:
- ⭐ **Dale una estrella** en GitHub
- 🐦 **Compártelo** en redes sociales
- 🤝 **Contribuye** con código o ideas
- 💬 **Únete** a nuestra comunidad

---

**Desarrollado con ❤️ por la comunidad blockchain mexicana**

🚀 **¡Únete a la revolución del ahorro digital!** 🇲🇽
