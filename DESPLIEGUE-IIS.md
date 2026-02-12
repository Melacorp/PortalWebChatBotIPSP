# 🚀 Despliegue en IIS - Windows Server 2019

Guía completa para desplegar Portal Web ChatBot IPSP en IIS (Internet Information Services).

## ✅ Ventajas de IIS

- ✅ **Nativo de Windows** - Mejor rendimiento en Windows Server
- ✅ **Gestión gráfica** - Interfaz amigable (IIS Manager)
- ✅ **Servicio de Windows** - Inicio automático, alta disponibilidad
- ✅ **SSL/HTTPS integrado** - Fácil configuración de certificados
- ✅ **Logs integrados** - Sistema de logging robusto
- ✅ **Sin dependencias externas** - No necesita Node.js en producción

---

## 📋 Requisitos Previos

### En tu máquina de desarrollo:
- [x] Node.js instalado
- [x] Código fuente del proyecto

### En Windows Server 2019:
- [x] IIS instalado
- [x] Módulo URL Rewrite instalado

---

## 🔧 Paso 1: Instalar IIS en Windows Server 2019

### Opción A: Con PowerShell (Recomendado)

```powershell
# Ejecutar como Administrador
Install-WindowsFeature -name Web-Server -IncludeManagementTools
Install-WindowsFeature -name Web-Static-Content
Install-WindowsFeature -name Web-Default-Doc
Install-WindowsFeature -name Web-Dir-Browsing
Install-WindowsFeature -name Web-Http-Errors
Install-WindowsFeature -name Web-Http-Logging
Install-WindowsFeature -name Web-Request-Monitor
```

### Opción B: Con Administrador del Servidor

1. Abrir **Administrador del Servidor**
2. Click en **Agregar roles y características**
3. Seleccionar **Servidor Web (IIS)**
4. Siguiente → Siguiente → Instalar

---

## 🔧 Paso 2: Instalar URL Rewrite Module

**CRÍTICO:** Este módulo es necesario para que las rutas de React funcionen.

### Descargar e instalar:
1. Ir a: https://www.iis.net/downloads/microsoft/url-rewrite
2. Descargar **URL Rewrite Module 2.1**
3. Ejecutar el instalador
4. Reiniciar IIS Manager

---

## 📦 Paso 3: Preparar la Aplicación

### En tu máquina de desarrollo:

```bash
# 1. Navegar al proyecto
cd "C:\Users\Usuario\Documents\Melacorp\Software\Frontend\Portal Web ChatBot\PortalWebChatBotIPSP"

# 2. Construir para producción
npm run build

# 3. Verificar que dist/ existe y tiene contenido
dir dist
```

### Resultado esperado:
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── imágenes
└── web.config (ya incluido)
```

---

## 📤 Paso 4: Transferir Archivos al Servidor

### Opción A: Copiar carpeta completa

```powershell
# En el servidor, crear carpeta para la aplicación
New-Item -ItemType Directory -Path "C:\inetpub\wwwroot\portal-chatbot-ipsp"

