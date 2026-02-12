# Guía de Despliegue en Red Local

Esta guía te ayudará a desplegar el Portal Web ChatBot IPSP en tu red local.

## 📋 Requisitos Previos

- Node.js instalado (versión 18 o superior)
- npm instalado
- Dependencias del proyecto instaladas: `npm install`

## 🚀 Opciones de Despliegue

### Opción 1: Servidor de Desarrollo (Recomendado para desarrollo)

**Ventajas:**
- Hot Module Replacement (HMR) - recarga automática al hacer cambios
- Más rápido para desarrollo
- Errores detallados en consola

**Comandos:**

```bash
# Iniciar servidor de desarrollo en red local
npm run dev:host

# O directamente con vite
npm run dev
```

**Acceso:**
- Local: `http://localhost:5173`
- Red local: `http://[TU_IP_LOCAL]:5173`

Para encontrar tu IP local:
- Windows: `ipconfig` (busca "Dirección IPv4")
- En la terminal verás algo como: `Network: http://192.168.1.100:5173`

---

### Opción 2: Build de Producción + Preview (Recomendado para testing)

**Ventajas:**
- Versión optimizada (más rápida)
- Simula el entorno de producción
- Archivos minificados

**Comandos:**

```bash
# 1. Construir la aplicación
npm run build

# 2. Previsualizar el build en red local
npm run preview:host
```

**Acceso:**
- Local: `http://localhost:4173`
- Red local: `http://[TU_IP_LOCAL]:4173`

---

### Opción 3: Build de Producción + Servidor HTTP Personalizado

#### Con `serve` (Simple y efectivo)

```bash
# 1. Instalar serve globalmente
npm install -g serve

# 2. Construir la aplicación
npm run build

# 3. Servir los archivos estáticos
serve -s dist -l 3000
```

**Acceso:** `http://[TU_IP_LOCAL]:3000`

#### Con `http-server`

```bash
# 1. Instalar http-server globalmente
npm install -g http-server

# 2. Construir la aplicación
npm run build

# 3. Servir los archivos
http-server dist -p 8080
```

**Acceso:** `http://[TU_IP_LOCAL]:8080`

---

## 🔧 Configuración Personalizada

### Cambiar el Puerto

Edita `vite.config.ts`:

```typescript
server: {
  port: 8080, // Cambia a tu puerto deseado
}
```

### Configurar IP Específica

```typescript
server: {
  host: '192.168.1.100', // Tu IP específica
  port: 5173,
}
```

---

## 🔒 Firewall y Seguridad

### Windows Firewall

Si otros dispositivos no pueden acceder, permite el puerto en el firewall:

```powershell
# PowerShell como administrador
New-NetFirewallRule -DisplayName "Vite Dev Server" -Direction Inbound -Port 5173 -Protocol TCP -Action Allow
```

O manualmente:
1. Panel de Control → Sistema y Seguridad → Firewall de Windows Defender
2. Configuración avanzada → Reglas de entrada
3. Nueva regla → Puerto → TCP → Puerto específico: 5173 → Permitir conexión

---

## 📱 Acceso desde Dispositivos Móviles

1. Asegúrate de que el dispositivo móvil esté en la misma red Wi-Fi
2. Obtén la IP de tu computadora:
   - Windows: `ipconfig` → Busca "Dirección IPv4"
   - Ejemplo: `192.168.1.100`
3. En el móvil, abre el navegador y accede a: `http://192.168.1.100:5173`

---

## 🐛 Solución de Problemas

### No puedo acceder desde otros dispositivos

1. **Verifica que el servidor esté corriendo con `--host`**
   ```bash
   npm run dev:host
   ```

2. **Verifica tu IP local**
   ```bash
   ipconfig
   ```

3. **Verifica el firewall** - Debe permitir el puerto 5173 (o el que estés usando)

4. **Verifica que estén en la misma red** - Todos los dispositivos deben estar en la misma red Wi-Fi/LAN

### El puerto está ocupado

```bash
# Ver qué proceso usa el puerto (PowerShell)
netstat -ano | findstr :5173

# Matar el proceso
taskkill /PID [PID_NUMBER] /F
```

O cambia el puerto en `vite.config.ts`

---

## 🎯 Mejor Práctica para Producción Local

Para un servidor permanente en red local:

1. **Construir la aplicación**
   ```bash
   npm run build
   ```

2. **Instalar PM2 (gestor de procesos)**
   ```bash
   npm install -g pm2
   npm install -g serve
   ```

3. **Iniciar con PM2**
   ```bash
   pm2 serve dist 3000 --name "portal-chatbot" --spa
   ```

4. **Configurar inicio automático**
   ```bash
   pm2 startup
   pm2 save
   ```

**Comandos útiles de PM2:**
- `pm2 list` - Ver aplicaciones corriendo
- `pm2 logs portal-chatbot` - Ver logs
- `pm2 restart portal-chatbot` - Reiniciar
- `pm2 stop portal-chatbot` - Detener
- `pm2 delete portal-chatbot` - Eliminar

---

## 📊 Monitoreo

Para monitorear el servidor:

```bash
# Con PM2
pm2 monit

# Logs en tiempo real
pm2 logs portal-chatbot --lines 100
```

---

## 🔄 Actualización del Código

Cuando hagas cambios al código:

**Modo desarrollo:**
- Los cambios se aplican automáticamente (HMR)

**Modo producción:**
```bash
# 1. Reconstruir
npm run build

# 2. Reiniciar servidor
pm2 restart portal-chatbot
# O si usas serve manualmente, reinicia el proceso
```

---

## 📝 Notas Importantes

- **Seguridad:** Esta configuración es SOLO para red local. No expongas directamente a internet.
- **CORS:** Si tienes problemas con APIs externas, configura CORS en `vite.config.ts`
- **HTTPS:** Para desarrollo local con HTTPS, consulta la documentación de Vite sobre certificados SSL locales
- **Performance:** El modo producción (`build`) es significativamente más rápido que el modo desarrollo
