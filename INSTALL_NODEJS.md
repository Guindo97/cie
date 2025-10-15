# 📥 Installation de Node.js - Guide Complet

## ❌ Problème Actuel
Node.js et npm ne sont pas installés sur votre système Windows.

## ✅ Solution : Installation de Node.js

### 🎯 Étape 1 : Téléchargement

1. **Allez sur le site officiel :** https://nodejs.org/
2. **Téléchargez la version LTS** (recommandée)
   - Cliquez sur le bouton vert "LTS" 
   - Version recommandée : Node.js 18.x ou 20.x
3. **Le fichier téléchargé** sera quelque chose comme : `node-v20.x.x-x64.msi`

### 🎯 Étape 2 : Installation

1. **Double-cliquez** sur le fichier `.msi` téléchargé
2. **Suivez l'assistant d'installation :**
   - Acceptez la licence
   - Gardez le répertoire par défaut : `C:\Program Files\nodejs\`
   - ✅ **IMPORTANT** : Cochez "Add to PATH" (ajouter au PATH)
   - Cliquez sur "Install"
3. **Attendez** que l'installation se termine
4. **Redémarrez** votre terminal/PowerShell

### 🎯 Étape 3 : Vérification

**Ouvrez un nouveau PowerShell et testez :**
```bash
node --version
npm --version
```

**Vous devriez voir quelque chose comme :**
```
v20.10.0
10.2.3
```

### 🎯 Étape 4 : Lancer CICE Edmonton

**Une fois Node.js installé :**
```bash
cd "C:\Users\guind\CICE\cie\cie-edmonton"
npm install
npm run dev
```

## 🚨 En Cas de Problème

### ❌ "node is not recognized"
**Solution :**
1. Redémarrez complètement votre ordinateur
2. Ou redémarrez PowerShell en tant qu'administrateur
3. Vérifiez que le PATH contient Node.js

### ❌ Erreur de permissions
**Solution :**
1. Lancez PowerShell en tant qu'administrateur
2. Ou utilisez l'invite de commandes en tant qu'administrateur

### ❌ Installation échoue
**Solution :**
1. Désinstallez les anciennes versions de Node.js
2. Téléchargez la dernière version LTS
3. Redémarrez avant de réinstaller

## 🎯 Alternative : Installation via Chocolatey

**Si vous avez Chocolatey :**
```bash
choco install nodejs
```

## 🎯 Alternative : Installation via Winget

**Si vous avez Windows Package Manager :**
```bash
winget install OpenJS.NodeJS
```

## ✅ Vérification Finale

**Après installation, testez :**
```bash
# Vérifier Node.js
node --version

# Vérifier npm
npm --version

# Aller dans le projet
cd "C:\Users\guind\CICE\cie\cie-edmonton"

# Installer les dépendances
npm install

# Lancer l'application
npm run dev
```

## 🎉 Résultat Attendu

**Votre terminal devrait afficher :**
```
  VITE v7.1.2  ready in 500ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**Votre site sera accessible sur :** http://localhost:5173

---
*Une fois Node.js installé, votre application CICE Edmonton fonctionnera parfaitement !*





