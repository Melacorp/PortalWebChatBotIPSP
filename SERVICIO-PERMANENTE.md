# 🚀 Servicio Permanente - Portal Web ChatBot IPSP

Esta guía te ayudará a configurar la aplicación como un **servicio permanente** que seguirá corriendo incluso después de cerrar la terminal.

## 📋 ¿Qué es esto?

Un servicio permanente permite que tu aplicación:
- ✅ Se mantenga corriendo 24/7
- ✅ Se reinicie automáticamente si falla
- ✅ No se cierre al cerrar la terminal
- ✅ Opcionalmente, se inicie al arrancar Windows
- ✅ Gestione logs automáticamente

## 🎯 Puerto Configurado

**Puerto: 5020**
- Local: `http://localhost:5020`
- Red Local: `http://[TU_IP]:5020`

---

## 🚀 Instalación (Primera Vez)

### Paso 1: Instalar el Servicio

```bash
# Opción 1: Usando el script (Recomendado)
install-service.bat

# Opción 2: Manualmente
npm install -g pm2 serve
npm run build
pm2 start ecosystem.config.cjs
pm2 save
```

**Esto hará:**
1. Instalar PM2 y serve (si no están instalados)
2. Construir la aplicación
3. Iniciar el servicio en el puerto 5020
4. Guardar la configuración

### Paso 2 (Opcional): Inicio Automático con Windows

Si quieres que la app se inicie automáticamente al arrancar Windows:

```bash
pm2 startup
# Copia y ejecuta el comando que aparece COMO ADMINISTRADOR
pm2 save
```

---

## 🎮 Gestión del Servicio

### Scripts Rápidos

| Script | Descripción |
|--------|-------------|
| `install-service.bat` | Instala y configura el servicio por primera vez |
| `manage-service.bat` | Menú interactivo para gestionar el servicio |
| `quick-start.bat` | Inicia rápidamente un servicio ya instalado |
| `uninstall-service.bat` | Desinstala el servicio completamente |

### Comandos Manuales de PM2

```bash
# Ver estado de todos los servicios
pm2 status

# Ver información detallada
pm2 info portal-chatbot-ipsp

# Iniciar el servicio
pm2 start portal-chatbot-ipsp

# Detener el servicio
pm2 stop portal-chatbot-ipsp

# Reiniciar el servicio
pm2 restart portal-chatbot-ipsp

# Ver logs en tiempo real
pm2 logs portal-chatbot-ipsp

# Ver las últimas 100 líneas de logs
pm2 logs portal-chatbot-ipsp --lines 100

# Monitorear recursos (CPU, memoria)
pm2 monit

# Eliminar el servicio
pm2 delete portal-chatbot-ipsp

# Guardar la configuración actual
pm2 save

# Listar servicios guardados
pm2 list
```

---

## 🔄 Actualizar la Aplicación

Cuando hagas cambios al código:

### Opción 1: Usando el Script

```bash
# Ejecuta manage-service.bat y selecciona opción 6 (Actualizar)
manage-service.bat
```

### Opción 2: Manual

```bash
# 1. Reconstruir la aplicación
npm run build

# 2. Reiniciar el servicio
pm2 restart portal-chatbot-ipsp
```

---

## 📊 Logs

Los logs se guardan automáticamente en:

```
logs/
├── pm2-error.log      # Errores
├── pm2-out.log        # Salida estándar
└── pm2-combined.log   # Todo combinado
```

**Ver logs:**
```bash
# Logs en tiempo real
pm2 logs portal-chatbot-ipsp

# Últimas 200 líneas
pm2 logs portal-chatbot-ipsp --lines 200

# Solo errores
pm2 logs portal-chatbot-ipsp --err

# Solo salida
pm2 logs portal-chatbot-ipsp --out
```

---

## 🔒 Firewall de Windows

Para permitir acceso desde otros dispositivos en la red local:

```powershell
# PowerShell como administrador
New-NetFirewallRule -DisplayName "Portal ChatBot IPSP" -Direction Inbound -Port 5020 -Protocol TCP -Action Allow
```

O manualmente:
1. Panel de Control → Firewall de Windows
2. Configuración avanzada → Reglas de entrada
3. Nueva regla → Puerto → TCP → 5020 → Permitir

