# 🎓 Academia Blockchain - Plataforma Educativa Descentralizada

Una plataforma educativa completa construida con **Soroban Smart Contracts** en Stellar Blockchain.

## 🚀 Características

- **Gestión de Estudiantes**: Registro, edición y administración de estudiantes
- **Sistema de Docentes**: Gestión completa de profesores y sus especialidades
- **Cursos y Materias**: Creación y administración de contenido educativo
- **Certificados Verificables**: Generación de certificados en blockchain
- **Integración Wallet**: Conexión con Freighter Wallet
- **Frontend Moderno**: Interfaz responsive con Tailwind CSS

## 📁 Estructura del Proyecto

```
Contrato-Proyecto/
├── contracts/
│   └── hello-world/
│       ├── src/
│       │   ├── lib.rs          # Contrato principal Soroban
│       │   └── test.rs         # Tests del contrato
│       └── Cargo.toml
├── Frontend/
│   ├── index.html              # Página de inicio
│   ├── Inicio.html             # Panel principal
│   ├── Login.html              # Autenticación
│   ├── cursos.html             # Gestión de cursos
│   ├── cetificado.html         # Certificados
│   ├── materias.html           # Gestión de materias
│   ├── Usuarios.html           # Gestión de usuarios
│   ├── Wallet.html             # Billetera
│   ├── app.js                  # Lógica principal JS
│   └── config.js               # Configuración global
├── Cargo.toml                  # Workspace Rust
├── package.json                # Dependencias Node.js
└── hello_world.wasm           # Contrato compilado
```

## 🛠️ Instalación y Configuración

### Prerrequisitos

1. **Rust y Cargo** (versión 1.70+)
2. **Node.js** (versión 16+) 
3. **Freighter Wallet** (extensión del navegador)

```bash
# Verificar instalaciones
cargo --version
node --version
npm --version
```

### Configuración del Proyecto

1. **Clonar el repositorio**:
```bash
git clone https://github.com/Ariadnamonserrat10/Contrato-Proyecto.git
cd Contrato-Proyecto
```

2. **Instalar target WASM para Rust**:
```bash
rustup target add wasm32-unknown-unknown
```

3. **Instalar dependencias de Node.js**:
```bash
npm install
```

## 🔧 Compilación y Ejecución

### Opción 1: Usar VS Code Tasks (Recomendado)

1. Abrir el proyecto en VS Code
2. Presionar `Ctrl+Shift+P` (o `Cmd+Shift+P` en Mac)
3. Buscar "Tasks: Run Task"
4. Seleccionar la tarea deseada:
   - **"Build Soroban Contract"**: Compila el contrato
   - **"Start Frontend Server"**: Ejecuta el frontend
   - **"Start Frontend Dev Server"**: Servidor de desarrollo con auto-reload
   - **"Build Full Project"**: Compila todo el proyecto

### Opción 2: Comandos Manuales

**Compilar el contrato Soroban:**
```bash
npm run compile-contract
# O manualmente:
CARGO_TARGET_DIR=/tmp/cargo-target cargo build --target wasm32-unknown-unknown --release
cp /tmp/cargo-target/wasm32-unknown-unknown/release/hello_world.wasm ./
```

**Ejecutar tests:**
```bash
npm run test-contract
# O manualmente:
CARGO_TARGET_DIR=/tmp/cargo-target cargo test
```

**Ejecutar el frontend:**
```bash
# Servidor estático
npm run start

# Servidor de desarrollo (con auto-reload)
npm run dev

# Servidor alternativo
npm run serve
```

## 🌐 Acceso a la Aplicación

Una vez ejecutado el servidor, la aplicación estará disponible en:

- **URL Principal**: http://localhost:3000
- **Página de Inicio**: http://localhost:3000/index.html
- **Panel Principal**: http://localhost:3000/Inicio.html

## 🔗 Integración con Freighter Wallet

1. **Instalar Freighter**: Descargar desde [freighter.app](https://freighter.app/)
2. **Crear/Importar Wallet**: Configurar tu billetera Stellar
3. **Conectar a la DApp**: La aplicación detectará automáticamente Freighter
4. **Red de Pruebas**: El proyecto está configurado para **Stellar Futurenet**

## 🎯 Funcionalidades del Contrato

### Estudiantes
- `insert_estudiante(id, nombre, email)`
- `edit_estudiante(id, nuevo_nombre, nuevo_email)`
- `delete_estudiante(id)`
- `get_estudiante(id)`
- `buscar_estudiantes(nombre)`

### Docentes
- `insert_docente(id, nombre, apellidos, materia)`
- `edit_docente(id, nuevo_nombre, nuevos_apellidos, nueva_materia)`
- `delete_docente(id)`
- `get_docente(id)`
- `buscar_docente_por_nombre(nombre)`

### Cursos
- `registrar(id_curso, materia, titulo, id_docente)`
- `actualizar(id_curso, nuevos_datos)`
- `eliminar(id_curso)`
- `buscar(filtro)`

### Certificados
- `generar_certificado(id_estudiante, id_curso, calificacion, titulo, fecha)`

## 🔒 Configuración de Red

El proyecto está configurado para:
- **Red**: Stellar Futurenet
- **RPC URL**: `https://rpc-futurenet.stellar.org`
- **Passphrase**: `Test SDF Future Network ; October 2022`

## 🐛 Solución de Problemas

### Error de Permisos al Compilar
```bash
sudo chown -R $USER:$USER .
chmod -R 755 .
```

### Freighter No Detectado
1. Verificar que la extensión esté instalada y habilitada
2. Refrescar la página web
3. Verificar que el navegador permita extensiones en localhost

### Puerto en Uso
```bash
# Cambiar puerto en package.json o usar:
npx http-server Frontend -p 8080
```

## 📝 Scripts Disponibles

```bash
npm run start          # Servidor HTTP estático
npm run dev            # Servidor de desarrollo
npm run build          # Build del frontend
npm run serve          # Servidor alternativo
npm run compile-contract # Compilar contrato Soroban
npm run test-contract   # Ejecutar tests del contrato
```

## 🚀 Despliegue en Stellar

Para desplegar en Stellar Testnet o Mainnet:

1. **Instalar Soroban CLI**:
```bash
cargo install --locked soroban-cli
```

2. **Configurar red**:
```bash
soroban network add testnet --rpc-url https://rpc-testnet.stellar.org:443 --network-passphrase "Test SDF Network ; September 2015"
```

3. **Desplegar contrato**:
```bash
soroban contract deploy --wasm hello_world.wasm --network testnet --source your-secret-key
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit los cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🌟 Tecnologías Utilizadas

- **Soroban Smart Contracts** (Rust)
- **Stellar Blockchain**
- **JavaScript/HTML/CSS**
- **Tailwind CSS**
- **Freighter Wallet API**
- **Node.js & npm**

---

**Desarrollado con ❤️ para la educación descentralizada**
