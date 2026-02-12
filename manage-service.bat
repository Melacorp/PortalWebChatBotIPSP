@echo off
chcp 65001 >nul
cls

:menu
echo =====================================
echo   Portal Web ChatBot IPSP
echo   Gestión del Servicio
echo =====================================
echo.
echo 1. Ver Estado
echo 2. Ver Logs en Tiempo Real
echo 3. Reiniciar Servicio
echo 4. Detener Servicio
echo 5. Iniciar Servicio
echo 6. Actualizar (Rebuild + Restart)
echo 7. Ver Información del Sistema
echo 8. Salir
echo.
echo =====================================

set /p option="Selecciona una opción (1-8): "

if "%option%"=="1" goto status
if "%option%"=="2" goto logs
if "%option%"=="3" goto restart
if "%option%"=="4" goto stop
if "%option%"=="5" goto start
if "%option%"=="6" goto update
if "%option%"=="7" goto info
if "%option%"=="8" goto end

echo [ERROR] Opción inválida
timeout /t 2 >nul
cls
goto menu

:status
cls
echo [INFO] Estado del servicio:
echo.
call pm2 status
echo.
pause
cls
goto menu

:logs
cls
echo [INFO] Mostrando logs en tiempo real...
echo [INFO] Presiona Ctrl+C para volver al menú
echo.
call pm2 logs portal-chatbot-ipsp
cls
goto menu

:restart
cls
echo [INFO] Reiniciando servicio...
call pm2 restart portal-chatbot-ipsp
if errorlevel 1 (
    echo [ERROR] No se pudo reiniciar el servicio.
) else (
    echo [OK] Servicio reiniciado correctamente.
)
echo.
pause
cls
goto menu

:stop
cls
echo [INFO] Deteniendo servicio...
call pm2 stop portal-chatbot-ipsp
if errorlevel 1 (
    echo [ERROR] No se pudo detener el servicio.
) else (
    echo [OK] Servicio detenido correctamente.
)
echo.
pause
cls
goto menu

:start
cls
echo [INFO] Iniciando servicio...
call pm2 start portal-chatbot-ipsp
if errorlevel 1 (
    echo [ERROR] No se pudo iniciar el servicio.
) else (
    echo [OK] Servicio iniciado correctamente.
    echo.
    for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
        set IP=%%a
        goto :found_start
    )
    :found_start
    set IP=%IP: =%
    echo Aplicación disponible en:
    echo   - Local:      http://localhost:5020
    echo   - Red Local:  http://%IP%:5020
)
echo.
pause
cls
goto menu

:update
cls
echo =====================================
echo   Actualización del Servicio
echo =====================================
echo.
echo Este proceso hará lo siguiente:
echo 1. Reconstruir la aplicación (npm run build)
echo 2. Reiniciar el servicio PM2
echo.
choice /C SN /M "¿Deseas continuar? (S=Sí, N=No)"
if errorlevel 2 (
    cls
    goto menu
)

echo.
echo [PASO 1/2] Construyendo la aplicación...
call npm run build
if errorlevel 1 (
    echo [ERROR] Falló la construcción.
    echo.
    pause
    cls
    goto menu
)
echo [OK] Build completado.
echo.

echo [PASO 2/2] Reiniciando servicio...
call pm2 restart portal-chatbot-ipsp
if errorlevel 1 (
    echo [ERROR] No se pudo reiniciar el servicio.
) else (
    echo [OK] Servicio reiniciado con la nueva versión.
)
echo.
echo =====================================
echo   ¡Actualización Completada!
echo =====================================
pause
cls
goto menu

:info
cls
echo =====================================
echo   Información del Sistema
echo =====================================
echo.
echo [Aplicación]
call pm2 info portal-chatbot-ipsp
echo.
echo [IP Local]
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    set IP=%%a
    goto :found_info
)
:found_info
set IP=%IP: =%
echo   Dirección IPv4: %IP%
echo   URL Local:      http://localhost:5020
echo   URL Red Local:  http://%IP%:5020
echo.
echo [Puerto]
echo   Puerto: 5020
echo.
echo =====================================
pause
cls
goto menu

:end
echo.
echo ¡Hasta luego!
timeout /t 1 >nul
exit /b 0
