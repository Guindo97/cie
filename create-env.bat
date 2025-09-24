@echo off
echo Creation du fichier .env.local pour la securite...
echo.

REM Copier le fichier exemple
copy config.env.example .env.local

echo.
echo ✅ Fichier .env.local cree avec succes !
echo.
echo ⚠️  IMPORTANT : Modifiez maintenant le fichier .env.local avec vos vraies valeurs
echo.
echo 1. Ouvrez .env.local dans votre editeur
echo 2. Changez VITE_ADMIN_PASSWORD par un mot de passe securise
echo 3. Ajoutez vos vraies cles Cloudinary
echo.
echo 🔐 MOT DE PASSE ADMIN RECOMMANDE : CICE2025!Edmonton@Secure
echo.
pause


