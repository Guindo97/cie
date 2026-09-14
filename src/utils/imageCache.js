// Service de cache pour les images optimisées
import CloudinaryService from './cloudinaryService';

class ImageCache {
  constructor() {
    this.cache = new Map();
    this.maxSize = 50; // Maximum 50 images en cache
    this.preloadQueue = [];
    this.isPreloading = false;
  }

  // Générer une clé de cache
  getCacheKey(image, size) {
    return `${image.id || image.public_id}_${size}`;
  }

  // Vérifier si l'image est en cache
  has(image, size) {
    const key = this.getCacheKey(image, size);
    return this.cache.has(key);
  }

  // Récupérer l'image du cache
  get(image, size) {
    const key = this.getCacheKey(image, size);
    return this.cache.get(key);
  }

  // Ajouter une image au cache
  set(image, size, url) {
    const key = this.getCacheKey(image, size);
    
    // Nettoyer le cache si nécessaire
    if (this.cache.size >= this.maxSize) {
      this.cleanup();
    }
    
    this.cache.set(key, {
      url,
      timestamp: Date.now(),
      size
    });
  }

  // Nettoyer le cache (supprimer les plus anciennes)
  cleanup() {
    const entries = Array.from(this.cache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    // Supprimer les 25% les plus anciennes
    const toDelete = Math.floor(entries.length * 0.25);
    for (let i = 0; i < toDelete; i++) {
      this.cache.delete(entries[i][0]);
    }
  }

  // Preload intelligent des images
  async preloadImages(images, size = 'medium') {
    if (this.isPreloading) return;
    
    this.isPreloading = true;
    
    try {
      // Preloader les 3 premières images en priorité
      const priorityImages = images.slice(0, 3);
      const otherImages = images.slice(3, 10); // Preloader les 7 suivantes
      
      // Preload prioritaire
      await Promise.all(
        priorityImages.map(img => this.preloadImage(img, size))
      );
      
      // Preload des autres images en arrière-plan
      setTimeout(() => {
        otherImages.forEach(img => this.preloadImage(img, size));
      }, 100);
      
    } catch (error) {
      console.error('Erreur lors du preload:', error);
    } finally {
      this.isPreloading = false;
    }
  }

  // Preload d'une image individuelle
  async preloadImage(image, size) {
    const key = this.getCacheKey(image, size);
    
    if (this.cache.has(key)) return;
    
    return new Promise((resolve) => {
      const img = new Image();
      
      img.onload = () => {
        this.set(image, size, img.src);
        resolve();
      };
      
      img.onerror = () => {
        console.warn('Erreur de preload pour:', image.id);
        resolve();
      };
      
      // Utiliser CloudinaryService pour l'URL optimisée
      if (image.public_id) {
        img.src = CloudinaryService.getOptimizedUrl(image.public_id, {
          width: size === 'small' ? 300 : size === 'medium' ? 600 : 1200,
          height: size === 'small' ? 300 : size === 'medium' ? 600 : 1200,
          crop: 'fill',
          quality: 'auto',
          fetch_format: 'auto'
        });
      } else {
        img.src = image.url || image.cloudinaryUrl || image.data;
      }
    });
  }

  // Obtenir l'URL optimisée avec cache
  getOptimizedUrl(image, size = 'medium') {
    const key = this.getCacheKey(image, size);
    
    if (this.cache.has(key)) {
      return this.cache.get(key).url;
    }
    
    // Générer l'URL et la mettre en cache
    let url;
    if (image.public_id) {
      url = CloudinaryService.getOptimizedUrl(image.public_id, {
        width: size === 'small' ? 300 : size === 'medium' ? 600 : 1200,
        height: size === 'small' ? 300 : size === 'medium' ? 600 : 1200,
        crop: 'fill',
        quality: 'auto',
        fetch_format: 'auto'
      });
    } else {
      url = image.url || image.cloudinaryUrl || image.data;
    }
    
    this.set(image, size, url);
    return url;
  }

  // Vider le cache
  clear() {
    this.cache.clear();
  }

  // Obtenir les statistiques du cache
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      usage: `${Math.round((this.cache.size / this.maxSize) * 100)}%`
    };
  }
}

// Instance singleton
const imageCache = new ImageCache();

export default imageCache;
