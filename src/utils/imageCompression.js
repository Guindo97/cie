// Service de compression d'images avancé
class ImageCompression {
  // Compression intelligente basée sur la taille et le type d'image
  static async compressImage(file, options = {}) {
    const {
      maxWidth = options.maxWidth || 1200,
      maxHeight = options.maxHeight || 1200,
      quality = options.quality || 0.8,
      format = options.format || 'jpeg'
    } = file;

    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculer les dimensions optimales
        let { width, height } = img;
        
        // Redimensionner si nécessaire
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Dessiner l'image redimensionnée
        ctx.drawImage(img, 0, 0, width, height);
        
        // Compression progressive
        let compressedDataUrl = canvas.toDataURL(`image/${format}`, quality);
        
        // Si l'image est encore trop grande, réduire la qualité
        const maxSize = options.maxSize || 500000; // 500KB par défaut
        if (compressedDataUrl.length > maxSize) {
          let newQuality = quality * 0.7;
          compressedDataUrl = canvas.toDataURL(`image/${format}`, newQuality);
          
          // Si toujours trop grande, réduire encore plus
          if (compressedDataUrl.length > maxSize) {
            newQuality = quality * 0.5;
            compressedDataUrl = canvas.toDataURL(`image/${format}`, newQuality);
          }
        }
        
        resolve({
          dataUrl: compressedDataUrl,
          width: Math.round(width),
          height: Math.round(height),
          size: compressedDataUrl.length,
          compressionRatio: (1 - compressedDataUrl.length / file.size) * 100
        });
      };
      
      img.src = URL.createObjectURL(file);
    });
  }

  // Compression pour les miniatures
  static async compressThumbnail(file, size = 200) {
    return this.compressImage(file, {
      maxWidth: size,
      maxHeight: size,
      quality: 0.7,
      maxSize: 50000 // 50KB pour les miniatures
    });
  }

  // Compression pour les images de galerie
  static async compressGallery(file) {
    return this.compressImage(file, {
      maxWidth: 800,
      maxHeight: 800,
      quality: 0.8,
      maxSize: 200000 // 200KB pour la galerie
    });
  }

  // Compression pour les images plein écran
  static async compressFullscreen(file) {
    return this.compressImage(file, {
      maxWidth: 1920,
      maxHeight: 1920,
      quality: 0.9,
      maxSize: 1000000 // 1MB pour plein écran
    });
  }

  // Détecter le type d'image et optimiser en conséquence
  static async smartCompress(file) {
    const fileSize = file.size;
    const isLarge = fileSize > 2000000; // 2MB
    
    if (isLarge) {
      // Image très grande - compression agressive
      return this.compressImage(file, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.6,
        maxSize: 300000
      });
    } else if (fileSize > 1000000) {
      // Image grande - compression modérée
      return this.compressImage(file, {
        maxWidth: 1600,
        maxHeight: 1600,
        quality: 0.7,
        maxSize: 500000
      });
    } else {
      // Image normale - compression légère
      return this.compressImage(file, {
        maxWidth: 2000,
        maxHeight: 2000,
        quality: 0.8,
        maxSize: 800000
      });
    }
  }

  // Créer plusieurs versions d'une image
  static async createImageVersions(file) {
    const [thumbnail, gallery, fullscreen] = await Promise.all([
      this.compressThumbnail(file),
      this.compressGallery(file),
      this.compressFullscreen(file)
    ]);

    return {
      thumbnail,
      gallery,
      fullscreen,
      original: {
        dataUrl: URL.createObjectURL(file),
        width: 0, // Sera rempli par l'image originale
        height: 0,
        size: file.size
      }
    };
  }

  // Optimiser une image existante
  static async optimizeExistingImage(imageUrl, options = {}) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const compressedDataUrl = canvas.toDataURL('image/jpeg', options.quality || 0.8);
        
        resolve({
          dataUrl: compressedDataUrl,
          width: img.width,
          height: img.height,
          size: compressedDataUrl.length
        });
      };
      
      img.onerror = () => {
        resolve(null);
      };
      
      img.src = imageUrl;
    });
  }
}

export default ImageCompression;

