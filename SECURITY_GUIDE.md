# 🔐 Guide de Sécurité - CICE Edmonton

## ⚠️ IMPORTANT : Sécurisation des Secrets

### 1. Configuration des Variables d'Environnement

**Créez le fichier `.env.local` :**
```bash
# Copiez config.env.example vers .env.local
cp config.env.example .env.local
```

**Personnalisez `.env.local` :**
```env
# Mot de passe administrateur (changez-le !)
VITE_ADMIN_PASSWORD=votre_nouveau_mot_de_passe_securise

# Configuration Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=votre-cloud-name
VITE_CLOUDINARY_API_KEY=votre-api-key
VITE_CLOUDINARY_API_SECRET=votre-api-secret
```

### 2. Protection Git

**Les fichiers suivants sont automatiquement ignorés :**
- `.env`
- `.env.local`
- `.env.*.local`

**❌ NE JAMAIS COMMITER :**
- Mots de passe
- Clés API
- Secrets de production

### 3. Mots de Passe Recommandés

**Pour l'admin, utilisez :**
- Minimum 12 caractères
- Majuscules, minuscules, chiffres, symboles
- Exemple : `CICE2025!Edmonton@Secure`

### 4. Sécurité Cloudinary

**⚠️ ATTENTION :** Les clés API Cloudinary sont exposées côté client.

**Pour la production :**
1. Créez un backend Node.js/Express
2. Déplacez l'upload vers le serveur
3. Utilisez l'API Secret uniquement côté serveur

### 5. Vérification de Sécurité

**Testez après chaque changement :**
```bash
# 1. Vérifiez que l'admin fonctionne
npm run dev
# Allez sur /admin et testez la connexion

# 2. Vérifiez les uploads
# Testez l'upload d'images dans l'admin

# 3. Vérifiez que .env.local n'est pas committé
git status
# Ne doit PAS afficher .env.local
```

### 6. En Cas de Problème

**Si l'admin ne fonctionne plus :**
```javascript
// Dans Admin.jsx, vérifiez cette ligne :
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'cice2025';
```

**Si les uploads ne marchent plus :**
```javascript
// Dans cloudinaryService.js, vérifiez :
const CLOUDINARY_CONFIG = {
  cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dwe2qubud',
  // ...
};
```

### 7. Déploiement Sécurisé

**Avant de déployer :**
1. ✅ Vérifiez que `.env.local` existe
2. ✅ Testez l'authentification admin
3. ✅ Testez les uploads
4. ✅ Vérifiez que les secrets ne sont pas dans le code

**Variables d'environnement de production :**
- Configurez sur votre plateforme d'hébergement
- Utilisez des mots de passe différents pour la production

## 🚨 Urgences de Sécurité

**Si vous pensez que votre site est compromis :**
1. Changez immédiatement le mot de passe admin
2. Régénérez les clés Cloudinary
3. Vérifiez les logs d'accès
4. Contactez votre hébergeur si nécessaire

---
*Dernière mise à jour : $(date)*





