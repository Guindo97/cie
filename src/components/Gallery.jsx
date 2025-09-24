import React, { useState, useEffect } from 'react';
import { dataManager } from '../utils/dataManager';
import CloudinaryService from '../utils/cloudinaryService';

const Gallery = ({ t, language }) => {
  const [images, setImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Catégories disponibles
  const categories = [
    { key: 'all', label: t.gallery?.all || 'Toutes', emoji: '🖼️' },
    { key: 'events', label: t.gallery?.events || 'Événements', emoji: '🎉' },
    { key: 'culture', label: t.gallery?.culture || 'Culture', emoji: '🎭' },
    { key: 'community', label: t.gallery?.community || 'Communauté', emoji: '🤝' },
    { key: 'family', label: t.gallery?.family || 'Famille', emoji: '👨‍👩‍👧‍👦' },
    { key: 'celebrations', label: t.gallery?.celebrations || 'Célébrations', emoji: '🎊' },
    { key: 'sport', label: t.gallery?.sport || 'Sport', emoji: '⚽' },
    { key: 'commerce', label: t.gallery?.commerce || 'Commerce', emoji: '🛒' }
  ];

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = () => {
    try {
      const galleryImages = dataManager.getImages();
      setImages(galleryImages);
    } catch (error) {
      console.error('Erreur lors du chargement des images:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les images par catégorie
  const filteredImages = selectedCategory === 'all' 
    ? images 
    : images.filter(img => img.category === selectedCategory);

  // Ouvrir l'image en plein écran
  const openLightbox = (image) => {
    setSelectedImage(image);
  };

  // Fermer le lightbox
  const closeLightbox = () => {
    setSelectedImage(null);
  };

  // Navigation au clavier
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!selectedImage) return;
      
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          navigateImage(-1);
          break;
        case 'ArrowRight':
          navigateImage(1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedImage, filteredImages]);

  // Navigation entre les images
  const navigateImage = (direction) => {
    if (filteredImages.length === 0) return;
    
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    let newIndex = currentIndex + direction;
    
    if (newIndex < 0) newIndex = filteredImages.length - 1;
    if (newIndex >= filteredImages.length) newIndex = 0;
    
    setSelectedImage(filteredImages[newIndex]);
  };

  // Obtenir l'URL optimisée de Cloudinary
  const getOptimizedImageUrl = (image) => {
    if (image.public_id && CloudinaryService) {
      return CloudinaryService.getOptimizedUrl(image.public_id, {
        width: 400,
        height: 400,
        crop: 'fill',
        quality: 'auto',
        fetch_format: 'auto'
      });
    }
    return image.url;
  };

  // Obtenir l'URL de la miniature
  const getThumbnailUrl = (image) => {
    if (image.public_id && CloudinaryService) {
      return CloudinaryService.getOptimizedUrl(image.public_id, {
        width: 200,
        height: 200,
        crop: 'fill',
        quality: 'auto',
        fetch_format: 'auto'
      });
    }
    return image.url;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-orange-500 mb-4"></i>
          <p className="text-gray-600">Chargement de la galerie...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            {t.gallery?.title || 'Galerie Photos'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t.gallery?.subtitle || 'Découvrez les moments précieux de notre communauté ivoirienne à Edmonton'}
          </p>
        </div>

        {/* Filtres de catégories */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {categories.map(category => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category.key
                    ? 'bg-gradient-to-r from-orange-500 to-green-500 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600 shadow-md'
                }`}
              >
                <span className="mr-2">{category.emoji}</span>
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Statistiques */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-orange-500">{images.length}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-500">{filteredImages.length}</div>
              <div className="text-sm text-gray-600">Filtrées</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-500">
                {images.filter(img => img.isVideo).length}
              </div>
              <div className="text-sm text-gray-600">Vidéos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-500">
                {new Set(images.map(img => img.category)).size}
              </div>
              <div className="text-sm text-gray-600">Catégories</div>
            </div>
          </div>
        </div>

        {/* Grille des images */}
        {filteredImages.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-xl">
            <i className="fas fa-images text-6xl text-gray-300 mb-4"></i>
            <p className="text-gray-500 text-lg">
              {selectedCategory === 'all' 
                ? 'Aucune image dans la galerie'
                : `Aucune image dans la catégorie "${categories.find(cat => cat.key === selectedCategory)?.label}"`
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {filteredImages.map((image, index) => (
              <div
                key={image.id}
                className="relative group cursor-pointer"
                onClick={() => openLightbox(image)}
              >
                <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                  {image.isVideo ? (
                    <div className="relative w-full h-full">
                      <video
                        src={getThumbnailUrl(image)}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        playsInline
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <i className="fas fa-play text-white text-3xl"></i>
                      </div>
                      <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs">
                        <i className="fas fa-play mr-1"></i>
                        Vidéo
                      </div>
                    </div>
                  ) : (
                    <img
                      src={getThumbnailUrl(image)}
                      alt={image.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}
                  
                  {/* Overlay au survol */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <i className="fas fa-search-plus text-white text-2xl"></i>
                    </div>
                  </div>
                </div>

                {/* Titre de l'image */}
                {image.title && (
                  <p className="text-sm text-gray-700 mt-2 truncate font-medium">
                    {image.title}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Lightbox */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-4 bg-black bg-opacity-50">
              <h3 className="text-white text-lg font-semibold">
                {selectedImage.title || 'Image'}
              </h3>
              <button
                onClick={closeLightbox}
                className="text-white text-2xl hover:text-gray-300 transition-colors"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            {/* Contenu */}
            <div className="flex-1 flex items-center justify-center p-4 relative">
              {/* Bouton précédent */}
              {filteredImages.length > 1 && (
                <button
                  onClick={() => navigateImage(-1)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all z-10"
                >
                  <i className="fas fa-chevron-left text-xl"></i>
                </button>
              )}
              
              {/* Image/Vidéo principale */}
              <div className="w-full h-full flex items-center justify-center">
                {selectedImage.isVideo ? (
                  <video
                    src={getOptimizedImageUrl(selectedImage)}
                    controls
                    autoPlay
                    className="max-w-full max-h-full w-auto h-auto"
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                  />
                ) : (
                  <img
                    src={getOptimizedImageUrl(selectedImage)}
                    alt={selectedImage.title}
                    className="max-w-full max-h-full w-auto h-auto object-contain"
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                  />
                )}
              </div>
              
              {/* Bouton suivant */}
              {filteredImages.length > 1 && (
                <button
                  onClick={() => navigateImage(1)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all z-10"
                >
                  <i className="fas fa-chevron-right text-xl"></i>
                </button>
              )}
              
              {/* Indicateur de position */}
              {filteredImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                  {filteredImages.findIndex(img => img.id === selectedImage.id) + 1} / {filteredImages.length}
                </div>
              )}
            </div>
            
            {/* Footer avec description */}
            {selectedImage.description && (
              <div className="p-4 bg-black bg-opacity-50">
                <p className="text-white text-center text-sm">
                  {selectedImage.description}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
