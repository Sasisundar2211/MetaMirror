@echo off
echo Checking MongoDB Status...
echo.

echo 1. Checking if MongoDB service is running...
sc query MongoDB | findstr "RUNNING" >nul
if %errorlevel% equ 0 (
    echo    [OK] MongoDB service is running
) else (
    echo    [FAIL] MongoDB service is NOT running
    echo.
    echo    Starting MongoDB...
    net start MongoDB
    if %errorlevel% equ 0 (
        echo    [OK] MongoDB started successfully
    ) else (
        echo    [FAIL] Failed to start MongoDB
        echo    Try running as Administrator: net start MongoDB
    )
)

echo.
echo 2. Checking MongoDB connectivity on port 27017...
powershell -Command "$result = Test-NetConnection -ComputerName localhost -Port 27017 -WarningAction SilentlyContinue; if ($result.TcpTestSucceeded) { Write-Host '   [OK] MongoDB is listening on port 27017' } else { Write-Host '   [FAIL] MongoDB is NOT accessible on port 27017' }"

echo.
echo 3. Testing MongoDB connection with mongosh...
mongosh --eval "db.version()" --quiet 2>nul
if %errorlevel% equ 0 (
    echo    [OK] MongoDB connection successful
) else (
    echo    [FAIL] Could not connect to MongoDB
    echo    Make sure mongosh is installed and MongoDB is running
)

echo.
echo ================================
echo MongoDB check completed!
echo ================================
pause
