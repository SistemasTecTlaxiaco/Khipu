# 🚀 Guía de Despliegue en Vercel - Khipu DApp

## Pasos para Desplegar en Vercel

### 1. Preparación del Repositorio ✅
El proyecto ya está configurado con:
- ✅ `vercel.json` - Configuración de rutas y archivos estáticos
- ✅ `index.html` - Página de inicio con redirección automática
- ✅ `package.json` - Scripts de build para Vercel
- ✅ Archivos estáticos optimizados

### 2. Despliegue Manual en Vercel

#### Opción A: Desde la Web de Vercel (Recomendado)

1. **Ir a Vercel Dashboard:**
   - Visita: https://vercel.com/
   - Hacer login con tu cuenta de GitHub

2. **Conectar Repositorio:**
   - Click en "Add New..." → "Project"
   - Buscar e importar: `SistemasTecTlaxiaco/Khipu`
   - Click en "Import"

3. **Configurar el Proyecto:**
   ```
   Project Name: khipu-dapp
   Framework Preset: Other
   Root Directory: ./
   Build Command: npm run vercel-build
   Output Directory: ./
   Install Command: npm install
   ```

4. **Variables de Entorno (Opcional):**
   ```
   NODE_ENV=production
   ```

5. **Desplegar:**
   - Click en "Deploy"
   - Esperar a que termine el build (2-3 minutos)

#### Opción B: Desde CLI (Alternativo)

1. **Instalar Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login en Vercel:**
   ```bash
   vercel login
   ```
   - Seguir las instrucciones en el navegador
   - Autorizar con GitHub

3. **Desplegar:**
   ```bash
   cd /ruta/a/tu/proyecto
   vercel --prod
   ```

### 3. Configuración Post-Despliegue

#### Configurar Dominio Personalizado (Opcional)
1. En Vercel Dashboard → Proyecto → Settings → Domains
2. Agregar dominio personalizado
3. Configurar DNS según las instrucciones

#### Variables de Entorno
Si necesitas configurar variables específicas:
1. Vercel Dashboard → Proyecto → Settings → Environment Variables
2. Agregar las variables necesarias

### 4. Estructura de URLs Desplegadas

- **Homepage:** `https://tu-proyecto.vercel.app/`
- **MVP Principal:** `https://tu-proyecto.vercel.app/mvp-khipu.html`
- **App Original:** `https://tu-proyecto.vercel.app/Frontend/khipu.html`

### 5. Características del Despliegue

- ✅ **Redirección Automática:** index.html → mvp-khipu.html
- ✅ **Archivos Estáticos:** Todos los JS, CSS, HTML servidos directamente
- ✅ **CORS Habilitado:** Para interacción con Freighter Wallet
- ✅ **Rutas Optimizadas:** Configuradas en vercel.json
- ✅ **Build Automático:** Se ejecuta en cada push a master

### 6. Verificación del Despliegue

Después del despliegue, verificar que funcionen:

1. **Página Principal:** ✅ Redirección automática
2. **MVP Interface:** ✅ React + Firebase + Soroban
3. **Wallet Connection:** ✅ Freighter integration
4. **Smart Contract:** ✅ Stellar Futurenet connectivity

### 7. Monitoreo y Mantenimiento

- **Logs:** Vercel Dashboard → Proyecto → Functions
- **Analytics:** Vercel Dashboard → Proyecto → Analytics
- **Re-deploy:** Automático en cada push a master

### 8. Troubleshooting

**Error: Build Failed**
- Verificar que todas las dependencias estén en package.json
- Revisar los logs de build en Vercel Dashboard

**Error: 404 en archivos**
- Verificar rutas en vercel.json
- Asegurar que los archivos existan en el repositorio

**Error: Wallet no conecta**
- Verificar HTTPS en producción
- Freighter solo funciona en dominios seguros

## 🎉 ¡Listo!

Tu aplicación Khipu estará disponible en una URL como:
`https://khipu-dapp-xxx.vercel.app`

### Links Útiles:
- 📚 [Documentación Vercel](https://vercel.com/docs)
- 🔗 [GitHub Repository](https://github.com/SistemasTecTlaxiaco/Khipu)
- 🏛️ [Stellar Documentation](https://developers.stellar.org/)
