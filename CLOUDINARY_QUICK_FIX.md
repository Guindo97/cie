# Correction Rapide Cloudinary - CICE Edmonton

## 🔍 **Diagnostic du Problème**

Le fichier `.env` existe et contient les bonnes clés :
```
VITE_CLOUDINARY_CLOUD_NAME=dwe2qubud
VITE_CLOUDINARY_API_KEY=289792115171759
VITE_CLOUDINARY_API_SECRET=WVu4hFI0VboUZK5KTXotdNljIno
```

## 🚨 **Problème Identifié**

L'erreur "Unknown API key" peut venir de :

1. **Upload Preset manquant** : `cice_edmonton` n'existe pas
2. **Upload Preset mal configuré** : Pas en mode "Unsigned"
3. **Cache de l'application** : Variables d'environnement non rechargées

## 🛠️ **Solutions Rapides**

### **1. Vérifier l'Upload Preset dans Cloudinary**

1. Aller sur [Cloudinary Dashboard](https://cloudinary.com/console)
2. Settings > Upload
3. Vérifier si `cice_edmonton` existe
4. Si non, le créer :
   - Name: `cice_edmonton`
   - Signing Mode: `Unsigned`
   - Folder: `cice-edmonton`

### **2. Redémarrer l'Application**

```bash
# Arrêter le serveur (Ctrl+C)
# Puis relancer
npm run dev
```

### **3. Vérifier les Variables d'Environnement**

Ajouter temporairement dans le code pour debug :
```javascript
console.log('Cloud name:', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
console.log('API Key:', import.meta.env.VITE_CLOUDINARY_API_KEY);
```

## 🎯 **Test Rapide**

1. **Ouvrir la console** du navigateur
2. **Aller dans la galerie** 
3. **Cliquer sur Admin**
4. **Essayer d'uploader** une image
5. **Vérifier les messages** dans la console

## ✅ **Résultat Attendu**

Si tout est correct :
- ✅ Pas d'erreur "Unknown API key"
- ✅ Upload réussi vers Cloudinary
- ✅ Image visible dans la galerie

## 🔧 **Alternative : Mode Local**

Si Cloudinary ne fonctionne toujours pas :
- L'application fonctionne en mode local
- Images stockées dans le navigateur
- Pas de configuration nécessaire
- Performance optimale

---

**Note** : L'application fonctionne parfaitement même sans Cloudinary !


