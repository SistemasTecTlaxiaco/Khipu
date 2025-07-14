# 🎯 Configuración Rápida - Khipu

## ⚡ INSTALACIÓN SÚPER RÁPIDA (1 Minuto)

### Para Usuarios Normales (Solo Ver/Usar):
```bash
git clone https://github.com/tu-usuario/Contrato-Proyecto.git
cd Contrato-Proyecto
npm install
npm run mvp
```

### Para Desarrolladores:
```bash
git clone https://github.com/tu-usuario/Contrato-Proyecto.git
cd Contrato-Proyecto
./install.sh
```

## 🔧 Comandos Esenciales

| Comando | Descripción | Para Quién |
|---------|-------------|------------|
| `npm run mvp` | Demo completo con login social | 👥 Usuarios finales |
| `npm start` | Aplicación completa | 👥 Usuarios finales |
| `npm run demo` | Mismo que mvp | 👥 Usuarios finales |
| `npm run original` | Versión básica | 🔧 Desarrolladores |
| `npm run help` | Ver todos los comandos | 🆘 Ayuda |

## 🌐 URLs de la Aplicación

- **MVP Demo**: http://localhost:3000/mvp-khipu.html
- **Versión Original**: http://localhost:3000/khipu.html
- **Frontend Solo**: http://localhost:3000/Frontend/

## ⚠️ Problemas Comunes

### "npm not found"
```bash
# Instalar Node.js desde: https://nodejs.org
# Después ejecutar: npm --version
```

### "Puerto 3000 en uso"
```bash
# Usar puerto diferente:
npx http-server . -p 8080 -o mvp-khipu.html --cors
```

### "Error de permisos"
```bash
# En Linux/Mac:
sudo npm install -g http-server
# En Windows: Ejecutar como administrador
```

## 🆘 Ayuda Rápida

¿Problemas? Ejecuta:
```bash
npm run help
```

O lee el archivo completo: `README_INSTALACION.md`
