@echo off
chcp 65001 >nul
cls

echo =====================================
echo   Portal Web ChatBot IPSP
echo   Build para IIS
echo =====================================
echo.

echo [PASO 1/4] Limpiando build anterior...
if exist "dist" (
    rmdir /s /q dist
    echo [OK] Build anterior eliminado.
) else (
    echo [INFO] No hay build anterior.
)
echo.

echo [PASO 2/4] Construyendo aplicación...
call npm run build
if errorlevel 1 (
    echo.
    echo [ERROR] Falló la construcción.
    pause
    exit /b 1
)
echo [OK] Build completado.
echo.

echo [PASO 3/4] Verificando web.config...
if exist "web.config" (
    copy /Y web.config dist\web.config >nul
    echo [OK] web.config copiado a dist/
) else (
    echo [WARNING] web.config no encontrado en la raíz del proyecto.
    echo [INFO] Asegúrate de que web.config esté en dist/
)
echo.

echo [PASO 4/4] Verificando estructura...
echo.
echo Contenido de dist/:
dir dist /b
echo.

echo =====================================
echo   Build Completado para IIS
echo =====================================
echo.
echo La carpeta dist/ está lista para desplegar en IIS.
echo.
echo Próximos pasos:
echo 1. Copiar todo el contenido de dist/ al servidor
echo 2. Ubicación recomendada: C:\inetpub\wwwroot\portal-chatbot-ipsp\
echo 3. Configurar el sitio en IIS Manager
echo 4. Iniciar el sitio
echo.
echo Para más detalles, consulta: DESPLIEGUE-IIS.md
echo.

set /p copiar="¿Deseas abrir la carpeta dist/? (S/N): "
if /i "%copiar%"=="S" (
    explorer dist
)

pause
