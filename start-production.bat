@echo off
chcp 65001 >nul
cls

echo =====================================
echo   Portal Web ChatBot IPSP
echo   Modo Producción - Red Local
echo =====================================
echo.

REM Verificar si existe la carpeta dist
if not exist "dist" (
    echo [INFO] No se encontró el build de producción.
    echo [INFO] Construyendo la aplicación...
    echo.
    call npm run build
    if errorlevel 1 (
        echo.
        echo [ERROR] Falló la construcción de la aplicación.
        pause
        exit /b 1
    )
    echo.
    echo [OK] Build completado exitosamente.
    echo.
) else (
    echo [INFO] Se encontró un build existente.
    choice /C SN /M "¿Deseas reconstruir la aplicación? (S=Sí, N=No)"
    if errorlevel 2 goto :skip_build
    if errorlevel 1 (
        echo.
        echo [INFO] Reconstruyendo la aplicación...
        call npm run build
        if errorlevel 1 (
            echo.
            echo [ERROR] Falló la construcción de la aplicación.
            pause
            exit /b 1
        )
        echo.
        echo [OK] Build completado exitosamente.
        echo.
    )
)

:skip_build

REM Obtener la IP local
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    set IP=%%a
    goto :found
)

:found
REM Limpiar espacios
set IP=%IP: =%

echo [INFO] Tu IP local es: %IP%
echo.
echo [INFO] El servidor estará disponible en:
echo        - Local:      http://localhost:4173
echo        - Red Local:  http://%IP%:4173
echo.
echo [INFO] Presiona Ctrl+C para detener el servidor
echo.
echo =====================================
echo.

npm run preview:host

pause