---

## 🐛 Solución de Problemas

### El servicio no inicia

```bash
# Ver logs de error
pm2 logs portal-chatbot-ipsp --err

# Verificar que el build exista
dir dist

# Reconstruir
npm run build

# Reintentar
pm2 restart portal-chatbot-ipsp
```

### El puerto 5020 está ocupado

```bash
# Ver qué proceso usa el puerto (PowerShell)
netstat -ano | findstr :5020

# Matar el proceso (reemplaza [PID] con el número que aparece)
taskkill /PID [PID] /F

# O cambiar el puerto en ecosystem.config.cjs
# Edita la línea: args: 'serve -s dist -l 5020',
```

### No puedo acceder desde otros dispositivos

1. Verifica que el servicio esté corriendo: `pm2 status`
2. Verifica tu IP local: `ipconfig`
3. Verifica el firewall (ver sección anterior)
4. Asegúrate de estar en la misma red

### PM2 no se encuentra

```bash
# Reinstalar PM2 globalmente
npm install -g pm2

# Verificar instalación
pm2 --version
```

---

## ⚙️ Configuración Avanzada

### Cambiar el Puerto

Edita `ecosystem.config.cjs`:

```javascript
args: 'serve -s dist -l 5020',  // Cambia 5020 por tu puerto
```

Luego reinicia:
```bash
pm2 restart portal-chatbot-ipsp
```

### Cambiar Recursos Máximos

En `ecosystem.config.cjs`:

```javascript
max_memory_restart: '500M',  // Reiniciar si excede 500MB
instances: 1,                 // Número de instancias
```

### Múltiples Instancias (Load Balancing)

```javascript
instances: 2,  // Ejecutar 2 instancias en paralelo
exec_mode: 'cluster',
```

---

## 📱 Acceso Móvil

1. Asegúrate de que el dispositivo esté en la misma red Wi-Fi
2. Encuentra tu IP: `ipconfig` → "Dirección IPv4"
3. En el móvil: `http://192.168.1.XXX:5020`

---

## 🔐 Seguridad

⚠️ **IMPORTANTE:**
- Este servicio es SOLO para red local
- NO expongas el puerto 5020 directamente a internet
- Para acceso externo, usa un proxy inverso (nginx, Apache) con HTTPS
- Considera usar autenticación adicional para acceso remoto

---

## 📈 Monitoreo

### Dashboard Web de PM2

```bash
# Instalar PM2 Plus (opcional)
pm2 install pm2-server-monit
```

### Recursos del Sistema

```bash
# Monitor en tiempo real
pm2 monit

# Información del proceso
pm2 info portal-chatbot-ipsp

# Logs del sistema
pm2 sysmonit
```

---

## 🔄 Respaldo y Restauración

### Hacer Respaldo

```bash
# Guardar configuración actual
pm2 save

# Exportar configuración
pm2 ecosystem
```

### Restaurar

```bash
# Cargar servicios guardados
pm2 resurrect

# O iniciar desde el archivo de configuración
pm2 start ecosystem.config.cjs
```

---

## ❓ Comandos Útiles

```bash
# Reiniciar todos los servicios
pm2 restart all

# Detener todos
pm2 stop all

# Eliminar todos
pm2 delete all

# Limpiar logs
pm2 flush

# Actualizar PM2
npm install -g pm2@latest
pm2 update

# Ver versión
pm2 --version
```

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs: `pm2 logs portal-chatbot-ipsp`
2. Verifica el estado: `pm2 status`
3. Consulta esta guía
4. Ejecuta `manage-service.bat` opción 7 para ver información del sistema

---

## ✅ Checklist de Instalación

- [ ] Node.js instalado
- [ ] Dependencias instaladas (`npm install`)
- [ ] Build creado (`npm run build`)
- [ ] PM2 instalado globalmente
- [ ] serve instalado globalmente
- [ ] Servicio iniciado con PM2
- [ ] Firewall configurado (si es necesario)
- [ ] Acceso verificado desde navegador
- [ ] (Opcional) Inicio automático configurado

---

## 🎉 ¡Listo!

Tu aplicación ahora está corriendo como un servicio permanente en el puerto **5020**.

**Accede desde:** `http://localhost:5020` o `http://[TU_IP]:5020`
