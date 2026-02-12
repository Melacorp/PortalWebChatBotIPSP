@echo off
chcp 65001 >nul
cls

echo =====================================
echo   Portal Web ChatBot IPSP
echo   Diagnóstico del Sistema
echo =====================================
echo.

echo [1/8] Verificando Node.js...
call node --version 2>nul
if errorlevel 1 (
    echo [ERROR] Node.js no está instalado o no está en PATH.
) else (
    echo [OK] Node.js instalado.
)
echo.

echo [2/8] Verificando npm...
call npm --version 2>nul
if errorlevel 1 (
    echo [ERROR] npm no está instalado o no está en PATH.
) else (
    echo [OK] npm instalado.
)
echo.

echo [3/8] Verificando PM2...
call pm2 --version 2>nul
if errorlevel 1 (
    echo [ERROR] PM2 no está instalado globalmente.
    echo [FIX] Ejecuta: npm install -g pm2
) else (
    echo [OK] PM2 instalado.
)
echo.

echo [4/8] Verificando serve...
call serve --version 2>nul
if errorlevel 1 (
    echo [ERROR] serve no está instalado globalmente.
    echo [FIX] Ejecuta: npm install -g serve
) else (
    echo [OK] serve instalado.
)
echo.

echo [5/8] Verificando carpeta dist/...
if exist "dist" (
    echo [OK] Carpeta dist/ existe.
    dir dist /b | findstr /r "." >nul
    if errorlevel 1 (
        echo [WARNING] La carpeta dist/ está vacía.
        echo [FIX] Ejecuta: npm run build
    )
) else (
    echo [ERROR] Carpeta dist/ no existe.
    echo [FIX] Ejecuta: npm run build
)
echo.

echo [6/8] Verificando carpeta node_modules/...
if exist "node_modules" (
    echo [OK] node_modules/ existe.
) else (
    echo [ERROR] node_modules/ no existe.
    echo [FIX] Ejecuta: npm install
)
echo.

echo [7/8] Verificando archivo ecosystem.config.cjs...
if exist "ecosystem.config.cjs" (
    echo [OK] ecosystem.config.cjs existe.
) else (
    echo [ERROR] ecosystem.config.cjs no existe.
)
echo.

echo [8/8] Estado de PM2...
call pm2 list 2>nul
if errorlevel 1 (
    echo [ERROR] No se puede ejecutar PM2.
) else (
    echo.
    echo [INFO] Detalles del servicio portal-chatbot-ipsp:
    call pm2 describe portal-chatbot-ipsp 2>nul
)
echo.

echo =====================================
echo   Logs Recientes (últimas 20 líneas)
echo =====================================
call pm2 logs portal-chatbot-ipsp --lines 20 --nostream 2>nul
echo.

echo =====================================
echo   Diagnóstico Completado
echo =====================================
echo.
echo Si hay errores arriba, sigue las instrucciones [FIX].
echo Si todo está OK pero el servicio falla, ejecuta: fix-service.bat
echo.
pause
