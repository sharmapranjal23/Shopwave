@echo off
echo.
echo  ███████╗██╗  ██╗ ██████╗ ██████╗ ██╗    ██╗ █████╗ ██╗   ██╗███████╗
echo  ██╔════╝██║  ██║██╔═══██╗██╔══██╗██║    ██║██╔══██╗██║   ██║██╔════╝
echo  ███████╗███████║██║   ██║██████╔╝██║ █╗ ██║███████║██║   ██║█████╗  
echo  ╚════██║██╔══██║██║   ██║██╔═══╝ ██║███╗██║██╔══██║╚██╗ ██╔╝██╔══╝  
echo  ███████║██║  ██║╚██████╔╝██║     ╚███╔███╔╝██║  ██║ ╚████╔╝ ███████╗
echo  ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝      ╚══╝╚══╝ ╚═╝  ╚═╝  ╚═══╝  ╚══════╝
echo.
echo  🚀 Starting ShopWave Ecommerce Platform...
echo  📦 Backend API: http://localhost:5001
echo  🌐 Frontend:    http://localhost:5173
echo.
start "ShopWave API" cmd /k "cd /d %~dp0frontend && node server/index.js"
timeout /t 2 /nobreak > nul
start "ShopWave Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"
echo  ✅ Both servers are starting...
echo  🛒 Open http://localhost:5173 in your browser
echo.
pause
