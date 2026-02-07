@echo off
echo Starting Law Education Platform...

:: Start Backend Server
start "Law Platform Backend" cmd /k "cd server && npm start"

:: Start Admin App
start "Admin Dashboard" cmd /k "cd admin-app && npm run dev"

:: Start Student App
start "Student App" cmd /k "cd student-app && npm run dev"

echo.
echo All services are starting in separate windows.
echo Backend: Port 5000
echo Admin App: Port 5173/5174
echo Student App: Port 5173/5174
echo.
pause
