@echo off
cd /d "%~dp0"  // Change to the directory where the batch file is located

if exist "node_modules" (
    echo Dependencies already installed. Starting the server...
) else (
    echo Installing dependencies for the first time...
    npm install

    if %ERRORLEVEL% neq 0 (
        echo Failed to install dependencies. Please check for errors.
        pause
        exit /b
    )
)

echo Starting the server...
start /B node server.js

:: Wait a moment for the server to start
timeout /t 3 >nul

:: Open the default web browser at the specified port
start http://localhost:3000

pause
