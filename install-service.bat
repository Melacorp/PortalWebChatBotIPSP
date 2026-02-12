@echo off
chcp 65001 >nul
cls

echo =====================================
echo   Portal Web ChatBot IPSP
echo   Instalación de Servicio Permanente
echo =====================================
echo.

echo [PASO 1/5] Verificando PM2...
call npm list -g pm2 >nul 2>&1
if errorlevel 1 (
    echo [INFO] PM2 no está instalado. Instalando PM2 globalmente...
    call npm install -g pm2
    if errorlevel 1 (
        echo [ERROR] No se pudo instalar PM2.
        echo [INFO] Intenta ejecutar como administrador.
        pause
        exit /b 1
    )
    echo [OK] PM2 instalado correctamente.
) else (
    echo [OK] PM2 ya está instalado.
)
echo.

echo [PASO 2/5] Verificando serve...
call npm list -g serve >nul 2>&1
if errorlevel 1 (
    echo [INFO] serve no está instalado. Instalando serve globalmente...
    call npm install -g serve
    if errorlevel 1 (
        echo [ERROR] No se pudo instalar serve.
        echo [INFO] Intenta ejecutar como administrador.
        pause
        exit /b 1
    )
    echo [OK] serve instalado correctamente.
) else (
    echo [OK] serve ya está instalado.
)
echo.

echo [PASO 3/5] Creando carpeta de logs...
if not exist "logs" mkdir logs
echo [OK] Carpeta de logs lista.
echo.

echo [PASO 4/5] Construyendo la aplicación...
call npm run build
if errorlevel 1 (
    echo [ERROR] Falló la construcción de la aplicación.
    pause
    exit /b 1
)
echo [OK] Aplicación construida correctamente.
echo.

echo [PASO 5/5] Iniciando servicio con PM2...
call pm2 start ecosystem.config.cjs
if errorlevel 1 (
    echo [ERROR] No se pudo iniciar el servicio.
    pause
    exit /b 1
)
echo [OK] Servicio iniciado correctamente.
echo.

echo =====================================
echo   ¡Instalación Completada!
echo =====================================
echo.

REM Obtener la IP local
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    set IP=%%a
    goto :found
)

:found
set IP=%IP: =%

echo La aplicación está corriendo en:
echo   - Local:      http://localhost:5020
echo   - Red Local:  http://%IP%:5020
echo.
echo Para gestionar el servicio, usa:
echo   - Ver estado:    pm2 status
echo   - Ver logs:      pm2 logs portal-chatbot-ipsp
echo   - Reiniciar:     pm2 restart portal-chatbot-ipsp
echo   - Detener:       pm2 stop portal-chatbot-ipsp
echo   - Iniciar:       pm2 start portal-chatbot-ipsp
echo.
echo ¿Deseas configurar PM2 para iniciar automáticamente al arrancar Windows?
choice /C SN /M "(S=Sí, N=No)"
if errorlevel 2 goto :skip_startup
if errorlevel 1 (
    echo.
    echo [INFO] Configurando inicio automático...
    call pm2 save
    call pm2 startup
    echo [INFO] Sigue las instrucciones mostradas arriba (si las hay).
    echo [INFO] Si aparece un comando, cópialo y ejecútalo como administrador.
)

:skip_startup
echo.
echo =====================================
pause
