@echo off
echo Redémarrage de l'application CICE Edmonton...
echo.

echo Arrêt des processus Node.js...
taskkill /f /im node.exe 2>nul

echo Attente de 2 secondes...
timeout /t 2 /nobreak >nul

echo Démarrage de l'application...
npm run dev

pause


