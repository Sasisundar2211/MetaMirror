@echo off
echo ========================================
echo MetaMirror Backend - Auto Setup
echo ========================================
echo.

REM Run Python diagnostic script
python auto_diagnose.py

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo All checks passed! Starting server...
    echo ========================================
    echo.
    call venv\Scripts\activate.bat
    uvicorn server:app --reload
) else (
    echo.
    echo ========================================
    echo Please fix the issues above first
    echo ========================================
    pause
)

