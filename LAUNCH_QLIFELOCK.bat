@echo off
title Q-LIFELOCK Launcher
color 0B

echo ===============================================================================
echo                    Q - L I F E L O C K
echo    Quantifying Quantum Exposure & Prioritizing PQC Migration
echo ===============================================================================
echo.

cd /d "%~dp0"

echo [1/3] Starting Q-LIFELOCK FastAPI Backend on port 8000...
start "Q-LIFELOCK Backend Engine" /min cmd /c "python -m uvicorn api.main:app --host 127.0.0.1 --port 8000"

echo [2/3] Starting Q-LIFELOCK Next.js Frontend on port 3000...
start "Q-LIFELOCK Web Dashboard" /min cmd /c "cd frontend && npm.cmd run dev"

echo [3/3] Initializing services and opening web dashboard...
timeout /t 4 /nobreak >nul

start http://localhost:3000

echo.
echo ===============================================================================
echo  SUCCESS! Q-LIFELOCK is running smoothly:
echo.
echo  * Interactive Web Dashboard:  http://localhost:3000
echo  * REST API & Swagger Docs:    http://127.0.0.1:8000/docs
echo.
echo  You can demonstrate all features directly in your browser:
echo    - Cryptographic Findings & Evidence Drawer
echo    - Quantum Time Machine Simulator (2027-2045)
echo    - NIST FIPS 203/204/205 Migration Roadmap
echo    - Toy Shor's Algorithm Simulation & Fault-Tolerant Resource Estimator
echo    - CycloneDX 1.6 CBOM Export
echo ===============================================================================
echo.
echo [!] Keep this window open during your lab session.
echo [!] To STOP all Q-LIFELOCK servers, press ANY KEY or close this window.
echo.
pause >nul

echo.
echo Stopping all Q-LIFELOCK servers...
taskkill /FI "WINDOWTITLE eq Q-LIFELOCK Backend Engine*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Q-LIFELOCK Web Dashboard*" /T /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1
echo All Q-LIFELOCK services stopped successfully.
timeout /t 2 >nul
