#!/bin/bash

# 🎓 Script de Ejecución Completa - Academia Blockchain
# Automatización para ejecutar todo el proyecto Soroban + Frontend

echo "🚀 Iniciando Academia Blockchain - Plataforma Educativa Descentralizada"
echo "=================================================="

# Colores para la salida
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Función para imprimir con colores
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_step() {
    echo -e "${PURPLE}🔧 $1${NC}"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "Cargo.toml" ] || [ ! -d "Frontend" ]; then
    print_error "Error: Este script debe ejecutarse desde el directorio raíz del proyecto"
    print_info "Usa: cd /ruta/al/Contrato-Proyecto && ./run.sh"
    exit 1
fi

# Paso 1: Verificar prerrequisitos
print_step "Verificando prerrequisitos..."

# Verificar Rust
if ! command -v cargo &> /dev/null; then
    print_error "Cargo/Rust no está instalado"
    print_info "Instala desde: https://rustup.rs/"
    exit 1
fi
print_status "Rust/Cargo encontrado: $(cargo --version)"

# Verificar Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js no está instalado"
    print_info "Instala desde: https://nodejs.org/"
    exit 1
fi
print_status "Node.js encontrado: $(node --version)"

# Verificar npm
if ! command -v npm &> /dev/null; then
    print_error "npm no está instalado"
    exit 1
fi
print_status "npm encontrado: $(npm --version)"

# Paso 2: Verificar target WASM
print_step "Verificando target wasm32-unknown-unknown..."
if ! rustup target list --installed | grep -q "wasm32-unknown-unknown"; then
    print_warning "Target wasm32-unknown-unknown no encontrado, instalando..."
    rustup target add wasm32-unknown-unknown
fi
print_status "Target WASM configurado correctamente"

# Paso 3: Instalar dependencias de Node.js si es necesario
if [ ! -d "node_modules" ]; then
    print_step "Instalando dependencias de Node.js..."
    npm install
    print_status "Dependencias instaladas"
else
    print_status "Dependencias de Node.js ya instaladas"
fi

# Paso 4: Compilar el contrato Soroban
print_step "Compilando contrato Soroban..."
export CARGO_TARGET_DIR=/tmp/cargo-target
if cargo build --target wasm32-unknown-unknown --release; then
    if cp /tmp/cargo-target/wasm32-unknown-unknown/release/hello_world.wasm ./; then
        print_status "Contrato compilado exitosamente ($(ls -lh hello_world.wasm | awk '{print $5}'))"
    else
        print_error "Error copiando el archivo WASM"
        exit 1
    fi
else
    print_error "Error compilando el contrato Soroban"
    exit 1
fi

# Paso 5: Ejecutar tests del contrato
print_step "Ejecutando tests del contrato..."
if CARGO_TARGET_DIR=/tmp/cargo-target cargo test; then
    print_status "Tests del contrato pasaron correctamente"
else
    print_warning "Algunos tests fallaron, pero continuando..."
fi

# Paso 6: Mostrar información del proyecto
echo ""
echo -e "${CYAN}🎯 Información del Proyecto${NC}"
echo "================================"
print_info "Contrato WASM: hello_world.wasm ($(ls -lh hello_world.wasm | awk '{print $5}'))"
print_info "Frontend: Configurado en ./Frontend/"
print_info "Configuración: Stellar Futurenet"
print_info "Wallet: Freighter (instalar desde https://freighter.app/)"

# Paso 7: Preguntar qué servidor usar
echo ""
echo -e "${CYAN}🌐 Opciones de Servidor Frontend${NC}"
echo "=================================="
echo "1. Servidor HTTP estático (Recomendado para producción)"
echo "2. Servidor de desarrollo con auto-reload"
echo "3. Servidor alternativo en puerto 8080"
echo "4. Solo compilar (no ejecutar servidor)"

read -p "Selecciona una opción (1-4) [default: 1]: " choice
choice=${choice:-1}

case $choice in
    1)
        print_step "Iniciando servidor HTTP estático en puerto 3000..."
        print_info "La aplicación estará disponible en: http://localhost:3000"
        print_info "Presiona Ctrl+C para detener el servidor"
        echo ""
        npm run start
        ;;
    2)
        print_step "Iniciando servidor de desarrollo con auto-reload..."
        print_info "La aplicación estará disponible en: http://localhost:3000"
        print_info "Presiona Ctrl+C para detener el servidor"
        echo ""
        npm run dev
        ;;
    3)
        print_step "Iniciando servidor alternativo en puerto 8080..."
        print_info "La aplicación estará disponible en: http://localhost:8080"
        print_info "Presiona Ctrl+C para detener el servidor"
        echo ""
        npm run serve
        ;;
    4)
        print_status "Compilación completada. No se ejecutó ningún servidor."
        print_info "Para ejecutar manualmente:"
        print_info "  - npm run start (servidor estático)"
        print_info "  - npm run dev (servidor de desarrollo)"
        print_info "  - npm run serve (servidor alternativo)"
        ;;
    *)
        print_error "Opción inválida"
        exit 1
        ;;
esac

echo ""
print_status "¡Academia Blockchain lista para usar! 🎓"
