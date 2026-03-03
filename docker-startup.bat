@echo off
echo ============================================
echo   OrgSpace - Docker Reset Script
echo ============================================
echo.

REM --------------------------------------------------
REM Step 1: Stop and remove existing containers
REM --------------------------------------------------
echo [1/4] Stopping and removing existing containers...
docker compose down -v --remove-orphans 2>nul
echo       Done.
echo.

REM --------------------------------------------------
REM Step 2: Copy .env.docker to .env
REM --------------------------------------------------
echo [2/4] Setting up environment file...
copy /Y .env.docker .env >nul
echo       Copied .env.docker to .env
echo.

REM --------------------------------------------------
REM Step 3: Build images from scratch
REM --------------------------------------------------
echo [3/4] Building Docker images (this may take a few minutes)...
docker compose build --no-cache
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Docker build failed. Please check the output above.
    pause
    exit /b 1
)
echo       Build complete.
echo.

REM --------------------------------------------------
REM Step 4: Start containers
REM --------------------------------------------------
echo [4/4] Starting containers...
docker compose up -d
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to start containers. Please check the output above.
    pause
    exit /b 1
)
echo       Containers started.
echo.

REM --------------------------------------------------
REM Print summary
REM --------------------------------------------------
echo ============================================
echo   OrgSpace is starting up!
echo ============================================
echo.
echo   Please wait ~30 seconds for the database
echo   to initialize and migrations to run.
echo.
echo   Application:  http://localhost:8005
echo   phpMyAdmin:   http://localhost:8080
echo.
echo   DB Credentials:
echo     Username: orgspace
echo     Password: orgspace
echo     Database: orgspace
echo.
echo   Useful commands:
echo     docker compose logs -f app    (view app logs)
echo     docker compose ps             (check status)
echo     docker compose down           (stop all)
echo ============================================
echo.
pause
