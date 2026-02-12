@echo off
chcp 65001 >nul
cls

echo =====================================
echo   Portal Web ChatBot IPSP
echo   Reparación del Servicio
echo =====================================
echo.

echo [PASO 1/6] Deteniendo y eliminando servicio anterior...
call pm2 delete portal-chatbot-ipsp 2>nul
echo [OK] Servicio anterior eliminado.
echo.

echo [PASO 2/6] Verificando que dist/ existe...
if not exist "dist" (
    echo [ERROR] La carpeta dist/ no existe.
    echo [INFO] Construyendo la aplicación...
    call npm run build
    if errorlevel 1 (
        echo [ERROR] Falló la construcción.
        pause
        exit /b 1
    )
) else (
    echo [OK] Carpeta dist/ encontrada.
)
echo.

echo [PASO 3/6] Verificando instalación de serve...
call where serve >nul 2>&1
if errorlevel 1 (
    echo [ERROR] serve no está instalado globalmente.
    echo [INFO] Instalando serve...
    call npm install -g serve
    if errorlevel 1 (
        echo [ERROR] No se pudo instalar serve.
        echo [INFO] Intenta ejecutar como administrador.
        pause
        exit /b 1
    )
    echo [OK] serve instalado correctamente.
) else (
    echo [OK] serve está instalado.
)
echo.

echo [PASO 4/6] Probando serve manualmente...
echo [INFO] Esto debería mostrar información del servidor...
call serve --version
if errorlevel 1 (
    echo [ERROR] serve no funciona correctamente.
    pause
    exit /b 1
)
echo [OK] serve funciona correctamente.
echo.

echo [PASO 5/6] Creando carpeta de logs...
if not exist "logs" mkdir logs
echo [OK] Carpeta de logs lista.
echo.

echo [PASO 6/6] Iniciando servicio con PM2...
call pm2 start ecosystem.config.cjs
if errorlevel 1 (
    echo [ERROR] No se pudo iniciar el servicio.
    echo.
    echo Mostrando logs de error:
    echo =====================================
    call pm2 logs portal-chatbot-ipsp --lines 30 --nostream
    echo =====================================
    pause
    exit /b 1
)
echo [OK] Servicio iniciado.
echo.

echo [INFO] Esperando 3 segundos para verificar estado...
timeout /t 3 /nobreak >nul
echo.

echo [INFO] Verificando estado del servicio...
call pm2 status
echo.

echo =====================================
echo   Reparación Completada
echo =====================================
echo.

REM Obtener la IP local
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    set IP=%%a
    goto :found
)

:found
set IP=%IP: =%

echo Si el estado muestra "online", el servicio está funcionando.
echo.
echo Accede desde:
echo   - Local:      http://localhost:5020
echo   - Red Local:  http://%IP%:5020
echo.
echo Para ver logs: pm2 logs portal-chatbot-ipsp
echo Para gestionar: manage-service.bat
echo.
pause