# Copiar todo el contenido de dist/ a la carpeta del servidor
# Puedes usar:
# - Escritorio remoto + copiar/pegar
# - Compartir red
# - FTP
# - Robocopy
```

### Opción B: Usar Robocopy (red local)

```powershell
# Desde tu máquina de desarrollo
robocopy "C:\Users\Usuario\Documents\Melacorp\Software\Frontend\Portal Web ChatBot\PortalWebChatBotIPSP\dist" "\\SERVIDOR\C$\inetpub\wwwroot\portal-chatbot-ipsp" /E /Z /R:3
```

### Ubicación recomendada en el servidor:
```
C:\inetpub\wwwroot\portal-chatbot-ipsp\
```

---

## 🌐 Paso 5: Configurar Sitio en IIS

### 5.1 Abrir IIS Manager

1. Presionar `Win + R`
2. Escribir: `inetmgr`
3. Presionar Enter

### 5.2 Crear Nuevo Sitio Web

1. En el panel izquierdo: **Sitios** → Click derecho → **Agregar sitio web**

2. Configurar:
   ```
   Nombre del sitio: Portal ChatBot IPSP
   Grupo de aplicaciones: DefaultAppPool (o crear uno nuevo)
   Ruta de acceso física: C:\inetpub\wwwroot\portal-chatbot-ipsp
   Tipo: http
   Dirección IP: Todas las no asignadas
   Puerto: 5020
   Nombre de host: (dejar vacío para acceso por IP)
   ```

3. Click **Aceptar**

### 5.3 Configurar el Application Pool (Opcional pero recomendado)

1. Click en **Grupos de aplicaciones**
2. Seleccionar el pool de tu sitio
3. Click derecho → **Configuración avanzada**
4. Configurar:
   ```
   Versión de .NET CLR: Sin código administrado
   Iniciar automáticamente: True
   ```
5. Click **Aceptar**

---

## 🔧 Paso 6: Configurar URL Rewrite (Verificar)

El archivo `web.config` ya está incluido en dist/ y contiene:
- ✅ Reescritura de URLs para React Router
- ✅ Configuración de tipos MIME
- ✅ Headers de seguridad
- ✅ Compresión habilitada
- ✅ Páginas de error personalizadas

**No necesitas hacer nada más**, pero si quieres verificar:

1. En IIS Manager, selecciona tu sitio
2. Doble click en **Reescritura de direcciones URL**
3. Deberías ver la regla **"React Routes"**

---

## 🚀 Paso 7: Iniciar el Sitio

1. En IIS Manager, selecciona tu sitio
2. Click en **Iniciar** (panel derecho)
3. Verificar que el estado sea **Iniciado**

---

## 🌐 Paso 8: Acceder a la Aplicación

### Encontrar la IP del servidor:

```powershell
# En el servidor
ipconfig
# Buscar "Dirección IPv4"
```

### Acceder:

```
http://[IP_DEL_SERVIDOR]:5020
http://localhost:5020  (desde el servidor)
```

Ejemplo: `http://192.168.1.100:5020`

---

## 🔒 Paso 9 (Opcional): Configurar Firewall

Si otros dispositivos no pueden acceder:

```powershell
# PowerShell como Administrador
New-NetFirewallRule -DisplayName "Portal ChatBot IIS 5020" -Direction Inbound -LocalPort 5020 -Protocol TCP -Action Allow
```

O manualmente:
1. Firewall de Windows Defender con seguridad avanzada
2. Reglas de entrada → Nueva regla
3. Puerto → TCP → 5020 → Permitir

---

## 🔐 Paso 10 (Opcional): Configurar HTTPS/SSL

### Obtener Certificado SSL:

