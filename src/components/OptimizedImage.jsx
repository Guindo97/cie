import React, { useState, useRef, useEffect } from 'react';
import CloudinaryService from '../utils/cloudinaryService';

const OptimizedImage = ({ 
  image, 
  size = 'medium', 
  className = '', 
  alt = '', 
  priority = false,
  onLoad = () => {},
  onError = () => {}
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  // Observer pour le lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        rootMargin: '50px', // Commencer le chargement 50px avant d'être visible
        threshold: 0.1 
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Obtenir l'URL optimisée selon la taille
  const getOptimizedUrl = (image, size) => {
    if (image.public_id && CloudinaryService) {
      const sizes = {
        thumbnail: { width: 150, height: 150 },
        small: { width: 300, height: 300 },
        medium: { width: 600, height: 600 },
        large: { width: 1200, height: 1200 }
      };
      
      return CloudinaryService.getOptimizedUrl(image.public_id, {
        ...sizes[size],
        crop: 'fill',
        quality: 'auto',
        fetch_format: 'auto'
      });
    }
    
    const url = image.url || image.cloudinaryUrl || image.data;
    console.log('🔍 OptimizedImage - URL générée:', url, 'pour image:', image.id);
    return url;
  };

  // Preload de l'image suivante si c'est une priorité
  useEffect(() => {
    if (priority && isInView) {
      const img = new Image();
      img.src = getOptimizedUrl(image, size);
    }
  }, [priority, isInView, image, size]);

  const handleLoad = (e) => {
    setIsLoaded(true);
    onLoad(e);
  };

  const handleError = (e) => {
    setHasError(true);
    onError(e);
  };

  const src = isInView || priority ? getOptimizedUrl(image, size) : '';

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {/* Placeholder pendant le chargement */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center">
          <div className="text-gray-400">
            <i className="fas fa-image text-2xl"></i>
          </div>
        </div>
      )}

      {/* Image principale */}
      {src && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
        />
      )}

      {/* Erreur de chargement */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <div className="text-gray-400 text-center">
            <i className="fas fa-exclamation-triangle text-2xl mb-2"></i>
            <p className="text-sm">Erreur de chargement</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
