@echo off
chcp 65001 >nul
cls

echo =====================================
echo   Portal Web ChatBot IPSP
echo   Desinstalación del Servicio
echo =====================================
echo.

echo [ADVERTENCIA] Esta acción detendrá y eliminará el servicio permanente.
echo La aplicación dejará de estar disponible hasta que la reinstales.
echo.
choice /C SN /M "¿Estás seguro de que deseas continuar? (S=Sí, N=No)"
if errorlevel 2 (
    echo.
    echo Operación cancelada.
    pause
    exit /b 0
)

echo.
echo [PASO 1/2] Deteniendo el servicio...
call pm2 stop portal-chatbot-ipsp 2>nul
call pm2 delete portal-chatbot-ipsp
if errorlevel 1 (
    echo [ERROR] No se pudo eliminar el servicio.
    echo [INFO] Es posible que el servicio no esté instalado.
) else (
    echo [OK] Servicio detenido y eliminado.
)
echo.

echo [PASO 2/2] Guardando configuración de PM2...
call pm2 save --force
echo [OK] Configuración guardada.
echo.

echo =====================================
echo   Desinstalación Completada
echo =====================================
echo.
echo El servicio ha sido eliminado.
echo.
echo Para ver los servicios restantes: pm2 list
echo Para reinstalar: ejecuta install-service.bat
echo.
pause
