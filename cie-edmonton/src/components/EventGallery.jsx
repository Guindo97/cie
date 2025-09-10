import React, { useState, useEffect } from 'react';
import { dataManager } from '../utils/dataManager';
import indexedDBManager from '../utils/indexedDBManager';

const ADMIN_PASSWORD = 'cice2025';

const EventGallery = ({ event, eventType, onClose, isAdmin: initialIsAdmin = false, onAdminAuth }) => {
  const [media, setMedia] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [showUpload, setShowUpload] = useState(false);
  const [isAdmin, setIsAdmin] = useState(initialIsAdmin);
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [uploadData, setUploadData] = useState({
    file: null,
    type: 'image',
    description: ''
  });

  useEffect(() => {
    loadMedia();
  }, [event.id, event.key, eventType]);

  // Navigation au clavier
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!selectedMedia) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          navigateMedia(-1);
          break;
        case 'ArrowRight':
          navigateMedia(1);
          break;
        case 'Escape':
          closeLightbox();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedMedia, selectedMediaIndex, media]);

  const loadMedia = async () => {
    // Utiliser la clé de l'événement en priorité, puis l'ID
    const eventIdentifier = event.key || event.id;
    console.log('🔍 EventGallery - Chargement des médias pour:', eventIdentifier, eventType);
    console.log('🔍 EventGallery - Event complet:', event);
    
    try {
      // Diagnostic : lister tous les médias dans la base
      console.log('🔍 EventGallery - Diagnostic complet:');
      console.log('- dataManager.useIndexedDB:', dataManager.useIndexedDB);
      console.log('- dataManager.indexedDBReady:', dataManager.indexedDBReady);
      console.log('- eventIdentifier:', eventIdentifier);
      console.log('- eventType:', eventType);
      
      if (dataManager.useIndexedDB && dataManager.indexedDBReady) {
        try {
          const allMedia = await indexedDBManager.getAllMedia();
          console.log('🔍 EventGallery - Diagnostic: Tous les médias dans IndexedDB:', allMedia);
          
          // Chercher spécifiquement les médias pour cet événement
          const eventMediaInDB = allMedia.filter(m => 
            m.eventId === eventIdentifier || 
            m.eventId === 'barbecueAccueil' || 
            m.eventId === 'barbecueAccueil2025'
          );
          console.log('🔍 EventGallery - Médias trouvés pour cet événement:', eventMediaInDB);
        } catch (error) {
          console.error('❌ EventGallery - Erreur lors du diagnostic IndexedDB:', error);
        }
      }
      
      // Charger les médias dynamiques
      let eventMedia = await dataManager.getEventMedia(eventIdentifier, eventType);
      console.log('✅ EventGallery - Médias dynamiques trouvés avec type', eventType, ':', eventMedia);
      
      // Si aucun média trouvé avec le type spécifié, essayer avec d'autres types et clés
      if (!eventMedia || eventMedia.length === 0) {
        console.log('⚠️ EventGallery - Aucun média trouvé avec le type', eventType, ', essai avec d\'autres types et clés');
        
        // Essayer avec 'upcoming' si on était sur 'past'
        if (eventType === 'past') {
          eventMedia = await dataManager.getEventMedia(eventIdentifier, 'upcoming');
          console.log('✅ EventGallery - Médias trouvés avec type upcoming:', eventMedia);
        }
        
        // Essayer avec 'gallery' si c'est un événement de galerie
        if (!eventMedia || eventMedia.length === 0) {
          eventMedia = await dataManager.getEventMedia(eventIdentifier, 'gallery');
          console.log('✅ EventGallery - Médias trouvés avec type gallery:', eventMedia);
        }
        
        // Essayer avec des clés alternatives pour le barbecue
        if (!eventMedia || eventMedia.length === 0) {
          const alternativeKeys = [];
          if (eventIdentifier === 'barbecueAccueil') {
            alternativeKeys.push('barbecueAccueil2025');
          } else if (eventIdentifier === 'barbecueAccueil2025') {
            alternativeKeys.push('barbecueAccueil');
          }
          
          for (const altKey of alternativeKeys) {
            console.log('🔍 EventGallery - Essai avec clé alternative:', altKey);
            eventMedia = await dataManager.getEventMedia(altKey, eventType);
            if (eventMedia && eventMedia.length > 0) {
              console.log('✅ EventGallery - Médias trouvés avec clé alternative', altKey, ':', eventMedia);
              break;
            }
            
            // Essayer aussi avec d'autres types pour la clé alternative
            if (eventType === 'past') {
              eventMedia = await dataManager.getEventMedia(altKey, 'upcoming');
              if (eventMedia && eventMedia.length > 0) {
                console.log('✅ EventGallery - Médias trouvés avec clé alternative', altKey, 'et type upcoming:', eventMedia);
                break;
              }
            }
          }
        }
        
        // Fallback : essayer de charger depuis localStorage directement
        if (!eventMedia || eventMedia.length === 0) {
          console.log('⚠️ EventGallery - Fallback vers localStorage direct');
          try {
            const localStorageData = JSON.parse(localStorage.getItem('cie-edmonton-data') || '{}');
            console.log('🔍 EventGallery - Données localStorage:', localStorageData);
            
            // Chercher dans tous les types d'événements
            const allEvents = [
              ...(localStorageData.events?.past || []),
              ...(localStorageData.events?.upcoming || []),
              ...(localStorageData.events?.gallery || [])
            ];
            
            const foundEvent = allEvents.find(e => 
              e.id === eventIdentifier || 
              e.key === eventIdentifier ||
              e.id === 'barbecueAccueil' || 
              e.key === 'barbecueAccueil' ||
              e.id === 'barbecueAccueil2025' || 
              e.key === 'barbecueAccueil2025'
            );
            
            if (foundEvent && foundEvent.media) {
              eventMedia = foundEvent.media;
              console.log('✅ EventGallery - Médias trouvés dans localStorage:', eventMedia);
            }
          } catch (error) {
            console.error('❌ EventGallery - Erreur lors du fallback localStorage:', error);
          }
        }
      }
      
      // Charger les médias statiques depuis les traductions
      let staticMedia = [];
      if (event.photos && Array.isArray(event.photos)) {
        staticMedia = event.photos.map((photo, index) => ({
          id: `static_${eventIdentifier}_${index}`,
          type: 'image',
          data: photo,
          name: `Photo ${index + 1}`,
          description: `Photo statique ${index + 1}`,
          isStatic: true
        }));
        console.log('✅ EventGallery - Médias statiques trouvés:', staticMedia);
      }
      
      // Combiner les médias dynamiques et statiques
      const allMedia = [...(eventMedia || []), ...staticMedia];
      console.log('✅ EventGallery - Total médias:', allMedia.length);
      setMedia(allMedia);
    } catch (error) {
      console.error('❌ EventGallery - Erreur lors du chargement des médias:', error);
      setMedia([]);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (onAdminAuth) {
      // Utiliser la fonction d'authentification fournie
      if (onAdminAuth()) {
        setIsAdmin(true);
        setShowLogin(false);
        setPassword('');
      }
    } else {
      // Fallback vers l'authentification locale
      if (password === ADMIN_PASSWORD) {
        setIsAdmin(true);
        setShowLogin(false);
        setPassword('');
      } else {
        alert('Mot de passe incorrect');
      }
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
  };

  // Fonction pour compresser les images avec compression intelligente
  const compressImage = (file, maxWidth = 800, quality = 0.6) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculer les nouvelles dimensions (plus petites)
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        // Si l'image est très grande, réduire encore plus
        if (width > 1000) {
          const scale = 1000 / width;
          width *= scale;
          height *= scale;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Dessiner l'image redimensionnée
        ctx.drawImage(img, 0, 0, width, height);
        
        // Compression progressive - essayer différentes qualités
        let compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        
        // Si l'image est encore trop grande, réduire la qualité
        if (compressedDataUrl.length > 500000) { // 500KB
          compressedDataUrl = canvas.toDataURL('image/jpeg', 0.4);
        }
        
        // Si toujours trop grande, réduire encore plus
        if (compressedDataUrl.length > 300000) { // 300KB
          compressedDataUrl = canvas.toDataURL('image/jpeg', 0.3);
        }
        
        resolve(compressedDataUrl);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier la taille du fichier (max 10MB pour les images, 5MB pour les vidéos)
      const maxSize = file.type.startsWith('image/') ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
      if (file.size > maxSize) {
        alert(`Le fichier est trop volumineux. Taille maximale : ${maxSize / (1024 * 1024)}MB`);
        return;
      }
      
      try {
        if (file.type.startsWith('image/')) {
          // Afficher un message de compression
          console.log(`Compression de l'image: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
          
          // Compresser l'image
          const compressedData = await compressImage(file);
          const compressedSize = (compressedData.length / 1024).toFixed(2);
          
          console.log(`Image compressée: ${compressedSize}KB (réduction de ${((1 - compressedData.length / file.size) * 100).toFixed(1)}%)`);
          
          setUploadData({
            ...uploadData,
            file: file,
            data: compressedData,
            name: file.name,
            type: 'image'
          });
        } else if (file.type.startsWith('video/')) {
          // Pour les vidéos, pas de compression pour l'instant
          const reader = new FileReader();
          reader.onload = (e) => {
            setUploadData({
              ...uploadData,
              file: file,
              data: e.target.result,
              name: file.name,
              type: 'video'
            });
          };
          reader.readAsDataURL(file);
        }
      } catch (error) {
        console.error('Erreur lors du traitement du fichier:', error);
        alert('Erreur lors du traitement du fichier');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Vérifier la limite de médias
    if (media.length >= 20) {
      alert('Limite de médias atteinte (20 maximum par événement).\n\nSupprimez des médias anciens ou utilisez le bouton de nettoyage pour libérer de l\'espace.');
      return;
    }
    
    if (uploadData.file) {
      const eventIdentifier = event.key || event.id;
      const mediaData = {
        type: uploadData.type,
        data: uploadData.data,
        name: uploadData.name,
        description: uploadData.description,
        fileSize: uploadData.file.size,
        mimeType: uploadData.file.type
      };
      
      console.log('Ajout de média pour:', eventIdentifier, eventType, mediaData);
      try {
        const result = await dataManager.addEventMedia(eventIdentifier, mediaData, eventType);
        console.log('Résultat ajout:', result);
        await loadMedia();
        setShowUpload(false);
        setUploadData({ file: null, type: 'image', description: '' });
      } catch (error) {
        console.error('Erreur lors de l\'ajout du média:', error);
        alert('Erreur lors de l\'ajout du média. Veuillez réessayer.');
      }
    }
  };

  const handleDelete = async (mediaId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce média ?')) {
      try {
        const eventIdentifier = event.key || event.id;
        const success = await dataManager.deleteEventMedia(eventIdentifier, mediaId, eventType);
        
        if (success) {
          console.log('Média supprimé avec succès');
          await loadMedia();
        } else {
          console.error('Échec de la suppression du média');
          alert('Erreur lors de la suppression du média');
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression du média');
      }
    }
  };

  const openLightbox = (mediaItem) => {
    const index = media.findIndex(item => item.id === mediaItem.id);
    setSelectedMedia(mediaItem);
    setSelectedMediaIndex(index);
  };

  const closeLightbox = () => {
    setSelectedMedia(null);
    setSelectedMediaIndex(0);
  };

  const navigateMedia = (direction) => {
    if (media.length === 0) return;
    
    let newIndex = selectedMediaIndex + direction;
    if (newIndex < 0) newIndex = media.length - 1;
    if (newIndex >= media.length) newIndex = 0;
    
    setSelectedMediaIndex(newIndex);
    setSelectedMedia(media[newIndex]);
  };

  // Fonction pour nettoyer les chunks
  const cleanupChunks = () => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.includes('_chunk_') || key.includes('_chunks')) {
        localStorage.removeItem(key);
      }
    });
  };

  // Fonction pour vider complètement le stockage
  const clearAllStorage = () => {
    localStorage.clear();
    // Nettoyer aussi les chunks au cas où
    cleanupChunks();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-green-500 p-4 sm:p-6 text-white flex-shrink-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">{event.title}</h2>
            <p className="text-orange-100 text-sm sm:text-base">
              Galerie des médias ({media.length} {media.length <= 1 ? 'média' : 'médias'})
              {media.length >= 15 && (
                <span className="text-yellow-300 ml-2">
                  (Limite atteinte - 15 médias max)
                </span>
              )}
            </p>
          </div>
          <div className="flex space-x-2 w-full sm:w-auto">
            {isAdmin ? (
              <>
                <button
                  onClick={() => setShowUpload(true)}
                  disabled={media.length >= 20}
                  className={`px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base flex-1 sm:flex-none ${
                    media.length >= 20 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-white text-orange-500 hover:bg-orange-50'
                  }`}
                  title={media.length >= 20 ? 'Limite de 20 médias atteinte' : 'Ajouter un média'}
                >
                  <i className="fas fa-plus mr-1 sm:mr-2"></i>
                  <span className="hidden sm:inline">
                    {media.length >= 20 ? 'Limite atteinte' : 'Ajouter'}
                  </span>
                  <span className="sm:hidden">
                    {media.length >= 20 ? '✗' : '+'}
                  </span>
                </button>
                <button
                  onClick={() => {
                    const choice = confirm('Choisir le type de nettoyage :\n\nOK = Nettoyage intelligent (garde les 15 médias les plus récents par événement)\nAnnuler = Vider complètement (supprime TOUT)');
                    
                    if (choice) {
                      // Nettoyage intelligent plus agressif
                      dataManager.cleanupOldData();
                      // Nettoyer aussi les chunks
                      cleanupChunks();
                      // Nettoyer IndexedDB aussi
                      if (dataManager.useIndexedDB && dataManager.indexedDBReady) {
                        indexedDBManager.cleanupOldMedia(15);
                      }
                      alert('Nettoyage intelligent effectué ! Les médias les plus récents ont été conservés.');
                      loadMedia();
                    } else {
                      // Vider complètement
                      if (confirm('⚠️ ATTENTION : Cette action supprimera DÉFINITIVEMENT tous les médias !\n\nÊtes-vous vraiment sûr ?')) {
                        // Vider localStorage et tous les chunks
                        clearAllStorage();
                        window.location.reload();
                      }
                    }
                  }}
                  className="bg-white text-orange-600 px-3 sm:px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors text-sm sm:text-base"
                  title="Nettoyer le stockage (intelligent ou complet)"
                >
                  <i className="fas fa-broom"></i>
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-white text-red-500 px-3 sm:px-4 py-2 rounded-lg hover:bg-red-50 transition-colors text-sm sm:text-base"
                  title="Se déconnecter"
                >
                  <i className="fas fa-sign-out-alt"></i>
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="bg-orange-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm sm:text-base"
                title="Connexion administrateur"
              >
                <i className="fas fa-user-shield mr-1 sm:mr-2"></i>
                <span className="hidden sm:inline">Admin</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="bg-white text-gray-500 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Content - Galerie en plein écran */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {media.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-images text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-500 text-lg">Aucun média pour cet événement</p>
              {isAdmin ? (
                <button
                  onClick={() => setShowUpload(true)}
                  className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Ajouter le premier média
                </button>
              ) : (
                <p className="text-gray-400 text-sm mt-2">
                  Seuls les administrateurs peuvent ajouter des médias
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
              {media.map((mediaItem) => (
                <div key={mediaItem.id} className="relative group">
                  <div
                    className="aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300"
                    onClick={() => openLightbox(mediaItem)}
                  >
                    {mediaItem.type === 'image' ? (
                      <img
                        src={mediaItem.data}
                        alt={mediaItem.description || mediaItem.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="relative w-full h-full">
                        <video
                          src={mediaItem.data}
                          className="w-full h-full object-cover"
                          muted
                        />
                        {/* Icône play pour les vidéos */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                          <i className="fas fa-play text-white text-3xl"></i>
                        </div>
                      </div>
                    )}
                    
                    {/* Bouton "Cliquer pour voir" - toujours visible */}
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-xl">
                      <div className="bg-white bg-opacity-95 text-gray-800 px-3 py-2 rounded-lg font-medium text-sm shadow-lg">
                        <i className="fas fa-search-plus mr-2"></i>
                        Cliquer pour voir
                      </div>
                    </div>
                  </div>
                  
                  {/* Bouton de suppression - seulement pour les admins */}
                  {isAdmin && (
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(mediaItem.id);
                        }}
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg opacity-80 hover:opacity-100"
                        title="Supprimer ce média"
                      >
                        <i className="fas fa-trash text-sm"></i>
                      </button>
                    </div>
                  )}
                  
                  {/* Description */}
                  {mediaItem.description && (
                    <p className="text-xs text-white mt-2 truncate bg-black bg-opacity-50 px-2 py-1 rounded">
                      {mediaItem.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upload Modal */}
        {showUpload && (
          <div className="fixed inset-0 z-60 bg-black bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Ajouter un média</h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de média
                  </label>
                  <select
                    value={uploadData.type}
                    onChange={(e) => setUploadData({...uploadData, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="image">Photo</option>
                    <option value="video">Vidéo</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fichier
                  </label>
                  <input
                    type="file"
                    accept={uploadData.type === 'image' ? 'image/*' : 'video/*'}
                    onChange={handleFileUpload}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (optionnel)
                  </label>
                  <textarea
                    value={uploadData.description}
                    onChange={(e) => setUploadData({...uploadData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    rows="3"
                    placeholder="Décrivez ce média..."
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Ajouter
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUpload(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Lightbox - Plein écran */}
        {selectedMedia && (
          <div className="fixed inset-0 z-70 bg-black bg-opacity-95 flex flex-col">
            {/* Header du lightbox */}
            <div className="flex justify-between items-center p-4 bg-black bg-opacity-50">
              <h3 className="text-white text-lg font-semibold">
                {selectedMedia.description || selectedMedia.name}
              </h3>
              <button
                onClick={closeLightbox}
                className="text-white text-2xl hover:text-gray-300 transition-colors"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            {/* Contenu du lightbox */}
            <div className="flex-1 flex items-center justify-center p-2 sm:p-4 relative min-h-0">
              {/* Bouton précédent */}
              {media.length > 1 && (
                <button
                  onClick={() => navigateMedia(-1)}
                  className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 sm:p-3 rounded-full hover:bg-opacity-75 transition-all z-10"
                >
                  <i className="fas fa-chevron-left text-xl"></i>
                </button>
              )}
              
              {/* Média principal */}
              <div className="w-full h-full flex items-center justify-center">
                {selectedMedia.type === 'image' ? (
                  <img
                    src={selectedMedia.data}
                    alt={selectedMedia.description || selectedMedia.name}
                    className="max-w-full max-h-full w-auto h-auto object-contain"
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                  />
                ) : (
                  <video
                    src={selectedMedia.data}
                    controls
                    autoPlay
                    className="max-w-full max-h-full w-auto h-auto"
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                  />
                )}
              </div>
              
              {/* Bouton suivant */}
              {media.length > 1 && (
                <button
                  onClick={() => navigateMedia(1)}
                  className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 sm:p-3 rounded-full hover:bg-opacity-75 transition-all z-10"
                >
                  <i className="fas fa-chevron-right text-xl"></i>
                </button>
              )}
              
              {/* Indicateur de position */}
              {media.length > 1 && (
                <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                  {selectedMediaIndex + 1} / {media.length}
                </div>
              )}
            </div>
            
            {/* Footer du lightbox */}
            {selectedMedia.description && (
              <div className="p-4 bg-black bg-opacity-50">
                <p className="text-white text-center text-sm">
                  {selectedMedia.description}
                </p>
              </div>
            )}
          </div>
        )}

      {/* Modal de connexion admin */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Connexion Administrateur</h3>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Entrez le mot de passe"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors"
                >
                  Se connecter
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowLogin(false);
                    setPassword('');
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default EventGallery;
