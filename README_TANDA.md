# 💰 Tanda Express - Sistema de Ahorro Grupal Descentralizado

**Tanda Express** es una aplicación descentralizada (dApp) construida con Soroban (Stellar blockchain) que permite la gestión de tandas (sistemas de ahorro grupal) de manera transparente y automatizada.

## 🎯 Funcionalidades Principales

### Para Participantes:
- **Contribuir**: Realizar aportes semanales a la tanda
- **Reputación**: Sistema de scoring basado en puntualidad
- **Historial**: Ver todas las contribuciones realizadas
- **Dashboard**: Monitoreo en tiempo real del progreso

### Para Administradores:
- **Inicializar Tanda**: Configurar nueva tanda con semanas esperadas
- **Gestionar Participantes**: Ver todos los miembros activos
- **Configuración**: Actualizar parámetros de la tanda

## 🏗️ Arquitectura del Proyecto

```
📦 Contrato-Proyecto/
├── 🦀 contracts/hello-world/        # Smart Contract Soroban
│   ├── src/
│   │   ├── lib.rs                   # Contrato principal Tanda Express
│   │   └── test.rs                  # Tests del contrato
│   └── Cargo.toml
├── 🌐 Frontend/                     # Interfaz Web
│   ├── tanda.html                   # Dashboard principal
│   ├── tanda-app.js                 # Lógica de la aplicación
│   ├── config.js                    # Configuración
│   └── index.html                   # Página de bienvenida
├── 📄 package.json                  # Configuración Node.js
├── 🦀 Cargo.toml                    # Configuración Rust
└── 📋 README_TANDA.md               # Esta documentación
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- **Rust** (para compilar el contrato)
- **Node.js** (para el frontend)
- **Freighter Wallet** (extensión del navegador)

### 1. Clonar y configurar
```bash
git clone <repository-url>
cd Contrato-Proyecto
npm install
```

### 2. Compilar el contrato
```bash
# Compilar contrato Soroban
npm run compile-contract

# Ejecutar tests
npm run test-contract
```

### 3. Ejecutar la aplicación
```bash
# Servidor de desarrollo
npm run dev

# O servidor de producción
npm start
```

La aplicación estará disponible en: http://localhost:3000

## 📋 Funciones del Smart Contract

### Funciones Públicas

#### `contribute(env: Env, from: Address, amount: i128)`
- **Descripción**: Registra una contribución de un usuario
- **Parámetros**: 
  - `from`: Dirección del contribuyente
  - `amount`: Cantidad a contribuir
- **Autorización**: Requiere firma del usuario

#### `get_reputation(env: Env, user: Address) -> Score`
- **Descripción**: Obtiene la reputación de un usuario
- **Retorna**: Estructura Score con total, contribuciones a tiempo y nivel
- **Niveles**: A+ (100%+), A (80%+), B (60%+), C (40%+), D (<40%)

#### `get_user_total(env: Env, user: Address) -> i128`
- **Descripción**: Suma total de contribuciones de un usuario
- **Retorna**: Cantidad total contribuida

#### `get_participants(env: Env) -> Vec<Address>`
- **Descripción**: Lista todos los participantes de la tanda
- **Retorna**: Vector con direcciones de los participantes

#### `initialize(env: Env, admin: Address, weeks: u32)`
- **Descripción**: Inicializa una nueva tanda (solo una vez)
- **Autorización**: Requiere firma del administrador

#### `set_expected_weeks(env: Env, admin: Address, weeks: u32)`
- **Descripción**: Actualiza las semanas esperadas de la tanda
- **Autorización**: Solo el administrador

### Estructuras de Datos

```rust
pub struct Score {
    pub total: u32,      // Semanas esperadas total
    pub on_time: u32,    // Contribuciones realizadas
    pub level: Symbol,   // Nivel de reputación (A+, A, B, C, D)
}

pub struct Contribution {
    pub amount: i128,       // Cantidad contribuida
    pub timestamp: u64,     // Momento de la contribución
    pub week_number: u32,   // Número de semana
}
```

## 🛠️ Comandos Disponibles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo con live reload
npm start               # Servidor de producción

# Contrato
npm run compile-contract # Compilar contrato Soroban
npm run test-contract   # Ejecutar tests del contrato

# Utilidades
npm run build           # Construir para producción
npm run serve           # Servidor estático
```

## 🌐 Configuración de Red

### Testnet/Futurenet
```javascript
// config.js
CONTRACT_ID: 'CDS3VGIAZFIZUG3GL6LWAXLOXWCRIIBDPPRS4225LLLEHPGTFDNF4PQK'
RPC_URL: 'https://rpc-futurenet.stellar.org'
NETWORK_PASSPHRASE: 'Test SDF Future Network ; October 2022'
```

### Wallet Integration
- **Freighter Wallet**: Extensión oficial de Stellar
- **Auto-conexión**: Detecta automáticamente si está instalada
- **Manejo de errores**: Mensajes informativos para el usuario

## 🎨 Interfaz de Usuario

### Dashboard Principal (`/tanda.html`)
- **📊 Estadísticas**: Contribución total, reputación, participantes
- **💸 Contribuir**: Formulario para realizar aportes
- **📋 Historial**: Lista de contribuciones propias
- **⚙️ Admin Panel**: Solo visible para administradores

### Características de UX
- **Responsive Design**: Optimizado para móvil y escritorio
- **Tema Verde**: Colores que evocan confianza y crecimiento
- **Feedback Visual**: Indicadores de progreso y estado
- **Notificaciones**: Confirmaciones de transacciones

## 🔧 Desarrollo y Testing

### Tests del Contrato
```bash
# Ejecutar todos los tests
cargo test

# Tests individuales disponibles:
# - test_contribute
# - test_reputation_scoring  
# - test_participants_tracking
# - test_admin_only_functions
# - test_multiple_contributions
# - test_reputation_levels
# - test_initialize_tanda
```

### Estructura de Tests
- **✅ Contribuciones**: Verificar registro correcto
- **✅ Reputación**: Cálculo de scores y niveles
- **✅ Participantes**: Tracking automático
- **✅ Administración**: Funciones solo para admin
- **✅ Múltiples Contribuciones**: Manejo de secuencias
- **✅ Niveles**: Sistema de calificación A+ a D

## 🌟 Casos de Uso

### Tanda Familiar
- 4 familias, $100 semanales, 4 semanas
- Cada familia recibe $400 en su turno
- Reputación basada en puntualidad

### Tanda Empresarial
- 10 empleados, $50 semanales, 10 semanas
- Cada empleado recibe $500 en su turno
- Sistema transparente de contribuciones

### Club de Ahorro
- 6 amigos, $200 semanales, 6 semanas
- Cada amigo recibe $1200 en su turno
- Tracking automático de reputación

## 🤝 Contribuir

1. Fork del repositorio
2. Crear feature branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push branch (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver `LICENSE` para más detalles.

---

**Desarrollado con ❤️ usando Soroban y Stellar blockchain**

🌟 **¿Te gusta el proyecto? ¡Dale una estrella!** ⭐

## 📞 Soporte

- **GitHub Issues**: Para reportar bugs o solicitar features
- **Documentación Soroban**: https://soroban.stellar.org/
- **Stellar Discord**: Para soporte de la comunidad
