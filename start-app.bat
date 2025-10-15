@echo off
echo ========================================
echo    🚀 LANCEMENT CICE EDMONTON 🚀
echo ========================================
echo.

REM Vérifier si Node.js est installé
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js n'est pas installé ou pas dans le PATH
    echo.
    echo 📥 Installez Node.js depuis : https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js détecté
echo.

REM Vérifier si npm est installé
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm n'est pas installé ou pas dans le PATH
    echo.
    echo 📥 npm devrait être installé avec Node.js
    echo.
    pause
    exit /b 1
)

echo ✅ npm détecté
echo.

REM Installer les dépendances si nécessaire
if not exist "node_modules" (
    echo 📦 Installation des dépendances...
    npm install
    echo.
)

REM Vérifier si le fichier .env.local existe
if not exist ".env.local" (
    echo ⚠️  Fichier .env.local non trouvé
    echo.
    echo 🔧 Création du fichier de configuration...
    if exist "config.env.example" (
        copy config.env.example .env.local >nul
        echo ✅ Fichier .env.local créé depuis config.env.example
    ) else (
        echo ❌ Fichier config.env.example non trouvé
    )
    echo.
)

echo 🎯 Lancement du serveur de développement...
echo.
echo 📱 Votre site sera accessible sur : http://localhost:5173
echo 🔐 Administration : http://localhost:5173/admin
echo.
echo ⚠️  Pour arrêter le serveur : Ctrl+C
echo.

REM Lancer le serveur de développement
npm run dev

echo.
echo 👋 Serveur arrêté. Au revoir !
pause





