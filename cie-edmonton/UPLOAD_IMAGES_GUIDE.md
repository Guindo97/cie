# 📸 Guide d'upload des images vers Cloudinary

## 🎯 **Objectif**
Migrer toutes les images statiques vers Cloudinary pour une meilleure performance mobile.

## 📋 **Images à uploader**

### **1. Barbecue d'accueil**
- **Fichier local** : `/public/img/1.jpg`
- **Nom Cloudinary** : `barbecue-accueil`
- **Catégorie** : `events`

### **2. Atelier cuisine**
- **Fichier local** : `/public/img/cuisine.webp`
- **Nom Cloudinary** : `atelier-cuisine`
- **Catégorie** : `culture`

### **3. Soirée danse**
- **Fichier local** : `/public/img/danse.png`
- **Nom Cloudinary** : `soiree-danse`
- **Catégorie** : `culture`

### **4. Fête de l'indépendance**
- **Fichier local** : `/public/img/happy.jpg`
- **Nom Cloudinary** : `independence-2023`
- **Catégorie** : `events`

### **5. Marché africain**
- **Fichier local** : `/public/img/marché.jpg`
- **Nom Cloudinary** : `marche-africain`
- **Catégorie** : `commerce`

### **6. Président**
- **Fichier local** : `/public/img/president.jpg`
- **Nom Cloudinary** : `president`
- **Catégorie** : `community`

### **7. Vice-présidente**
- **Fichier local** : `/public/img/vicepresidente.png`
- **Nom Cloudinary** : `vice-presidente`
- **Catégorie** : `community`

### **8. Attiéké**
- **Fichier local** : `/public/img/attieke.jpg`
- **Nom Cloudinary** : `attieke`
- **Catégorie** : `culture`

## 🚀 **Étapes d'upload**

### **1. Allez sur votre Dashboard Cloudinary**
- Connectez-vous sur [cloudinary.com](https://cloudinary.com)
- Allez dans **"Media Library"**

### **2. Upload des images**
Pour chaque image :
1. **Cliquez sur "Upload"**
2. **Sélectionnez le fichier** depuis `/public/img/`
3. **Nommez le fichier** exactement comme indiqué ci-dessus
4. **Ajoutez le tag** : `cice-edmonton-static`
5. **Cliquez sur "Upload"**

### **3. Vérification**
Après upload, vous devriez avoir :
- ✅ `barbecue-accueil`
- ✅ `atelier-cuisine`
- ✅ `soiree-danse`
- ✅ `independence-2023`
- ✅ `marche-africain`
- ✅ `president`
- ✅ `vice-presidente`
- ✅ `attieke`

## 🎯 **URLs générées automatiquement**

Une fois uploadées, les images seront accessibles via :
```
https://res.cloudinary.com/dwe2qubud/image/upload/q_auto,f_auto,w_auto,h_auto,c_fill/[NOM_IMAGE]
```

## ✅ **Test**

Après upload :
1. **Rechargez votre site**
2. **Allez dans la galerie**
3. **Vérifiez que toutes les images s'affichent**
4. **Testez sur mobile** - les images devraient maintenant s'afficher !

## 📱 **Avantages mobile**

- ✅ **Chargement optimisé** pour mobile
- ✅ **Images adaptées** à la taille d'écran
- ✅ **CDN mondial** pour vitesse
- ✅ **Formats modernes** (WebP, AVIF)
