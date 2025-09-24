# Configuration Cloudinary pour CICE Edmonton

## 🚀 Installation et Configuration

### 1. Créer un compte Cloudinary

1. Allez sur [cloudinary.com](https://cloudinary.com)
2. Créez un compte gratuit
3. Notez vos identifiants depuis le dashboard

### 2. Configuration des variables d'environnement

1. Copiez le fichier `env.example` vers `.env` :
   ```bash
   cp env.example .env
   ```

2. Modifiez le fichier `.env` avec vos vraies valeurs :
   ```env
   VITE_CLOUDINARY_CLOUD_NAME=votre-cloud-name
   VITE_CLOUDINARY_API_KEY=votre-api-key
   VITE_CLOUDINARY_API_SECRET=votre-api-secret
   ```

### 3. Configuration des Upload Presets

Dans votre dashboard Cloudinary :

1. Allez dans **Settings** > **Upload**
2. Créez un nouveau **Upload Preset** nommé `cice_edmonton`
3. Configurez les paramètres :
   - **Signing Mode** : `Unsigned` (pour l'upload côté client)
   - **Folder** : `cice-edmonton`
   - **Resource Type** : `Auto`
   - **Quality** : `Auto`
   - **Format** : `Auto`

### 4. Structure des dossiers

Vos médias seront organisés ainsi :
```
cice-edmonton/
├── events/          # Images d'événements
├── gallery/         # Galerie générale
│   ├── events/      # Photos d'événements
│   ├── culture/     # Photos culturelles
│   ├── community/   # Photos communautaires
│   ├── family/      # Photos familiales
│   ├── celebrations/# Photos de célébrations
│   ├── sport/       # Photos sportives
│   └── commerce/    # Photos commerciales
└── videos/          # Vidéos
```

## 🎯 Fonctionnalités

### Upload d'images
- ✅ Compression automatique
- ✅ Optimisation pour le web
- ✅ Redimensionnement intelligent
- ✅ Formats modernes (WebP, AVIF)

### Upload de vidéos
- ✅ Conversion automatique
- ✅ Streaming adaptatif
- ✅ Miniatures générées
- ✅ Compression optimisée

### Gestion des médias
- ✅ Organisation par catégories
- ✅ Métadonnées complètes
- ✅ URLs optimisées
- ✅ CDN mondial

## 🔧 Utilisation

### Dans l'admin
1. **Galerie** : Upload d'images/vidéos par catégorie
2. **Événements** : Upload d'images pour les événements
3. **Barre de progression** : Suivi en temps réel
4. **Validation** : Vérification des tailles et formats

### Côté public
1. **Affichage optimisé** : Images adaptées à chaque écran
2. **Lightbox** : Visualisation plein écran
3. **Filtres** : Par catégorie
4. **Navigation** : Clavier et souris

## 📱 Responsive

- ✅ Mobile : Images optimisées pour petits écrans
- ✅ Tablette : Tailles intermédiaires
- ✅ Desktop : Qualité maximale
- ✅ Retina : Support des écrans haute résolution

## 🛡️ Sécurité

- ✅ Upload Preset non signé (sécurisé)
- ✅ Validation des types de fichiers
- ✅ Limitation de taille
- ✅ Nettoyage automatique

## 🚨 Dépannage

### Erreur "Cloud name not found"
- Vérifiez que `VITE_CLOUDINARY_CLOUD_NAME` est correct

### Erreur "Invalid API key"
- Vérifiez que `VITE_CLOUDINARY_API_KEY` est correct

### Upload échoue
- Vérifiez que l'Upload Preset `cice_edmonton` existe
- Vérifiez que le preset est configuré en mode "Unsigned"

### Images ne s'affichent pas
- Vérifiez la console pour les erreurs
- Vérifiez que les URLs Cloudinary sont correctes

## 📊 Monitoring

Dans votre dashboard Cloudinary, vous pouvez :
- Voir l'utilisation du stockage
- Monitorer les performances
- Gérer les transformations
- Analyser les statistiques

## 💰 Coûts

Le plan gratuit Cloudinary inclut :
- 25 GB de stockage
- 25 GB de bande passante/mois
- 25 000 transformations/mois

Suffisant pour commencer ! 🎉