**Opción A: Let's Encrypt (Gratis)**
- Usar [win-acme](https://www.win-acme.com/) para Windows

**Opción B: Certificado autofirmado (solo para desarrollo)**

```powershell
# PowerShell como Administrador
New-SelfSignedCertificate -DnsName "portal-chatbot.local" -CertStoreLocation "cert:\LocalMachine\My"
```

### Configurar HTTPS en IIS:

1. En IIS Manager, selecciona tu sitio
2. Panel derecho → **Enlaces**
3. Click **Agregar**
4. Configurar:
   ```
   Tipo: https
   Dirección IP: Todas las no asignadas
   Puerto: 443
   Certificado SSL: [Seleccionar tu certificado]
   ```
5. Click **Aceptar**

### Redirigir HTTP a HTTPS (Opcional):

Agregar a `web.config` dentro de `<rules>`:

```xml
<rule name="Redirect to HTTPS" stopProcessing="true">
  <match url="(.*)" />
  <conditions>
    <add input="{HTTPS}" pattern="^OFF$" />
  </conditions>
  <action type="Redirect" url="https://{HTTP_HOST}/{R:1}" redirectType="Permanent" />
</rule>
```

---

## 🔄 Actualizar la Aplicación

Cuando hagas cambios al código:

### Método 1: Manual

```bash
# 1. En tu máquina de desarrollo
cd "C:\Users\Usuario\Documents\Melacorp\Software\Frontend\Portal Web ChatBot\PortalWebChatBotIPSP"
npm run build

# 2. Copiar dist/ al servidor (sobrescribir archivos)
# Usa Robocopy, RDP, o compartir red

# 3. En el servidor, reiniciar el sitio en IIS Manager
# Click derecho en el sitio → Administrar sitio web → Reiniciar
```

### Método 2: Script Automatizado (próximo paso)

Puedes usar scripts PowerShell para automatizar el proceso.

---

## 📊 Logs y Monitoreo

### Ver Logs de IIS:

**Ubicación por defecto:**
```
C:\inetpub\logs\LogFiles\W3SVC[número]\
```

**Ver logs en tiempo real:**
1. IIS Manager → Tu sitio
2. Doble click en **Registro**
3. Ver configuración de logs

**PowerShell para ver últimas líneas:**
```powershell
Get-Content "C:\inetpub\logs\LogFiles\W3SVC*\*.log" -Tail 50 -Wait
```

### Monitorear el Sitio:

1. IIS Manager → Tu sitio
2. Vista de trabajador → Estadísticas en tiempo real

---

## 🐛 Solución de Problemas

### Error 500.19 - No se puede leer el archivo de configuración

**Causa:** URL Rewrite Module no está instalado

**Solución:**
1. Instalar URL Rewrite Module 2.1
2. Reiniciar IIS Manager

### Error 404 en rutas de React

**Causa:** web.config no está presente o URL Rewrite no funciona

**Solución:**
1. Verificar que `web.config` esté en la raíz del sitio
2. Verificar que URL Rewrite Module esté instalado
3. Reiniciar el sitio

### No se pueden ver imágenes/CSS

**Causa:** Permisos incorrectos

**Solución:**
```powershell
# Dar permisos a IIS_IUSRS
icacls "C:\inetpub\wwwroot\portal-chatbot-ipsp" /grant "IIS_IUSRS:(OI)(CI)F" /T
```

### El sitio no inicia

**Causa:** Puerto ocupado

**Solución:**
```powershell
# Ver qué proceso usa el puerto
netstat -ano | findstr :5020

# Cambiar el puerto en IIS Manager:
# Tu sitio → Enlaces → Editar
```

---

## ⚡ Optimizaciones de Rendimiento

### 1. Habilitar Compresión

En IIS Manager:
1. A nivel de servidor → **Compresión**
2. Habilitar:
   - ✅ Habilitar compresión de contenido estático
   - ✅ Habilitar compresión de contenido dinámico

### 2. Configurar Cache

Ya está configurado en `web.config` con:
- Cache de 1 año para assets estáticos
- Headers de cache apropiados

### 3. Application Pool Optimizations

```powershell
# Configurar reciclaje programado
Set-ItemProperty "IIS:\AppPools\DefaultAppPool" -Name recycling.periodicRestart.time -Value "1.00:00:00"

# Configurar tiempo de espera
Set-ItemProperty "IIS:\AppPools\DefaultAppPool" -Name processModel.idleTimeout -Value "00:20:00"
```

---

## 📋 Checklist de Despliegue

- [ ] IIS instalado en Windows Server 2019
- [ ] URL Rewrite Module instalado
- [ ] Build de producción creado (`npm run build`)
- [ ] Archivos copiados al servidor
- [ ] Sitio web creado en IIS
- [ ] Puerto 5020 configurado
- [ ] Sitio iniciado en IIS
- [ ] Firewall configurado (si es necesario)
- [ ] Acceso verificado desde navegador
- [ ] web.config presente en la raíz
- [ ] (Opcional) HTTPS configurado
- [ ] (Opcional) Dominio configurado

---

## 🎯 Estructura Final en el Servidor

```
C:\inetpub\wwwroot\portal-chatbot-ipsp\
├── index.html
├── web.config          ← CRÍTICO
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   ├── melacorp-[hash].png
│   ├── logo_SantaPriscila-[hash].png
│   └── fondo_santaPriscila-[hash].jpg
└── [otros archivos del build]
```

---

## 📞 Comandos Útiles de PowerShell

```powershell
# Reiniciar IIS
iisreset

# Iniciar sitio
Start-IISSite -Name "Portal ChatBot IPSP"

# Detener sitio
Stop-IISSite -Name "Portal ChatBot IPSP"

# Ver todos los sitios
Get-IISSite

# Ver estado de un sitio específico
Get-IISSite -Name "Portal ChatBot IPSP"

# Reciclar Application Pool
Restart-WebAppPool -Name "DefaultAppPool"
```

---

## 🎉 ¡Listo!

Tu aplicación ahora está desplegada en IIS de manera profesional y permanente.

**Acceso:** `http://[IP_SERVIDOR]:5020`

Para actualizaciones, solo reconstruye y copia los archivos nuevos al servidor.
