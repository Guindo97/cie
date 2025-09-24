# 🔐 Sécurisation Cloudinary - Solution Recommandée

## ❌ Problème Actuel
Les clés API Cloudinary sont exposées côté client, ce qui pose un risque de sécurité.

## ✅ Solution : Upload Preset Non Signé

### 1. Configuration Cloudinary Dashboard

1. **Connectez-vous à votre dashboard Cloudinary**
2. **Allez dans Settings > Upload**
3. **Créez un nouveau Upload Preset :**
   - **Preset Name :** `cice_edmonton`
   - **Signing Mode :** `Unsigned` (IMPORTANT !)
   - **Folder :** `cice-edmonton`
   - **Resource Type :** `Auto`
   - **Quality :** `Auto`
   - **Format :** `Auto`

### 2. Modification du Code

**Remplacez cloudinaryService.js par cette version sécurisée :**

```javascript
// Service Cloudinary sécurisé - SANS api_secret côté client
const CLOUDINARY_CONFIG = {
  cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dwe2qubud',
  // ❌ SUPPRIMÉ : api_secret (ne doit pas être côté client)
  // ❌ SUPPRIMÉ : api_key (pas nécessaire pour upload non signé)
  upload_preset: 'cice_edmonton' // Upload preset non signé
};

class CloudinaryService {
  // Upload d'image avec preset non signé
  static async uploadImage(file, options = {}) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_CONFIG.upload_preset);
      formData.append('folder', options.folder || 'cice-edmonton');
      
      // Transformations optionnelles
      if (options.width) formData.append('width', options.width);
      if (options.height) formData.append('height', options.height);
      if (options.crop) formData.append('crop', options.crop);
      if (options.quality) formData.append('quality', options.quality);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloud_name}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Erreur lors de l\'upload');
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
        url: data.secure_url,
        public_id: data.public_id
      };
    } catch (error) {
      console.error('Erreur upload image:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Upload de vidéo avec preset non signé
  static async uploadVideo(file, options = {}) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_CONFIG.upload_preset);
      formData.append('folder', options.folder || 'cice-edmonton');

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloud_name}/video/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Erreur lors de l\'upload');
      }

      const data = await response.json();
      return {
        success: true,
        data: data,
        url: data.secure_url,
        public_id: data.public_id
      };
    } catch (error) {
      console.error('Erreur upload vidéo:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Autres méthodes restent identiques...
}
```

### 3. Configuration .env.local

**Nouveau fichier .env.local (SANS api_secret) :**
```env
# Mot de passe administrateur
VITE_ADMIN_PASSWORD=CICE2025!Edmonton@Secure

# Configuration Cloudinary sécurisée
VITE_CLOUDINARY_CLOUD_NAME=dwe2qubud
# ❌ SUPPRIMÉ : VITE_CLOUDINARY_API_KEY (pas nécessaire)
# ❌ SUPPRIMÉ : VITE_CLOUDINARY_API_SECRET (SÉCURITÉ !)
```

### 4. Avantages de cette Solution

✅ **Sécurité maximale** : Aucune clé secrète exposée
✅ **Simplicité** : Configuration plus simple
✅ **Fiabilité** : Fonctionnement garanti
✅ **Coût** : Pas de risque d'abus de crédits
✅ **Maintenance** : Plus facile à gérer

### 5. Limitations

⚠️ **Upload non signé** : Moins de contrôle sur les transformations
⚠️ **Pas de suppression** : Impossible de supprimer depuis le client
⚠️ **Quota** : Limité par le plan Cloudinary

### 6. Alternative : Backend Proxy (Futur)

Pour une sécurité maximale, créez un backend Node.js :

```javascript
// backend/upload.js
app.post('/api/upload', async (req, res) => {
  // Upload sécurisé côté serveur avec api_secret
  // Validation des fichiers
  // Contrôle d'accès
});
```

## 🎯 Recommandation

**Utilisez l'Upload Preset non signé** pour votre cas d'usage communautaire. C'est suffisant et sécurisé !


