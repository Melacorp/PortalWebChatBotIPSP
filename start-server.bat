@echo off
chcp 65001 >nul
cls

echo =====================================
echo   Portal Web ChatBot IPSP
echo   Servidor de Red Local
echo =====================================
echo.

echo [INFO] Iniciando servidor en red local...
echo.

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
echo        - Local:      http://localhost:5173
echo        - Red Local:  http://%IP%:5173
echo.
echo [INFO] Presiona Ctrl+C para detener el servidor
echo.
echo =====================================
echo.

npm run dev:host

pause
