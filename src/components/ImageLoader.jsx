import React, { useState, useEffect, useRef } from 'react';

const ImageLoader = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = null,
  onLoad = () => {},
  onError = () => {},
  priority = false 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef(null);

  // Observer pour le lazy loading
  useEffect(() => {
    if (priority) return; // Pas de lazy loading pour les images prioritaires

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        rootMargin: '100px', // Commencer le chargement 100px avant d'être visible
        threshold: 0.1 
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = (e) => {
    setIsLoaded(true);
    onLoad(e);
  };

  const handleError = (e) => {
    setHasError(true);
    onError(e);
  };

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {/* Placeholder pendant le chargement */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center">
          {placeholder || (
            <div className="text-gray-400">
              <i className="fas fa-image text-2xl"></i>
            </div>
          )}
        </div>
      )}

      {/* Image principale */}
      {isInView && src && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
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

export default ImageLoader;

