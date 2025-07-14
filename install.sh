#!/bin/bash

# 🚀 Khipu - Script de Instalación Automatizada
# Este script instala y configura todo automáticamente

echo "🏦 Bienvenido a Khipu - Instalación Automatizada"
echo "======================================================"

# Función para verificar si un comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar Node.js
echo "🔍 Verificando Node.js..."
if command_exists node; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js encontrado: $NODE_VERSION"
else
    echo "❌ Node.js no encontrado. Por favor instala Node.js desde https://nodejs.org"
    exit 1
fi

# Verificar npm
echo "🔍 Verificando npm..."
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    echo "✅ npm encontrado: $NPM_VERSION"
else
    echo "❌ npm no encontrado. Algo está mal con la instalación de Node.js"
    exit 1
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencias instaladas correctamente"
else
    echo "❌ Error al instalar dependencias"
    exit 1
fi

# Verificar Rust (opcional para compilar contrato)
echo "🔍 Verificando Rust..."
if command_exists cargo; then
    RUST_VERSION=$(rustc --version)
    echo "✅ Rust encontrado: $RUST_VERSION"
    
    echo "🔨 Compilando contrato blockchain..."
    npm run compile-contract
    
    if [ $? -eq 0 ]; then
        echo "✅ Contrato compilado correctamente"
        
        echo "🧪 Ejecutando tests..."
        npm run test-contract
        
        if [ $? -eq 0 ]; then
            echo "✅ Todos los tests pasaron"
        else
            echo "⚠️ Algunos tests fallaron, pero la aplicación puede funcionar"
        fi
    else
        echo "⚠️ Error al compilar contrato, usando versión pre-compilada"
    fi
else
    echo "⚠️ Rust no encontrado. Usando contrato pre-compilado."
    echo "   Para desarrollo completo, instala Rust desde https://rustup.rs"
fi

# Finalización
echo ""
echo "🎉 ¡Instalación Completada!"
echo "=========================="
echo ""
echo "🚀 Para ejecutar la aplicación:"
echo "   npm start        (versión completa)"
echo "   npm run mvp      (demo MVP)"
echo "   npm run demo     (mismo que mvp)"
echo ""
echo "🌐 La aplicación se abrirá en: http://localhost:3000"
echo ""
echo "📚 Para más información, lee README_INSTALACION.md"
echo ""
echo "¿Ejecutar la aplicación ahora? (y/n)"
read -r response

if [[ "$response" =~ ^([yY][eE][sS]|[yY]|[sS][iI])$ ]]; then
    echo "🚀 Iniciando Khipu..."
    npm run mvp
else
    echo "👍 Perfecto. Ejecuta 'npm start' cuando estés listo."
fi

echo ""
echo "🤝 ¡Gracias por usar Khipu!"
echo "   GitHub: https://github.com/tu-usuario/Contrato-Proyecto"
echo "   Soporte: soporte@khipu.com"
