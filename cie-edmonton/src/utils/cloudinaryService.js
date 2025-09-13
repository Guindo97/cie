// Service Cloudinary pour l'upload d'images et vidéos

// Configuration Cloudinary
const CLOUDINARY_CONFIG = {
  cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dwe2qubud',
  api_key: import.meta.env.VITE_CLOUDINARY_API_KEY || '289792115171759',
  api_secret: import.meta.env.VITE_CLOUDINARY_API_SECRET || 'WVu4hFI0VboUZK5KTXotdNljIno',
  secure: true
};

class CloudinaryService {
  // Upload d'image avec transformations
  static async uploadImage(file, options = {}) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', options.uploadPreset || 'cice_edmonton');
      formData.append('folder', options.folder || 'cice-edmonton');
      
      // Transformations par défaut pour optimiser les images
      const transformations = {
        quality: 'auto',
        fetch_format: 'auto',
        width: options.width || 'auto',
        height: options.height || 'auto',
        crop: options.crop || 'fill',
        gravity: options.gravity || 'auto'
      };

      // Ajouter les transformations à la requête
      Object.keys(transformations).forEach(key => {
        if (transformations[key]) {
          formData.append(key, transformations[key]);
        }
      });

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloud_name}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur upload: ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        data: {
          public_id: result.public_id,
          secure_url: result.secure_url,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
          created_at: result.created_at
        }
      };
    } catch (error) {
      console.error('Erreur Cloudinary upload:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Upload de vidéo
  static async uploadVideo(file, options = {}) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', options.uploadPreset || 'cice_edmonton');
      formData.append('folder', options.folder || 'cice-edmonton/videos');
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloud_name}/video/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur upload vidéo: ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        data: {
          public_id: result.public_id,
          secure_url: result.secure_url,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
          duration: result.duration,
          created_at: result.created_at
        }
      };
    } catch (error) {
      console.error('Erreur Cloudinary upload vidéo:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Générer une URL optimisée pour l'affichage
  static getOptimizedUrl(publicId, options = {}) {
    const defaultOptions = {
      quality: 'auto',
      fetch_format: 'auto',
      width: options.width || 'auto',
      height: options.height || 'auto',
      crop: options.crop || 'fill',
      gravity: options.gravity || 'auto'
    };

    // Construction manuelle de l'URL Cloudinary
    const transformations = Object.entries(defaultOptions)
      .filter(([key, value]) => value && value !== 'auto')
      .map(([key, value]) => `${key}_${value}`)
      .join(',');
    
    const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloud_name}/image/upload`;
    return transformations ? `${baseUrl}/${transformations}/${publicId}` : `${baseUrl}/${publicId}`;
  }

  // Générer une URL de vidéo optimisée
  static getOptimizedVideoUrl(publicId, options = {}) {
    const defaultOptions = {
      quality: 'auto',
      format: 'auto',
      width: options.width || 'auto',
      height: options.height || 'auto',
      crop: options.crop || 'fill'
    };

    // Construction manuelle de l'URL Cloudinary pour vidéo
    const transformations = Object.entries(defaultOptions)
      .filter(([key, value]) => value && value !== 'auto')
      .map(([key, value]) => `${key}_${value}`)
      .join(',');
    
    const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloud_name}/video/upload`;
    return transformations ? `${baseUrl}/${transformations}/${publicId}` : `${baseUrl}/${publicId}`;
  }

  // Supprimer un média (nécessite une API backend pour la sécurité)
  static async deleteMedia(publicId, resourceType = 'image') {
    try {
      // Note: La suppression nécessite l'API secret, donc doit être faite côté serveur
      console.warn('Suppression de média non implémentée côté client pour des raisons de sécurité');
      return {
        success: false,
        error: 'Suppression non disponible côté client'
      };
    } catch (error) {
      console.error('Erreur suppression Cloudinary:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Upload multiple d'images
  static async uploadMultipleImages(files, options = {}) {
    const results = [];
    
    for (const file of files) {
      const result = await this.uploadImage(file, options);
      results.push({
        file: file.name,
        ...result
      });
    }
    
    return results;
  }

  // Vérifier si un fichier est une vidéo
  static isVideo(file) {
    return file.type.startsWith('video/');
  }

  // Vérifier si un fichier est une image
  static isImage(file) {
    return file.type.startsWith('image/');
  }

  // Valider la taille du fichier
  static validateFileSize(file, maxSizeMB = 10) {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return {
      valid: file.size <= maxSizeBytes,
      size: file.size,
      maxSize: maxSizeBytes,
      sizeMB: (file.size / 1024 / 1024).toFixed(2)
    };
  }
}

export default CloudinaryService;
