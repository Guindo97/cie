// Service Cloudinary pour l'upload d'images et vidéos

// Configuration Cloudinary
const CLOUDINARY_CONFIG = {
  cloud_name: 'dwe2qubud',
  api_key: '289792115171759',
  api_secret: 'WVu4hFI0VboUZK5KTXotdNljIno',
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
      if (options.width) formData.append('width', options.width);
      if (options.height) formData.append('height', options.height);
      if (options.crop) formData.append('crop', options.crop);
      if (options.quality) formData.append('quality', options.quality);
      if (options.format) formData.append('format', options.format);
      if (options.public_id) formData.append('public_id', options.public_id);

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

  // Upload de vidéo
  static async uploadVideo(file, options = {}) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', options.uploadPreset || 'cice_edmonton');
      formData.append('folder', options.folder || 'cice-edmonton');
      
      if (options.public_id) formData.append('public_id', options.public_id);

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

  // Récupérer toutes les images depuis Cloudinary
  static async getImagesFromCloudinary() {
    try {
      // Utiliser l'API Cloudinary avec credentials pour récupérer les métadonnées
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloud_name}/resources/image?max_results=500&type=upload&prefix=cice-edmonton&tags=gallery`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Basic ${btoa(`${CLOUDINARY_CONFIG.api_key}:${CLOUDINARY_CONFIG.api_secret}`)}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur API Cloudinary: ${response.status}`);
      }

      const data = await response.json();
      console.log('🔍 Cloudinary - Images trouvées:', data.resources?.length || 0);
      
      // Transformer les ressources Cloudinary en format compatible
      const images = (data.resources || []).map(resource => ({
        id: resource.public_id,
        title: resource.context?.title || resource.public_id.split('/').pop() || 'Image Cloudinary',
        description: resource.context?.description || '',
        url: resource.secure_url,
        public_id: resource.public_id,
        filename: resource.public_id.split('/').pop() || 'image',
        size: resource.bytes,
        type: resource.format === 'mp4' ? 'video/mp4' : `image/${resource.format}`,
        category: 'events', // Catégorie par défaut
        isVideo: resource.format === 'mp4',
        width: resource.width,
        height: resource.height,
        duration: resource.duration || null,
        createdAt: resource.created_at
      }));

      return images;
    } catch (error) {
      console.error('Erreur récupération images Cloudinary:', error);
      return [];
    }
  }

  // Vérifier si un fichier est une vidéo
  static isVideo(file) {
    return file.type.startsWith('video/');
  }

  // Valider la taille d'un fichier
  static validateFileSize(file, maxSizeMB = 50) {
    const sizeMB = file.size / (1024 * 1024);
    return {
      valid: sizeMB <= maxSizeMB,
      sizeMB: sizeMB.toFixed(2)
    };
  }

  // Générer une URL optimisée pour l'affichage
  static getOptimizedUrl(publicId, options = {}) {
    const transformations = [];
    
    if (options.width) transformations.push(`w_${options.width}`);
    if (options.height) transformations.push(`h_${options.height}`);
    if (options.crop) transformations.push(`c_${options.crop}`);
    if (options.quality) transformations.push(`q_${options.quality}`);
    if (options.format) transformations.push(`f_${options.format}`);
    
    // Transformations par défaut pour l'optimisation
    if (!transformations.includes('q_')) transformations.push('q_auto');
    if (!transformations.includes('f_')) transformations.push('f_auto');
    
    const transformString = transformations.join(',');
    return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloud_name}/image/upload/${transformString}/${publicId}`;
  }
}

export default CloudinaryService;