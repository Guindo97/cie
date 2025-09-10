import React, { useState, useEffect } from 'react';
import { dataManager } from '../utils/dataManager';

const GalleryManager = ({ onClose }) => {
  const [images, setImages] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('events');
  const [imageTitle, setImageTitle] = useState('');
  const [imageDescription, setImageDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  // Catégories disponibles pour la galerie
  const categories = [
    { key: 'events', label: 'Événements', emoji: '🎉' },
    { key: 'culture', label: 'Culture', emoji: '🎭' },
    { key: 'community', label: 'Communauté', emoji: '🤝' },
    { key: 'family', label: 'Famille', emoji: '👨‍👩‍👧‍👦' },
    { key: 'celebrations', label: 'Célébrations', emoji: '🎊' },
    { key: 'sport', label: 'Sport', emoji: '⚽' },
    { key: 'commerce', label: 'Commerce', emoji: '🛒' }
  ];

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = () => {
    const galleryImages = dataManager.getImages();
    setImages(galleryImages);
  };

  const handleFileSelection = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    setSelectedFiles(imageFiles);
    setShowPreview(true);
  };

  const handleConfirmUpload = async () => {
    setUploading(true);

    for (const file of selectedFiles) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = {
          title: imageTitle || file.name.split('.')[0],
          description: imageDescription,
          url: e.target.result,
          filename: file.name,
          size: file.size,
          type: file.type,
          category: selectedCategory,
          createdAt: new Date().toISOString()
        };
        
        dataManager.addImage(imageData);
        loadImages();
      };
      reader.readAsDataURL(file);
    }

    setUploading(false);
    setShowUpload(false);
    setShowPreview(false);
    // Reset form
    setImageTitle('');
    setImageDescription('');
    setSelectedCategory('events');
    setSelectedFiles([]);
  };

  const handleValidateAndSend = async () => {
    // Si on est en mode upload avec des fichiers sélectionnés
    if (selectedFiles.length > 0) {
      setUploading(true);

      try {
        for (const file of selectedFiles) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const imageData = {
              title: imageTitle || file.name.split('.')[0],
              description: imageDescription,
              url: e.target.result,
              filename: file.name,
              size: file.size,
              type: file.type,
              category: selectedCategory,
              createdAt: new Date().toISOString()
            };
            
            dataManager.addImage(imageData);
          };
          reader.readAsDataURL(file);
        }

        // Attendre un peu pour que les images soient traitées
        setTimeout(() => {
          loadImages();
          setUploading(false);
          setShowUpload(false);
          setShowPreview(false);
          // Reset form
          setImageTitle('');
          setImageDescription('');
          setSelectedCategory('events');
          setSelectedFiles([]);
          
          // Message de confirmation
          alert(`✅ Images validées et ajoutées à la section "${categories.find(cat => cat.key === selectedCategory)?.label}" !`);
        }, 1000);

      } catch (error) {
        console.error('Erreur lors de la validation:', error);
        alert('❌ Erreur lors de la validation des images.');
        setUploading(false);
      }
    } else {
      // Si on n'est pas en mode upload, on valide les images existantes
      if (images.length === 0) {
        alert('Aucune image à valider. Veuillez d\'abord ajouter des images.');
        return;
      }

      // Valider toutes les images existantes
      alert(`✅ ${images.length} image(s) validée(s) dans la galerie !`);
    }
  };

  const handleEditImage = (imageId, updates) => {
    dataManager.updateImage(imageId, updates);
    loadImages();
  };

  const handleDeleteImage = (imageId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) {
      dataManager.deleteImage(imageId);
      loadImages();
    }
  };

  const ImageCard = ({ image }) => (
    <div className="relative group bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="aspect-square overflow-hidden">
        <img
          src={image.url}
          alt={image.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      {/* Overlay avec actions */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
          <button
            onClick={() => {
              const newTitle = prompt('Nouveau titre:', image.title);
              if (newTitle && newTitle !== image.title) {
                handleEditImage(image.id, { title: newTitle });
              }
            }}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
            title="Modifier le titre"
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            onClick={() => handleDeleteImage(image.id)}
            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
            title="Supprimer"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>

      {/* Info de l'image */}
      <div className="p-3">
        <h4 className="font-semibold text-gray-800 truncate">{image.title}</h4>
        {image.description && (
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{image.description}</p>
        )}
        <div className="flex items-center justify-between mt-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            {categories.find(cat => cat.key === image.category)?.emoji} {categories.find(cat => cat.key === image.category)?.label}
          </span>
          <div className="text-xs text-gray-500">
            <p>{new Date(image.createdAt).toLocaleDateString()}</p>
            <p>{(image.size / 1024).toFixed(1)} KB</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          <i className="fas fa-images mr-3 text-orange-500"></i>
          Gestion de la Galerie
        </h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowUpload(true)}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center space-x-2"
          >
            <i className="fas fa-upload"></i>
            <span>Ajouter des images</span>
          </button>
        </div>
      </div>

      {/* Zone d'upload */}
      {showUpload && (
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 bg-gray-50">
          <div className="text-center mb-6">
            <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Ajouter des images</h3>
            <p className="text-gray-500">
              Sélectionnez une ou plusieurs images à ajouter à la galerie
            </p>
          </div>
          
          {/* Formulaire de configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre de l'image
              </label>
              <input
                type="text"
                value={imageTitle}
                onChange={(e) => setImageTitle(e.target.value)}
                placeholder="Ex: Miel artisanal"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                {categories.map(cat => (
                  <option key={cat.key} value={cat.key}>
                    {cat.emoji} {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (optionnelle)
            </label>
            <textarea
              value={imageDescription}
              onChange={(e) => setImageDescription(e.target.value)}
              placeholder="Ex: Miel artisanal produit localement par nos membres"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelection}
            className="hidden"
            id="imageUpload"
            disabled={uploading}
          />
          
          <div className="text-center">
            <label
              htmlFor="imageUpload"
              className="inline-block px-6 py-3 rounded-lg cursor-pointer transition-colors bg-orange-500 text-white hover:bg-orange-600"
            >
              <i className="fas fa-upload mr-2"></i>
              Sélectionner des images
            </label>
            
            <button
              onClick={() => {
                setShowUpload(false);
                setImageTitle('');
                setImageDescription('');
                setSelectedCategory('events');
                setSelectedFiles([]);
                setShowPreview(false);
              }}
              className="ml-4 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Prévisualisation et validation */}
      {showPreview && selectedFiles.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-orange-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            <i className="fas fa-eye mr-2 text-orange-500"></i>
            Prévisualisation des images
          </h3>
          
          {/* Aperçu des images */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => {
                        const newFiles = selectedFiles.filter((_, i) => i !== index);
                        setSelectedFiles(newFiles);
                        if (newFiles.length === 0) {
                          setShowPreview(false);
                        }
                      }}
                      className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                      title="Supprimer cette image"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-1 truncate">{file.name}</p>
              </div>
            ))}
          </div>
          
          {/* Résumé de l'ajout */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-700 mb-2">Résumé de l'ajout :</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Titre :</span>
                <span className="ml-2 text-gray-800">{imageTitle || 'Titre automatique'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Catégorie :</span>
                <span className="ml-2 text-gray-800">
                  {categories.find(cat => cat.key === selectedCategory)?.emoji} {categories.find(cat => cat.key === selectedCategory)?.label}
                </span>
              </div>
              <div className="md:col-span-2">
                <span className="font-medium text-gray-600">Description :</span>
                <span className="ml-2 text-gray-800">{imageDescription || 'Aucune description'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Nombre d'images :</span>
                <span className="ml-2 text-gray-800">{selectedFiles.length}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Taille totale :</span>
                <span className="ml-2 text-gray-800">
                  {(selectedFiles.reduce((acc, file) => acc + file.size, 0) / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            </div>
          </div>
          
          {/* Boutons d'action */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleConfirmUpload}
              disabled={uploading}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                uploading
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {uploading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Ajout en cours...
                </>
              ) : (
                <>
                  <i className="fas fa-check mr-2"></i>
                  Valider et ajouter
                </>
              )}
            </button>
            
            <button
              onClick={() => {
                setShowPreview(false);
                setSelectedFiles([]);
              }}
              disabled={uploading}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              <i className="fas fa-times mr-2"></i>
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Statistiques */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistiques</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500">{images.length}</div>
            <div className="text-sm text-gray-600">Images totales</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">
              {images.filter(img => new Date(img.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
            </div>
            <div className="text-sm text-gray-600">Cette semaine</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">
              {(images.reduce((acc, img) => acc + img.size, 0) / 1024 / 1024).toFixed(1)} MB
            </div>
            <div className="text-sm text-gray-600">Taille totale</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500">
              {new Set(images.map(img => img.category)).size}
            </div>
            <div className="text-sm text-gray-600">Catégories</div>
          </div>
        </div>
        
        {/* Répartition par catégorie */}
        <div className="mt-6">
          <h4 className="text-md font-semibold text-gray-700 mb-3">Répartition par catégorie</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categories.map(cat => {
              const count = images.filter(img => img.category === cat.key).length;
              return (
                <div key={cat.key} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">
                    {cat.emoji} {cat.label}
                  </span>
                  <span className="text-sm font-bold text-orange-600">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grille des images */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Images de la galerie ({images.length})
        </h3>
        
        {images.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <i className="fas fa-images text-4xl text-gray-300 mb-4"></i>
            <p className="text-gray-500 text-lg">Aucune image dans la galerie</p>
            <p className="text-gray-400">Ajoutez des images pour commencer</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {images.map(image => (
              <ImageCard key={image.id} image={image} />
            ))}
          </div>
        )}
      </div>

      {/* Actions en lot */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions en lot</h3>
        <div className="flex space-x-4">
            <button
              onClick={handleValidateAndSend}
              disabled={uploading || (selectedFiles.length === 0 && images.length === 0)}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                uploading || (selectedFiles.length === 0 && images.length === 0)
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {uploading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Validation en cours...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-check-circle"></i>
                  <span>Valider et envoyer dans la section</span>
                </>
              )}
            </button>
            
            {images.length > 0 && (
              <>
                <button
                  onClick={() => {
                    const data = dataManager.loadData();
                    const blob = new Blob([JSON.stringify(data.gallery, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `galerie_backup_${new Date().toISOString().split('T')[0]}.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
                >
                  <i className="fas fa-download"></i>
                  <span>Exporter la galerie</span>
                </button>
                
                <button
                  onClick={() => {
                    if (window.confirm('Êtes-vous sûr de vouloir supprimer toutes les images ?')) {
                      dataManager.resetData();
                      loadImages();
                    }
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center space-x-2"
                >
                  <i className="fas fa-trash"></i>
                  <span>Vider la galerie</span>
                </button>
              </>
            )}
          </div>
        </div>
    </div>
  );
};

export default GalleryManager;
