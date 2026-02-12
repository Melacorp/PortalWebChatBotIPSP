@echo off
chcp 65001 >nul
cls

echo =====================================
echo   Portal Web ChatBot IPSP
echo   Inicio Rápido
echo =====================================
echo.

echo [INFO] Verificando si el servicio está instalado...
call pm2 describe portal-chatbot-ipsp >nul 2>&1
if errorlevel 1 (
    echo [ERROR] El servicio no está instalado.
    echo.
    echo Para instalarlo, ejecuta: install-service.bat
    echo.
    pause
    exit /b 1
)

echo [OK] Servicio encontrado.
echo.

echo [INFO] Iniciando servicio...
call pm2 start portal-chatbot-ipsp
if errorlevel 1 (
    echo [ERROR] No se pudo iniciar el servicio.
    echo.
    pause
    exit /b 1
)

echo [OK] Servicio iniciado correctamente.
echo.

REM Obtener la IP local
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    set IP=%%a
    goto :found
)

:found
set IP=%IP: =%

echo =====================================
echo   ¡Aplicación en Línea!
echo =====================================
echo.
echo Accede desde:
echo   - Local:      http://localhost:5020
echo   - Red Local:  http://%IP%:5020
echo.
echo Para gestionar el servicio: manage-service.bat
echo.
pause
