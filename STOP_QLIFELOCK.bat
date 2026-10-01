@echo off
title Stop Q-LIFELOCK
color 0C
echo Stopping all Q-LIFELOCK background services...

taskkill /FI "WINDOWTITLE eq Q-LIFELOCK Backend Engine*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Q-LIFELOCK Web Dashboard*" /T /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1

echo All Q-LIFELOCK processes on port 8000 and 3000 stopped.
timeout /t 2 >nul
