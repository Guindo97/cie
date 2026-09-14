# Configuration Cloudinary - CICE Edmonton

## 🚨 **Problème Identifié**

L'erreur "Unknown API key" indique que Cloudinary n'est pas correctement configuré.

## 🔧 **Solution**

### **1. Créer le fichier .env**

Créez un fichier `.env` à la racine du projet avec :

```bash
# Configuration Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=dwe2qubud
VITE_CLOUDINARY_API_KEY=votre-api-key
VITE_CLOUDINARY_API_SECRET=votre-api-secret
```

### **2. Obtenir les clés Cloudinary**

1. **Aller sur [Cloudinary Dashboard](https://cloudinary.com/console)**
2. **Se connecter** avec votre compte
3. **Copier les valeurs** :
   - `Cloud name` → `VITE_CLOUDINARY_CLOUD_NAME`
   - `API Key` → `VITE_CLOUDINARY_API_KEY`
   - `API Secret` → `VITE_CLOUDINARY_API_SECRET`

### **3. Configuration Upload Preset**

1. **Aller dans Settings > Upload**
2. **Créer un Upload Preset** :
   - Name: `cice_edmonton`
   - Signing Mode: `Unsigned`
   - Folder: `cice-edmonton`
   - Tags: `cice-edmonton,gallery`

### **4. Exemple de fichier .env complet**

```bash
# Configuration Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=dwe2qubud
VITE_CLOUDINARY_API_KEY=123456789012345
VITE_CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456

# Configuration Firebase (optionnel)
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
```

## 🛠️ **Alternative : Mode Local**

Si vous ne voulez pas configurer Cloudinary maintenant, l'application fonctionne en mode local :

### **Avantages du mode local :**
- ✅ **Pas de configuration** nécessaire
- ✅ **Fonctionne immédiatement**
- ✅ **Images stockées** dans le navigateur
- ✅ **Pas de coûts** Cloudinary

### **Inconvénients :**
- ❌ **Images perdues** si cache vidé
- ❌ **Pas de partage** entre utilisateurs
- ❌ **Limité** par l'espace navigateur

## 🚀 **Test de la Configuration**

### **1. Vérifier les variables d'environnement**
```javascript
console.log('Cloud name:', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
console.log('API Key:', import.meta.env.VITE_CLOUDINARY_API_KEY);
```

### **2. Tester l'upload**
1. Aller dans la galerie
2. Cliquer sur "Admin"
3. Essayer d'uploader une image
4. Vérifier la console pour les erreurs

### **3. Messages de succès**
```
✅ Configuration Cloudinary validée
✅ Upload réussi vers Cloudinary
✅ Image disponible dans la galerie
```

## 🔒 **Sécurité**

### **⚠️ Important :**
- **Ne jamais** exposer l'API Secret côté client
- **Utiliser** des Upload Presets non signés
- **Limiter** les permissions dans Cloudinary
- **Configurer** les règles de sécurité

### **Configuration sécurisée :**
```javascript
// Upload Preset Configuration
{
  "name": "cice_edmonton",
  "unsigned": true,
  "folder": "cice-edmonton",
  "tags": ["cice-edmonton", "gallery"],
  "allowed_formats": ["jpg", "png", "gif", "webp"],
  "max_file_size": 10485760, // 10MB
  "max_image_width": 2048,
  "max_image_height": 2048
}
```

## 📱 **Dépannage**

### **Erreur "Unknown API key"**
- ✅ Vérifier que le fichier `.env` existe
- ✅ Vérifier que les variables sont correctes
- ✅ Redémarrer le serveur de développement

### **Erreur "Upload preset not found"**
- ✅ Créer l'Upload Preset dans Cloudinary
- ✅ Vérifier le nom : `cice_edmonton`
- ✅ Vérifier qu'il est en mode "Unsigned"

### **Erreur "Folder not found"**
- ✅ Le dossier sera créé automatiquement
- ✅ Vérifier les permissions Cloudinary

## 🎯 **Résultat Attendu**

Une fois configuré correctement :
- ✅ **Upload d'images** fonctionne
- ✅ **Images stockées** dans Cloudinary
- ✅ **URLs optimisées** générées
- ✅ **Galerie** mise à jour automatiquement

---

**Note** : L'application fonctionne parfaitement en mode local même sans configuration Cloudinary !


