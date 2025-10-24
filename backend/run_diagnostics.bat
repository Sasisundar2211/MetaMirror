@echo off
echo ========================================
echo MetaMirror Backend - Auto Diagnostic
echo ========================================
echo.

REM Step 1: Check MongoDB Service
echo [Step 1/5] Checking MongoDB service...
sc query MongoDB >nul 2>&1
if %errorlevel% equ 0 (
    sc query MongoDB | findstr "RUNNING" >nul
    if %errorlevel% equ 0 (
        echo    [OK] MongoDB service is running
    ) else (
        echo    [WARN] MongoDB service exists but not running
        echo    [INFO] Attempting to start MongoDB...
        net start MongoDB >nul 2>&1
        if %errorlevel% equ 0 (
            echo    [OK] MongoDB started successfully
        ) else (
            echo    [ERROR] Failed to start MongoDB
            echo    [INFO] Try: Run as Administrator or manually start MongoDB
        )
    )
) else (
    echo    [ERROR] MongoDB service not found
    echo    [INFO] MongoDB may not be installed
    echo    [INFO] Install from: https://www.mongodb.com/try/download/community
)
echo.

REM Step 2: Check MongoDB Connectivity
echo [Step 2/5] Testing MongoDB connectivity...
mongosh --eval "db.version()" --quiet >nul 2>&1
if %errorlevel% equ 0 (
    echo    [OK] MongoDB is accessible
    for /f "delims=" %%i in ('mongosh --eval "db.version()" --quiet 2^>nul') do set MONGO_VER=%%i
    echo    [INFO] Version: %MONGO_VER%
) else (
    echo    [ERROR] Cannot connect to MongoDB
    echo    [INFO] Make sure MongoDB is running on localhost:27017
)
echo.

REM Step 3: Check Virtual Environment
echo [Step 3/5] Checking Python virtual environment...
if exist "venv\Scripts\activate.bat" (
    echo    [OK] Virtual environment found
) else (
    echo    [ERROR] Virtual environment not found
    echo    [INFO] Creating virtual environment...
    python -m venv venv
    if %errorlevel% equ 0 (
        echo    [OK] Virtual environment created
    ) else (
        echo    [ERROR] Failed to create virtual environment
    )
)
echo.

REM Step 4: Check Dependencies
echo [Step 4/5] Checking Python dependencies...
call venv\Scripts\activate.bat
python -c "import fastapi, motor, pymongo" 2>nul
if %errorlevel% equ 0 (
    echo    [OK] Required packages installed
) else (
    echo    [WARN] Some packages missing
    echo    [INFO] Installing requirements...
    pip install -q -r requirements.txt
    if %errorlevel% equ 0 (
        echo    [OK] Dependencies installed
    ) else (
        echo    [ERROR] Failed to install dependencies
    )
)
echo.

REM Step 5: Test API
echo [Step 5/5] Testing API endpoints...
python test_api.py
echo.

echo ========================================
echo Diagnostic Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. If MongoDB is not running, start it with: net start MongoDB
echo 2. Start the server with: start_server.bat
echo 3. Visit http://127.0.0.1:8000/docs to test the API
echo.
pause
