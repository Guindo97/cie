import React, { useState, useEffect } from 'react';
import { dataManager } from '../utils/dataManager';
import indexedDBManager from '../utils/indexedDBManager';
import CloudinaryService from '../utils/cloudinaryService';
import FirebaseService from '../utils/firebaseService';
import imageCache from '../utils/imageCache';
import OptimizedImage from './OptimizedImage';
import CloudinaryStatus from './CloudinaryStatus';

const ADMIN_PASSWORD = 'cice2025';

const EventGallery = ({ event, eventType, onClose, isAdmin: initialIsAdmin = false, onAdminAuth, t }) => {
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
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');

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
      // Récupérer les médias depuis Firebase (pour TOUS les utilisateurs)
      const firebaseImages = await FirebaseService.getImages();
      console.log('🔍 EventGallery - Images Firebase récupérées:', firebaseImages.length);
      
      // Filtrer les images pour cet événement spécifique
      const eventMedia = firebaseImages.filter(img => {
        // Filtre strict par eventId
        if (img.eventId === eventIdentifier) return true;
        
        // Gestion spéciale pour le barbecue (compatibilité)
        if (eventIdentifier === 'barbecueAccueil' && 
            (img.eventId === 'barbecueAccueil' || img.eventId === 'barbecueAccueil2025')) {
          return true;
        }
        
        return false;
      }).map(img => ({
        ...img,
        // S'assurer que les propriétés sont correctes pour l'affichage
        type: img.isVideo ? 'video' : 'image',
        data: img.url, // Utiliser l'URL Firebase comme data
        cloudinaryUrl: img.url, // Aussi comme cloudinaryUrl
        name: img.title || img.filename || 'Image Firebase',
        description: img.description || ''
      }));
      console.log('✅ EventGallery - Médias Firebase pour cet événement:', eventMedia.length);
      console.log('🔍 EventGallery - Détail des médias Firebase:', eventMedia);
      
      // Charger aussi les médias dynamiques locaux (pour compatibilité)
      let localEventMedia = await dataManager.getEventMedia(eventIdentifier, eventType);
      console.log('✅ EventGallery - Médias locaux trouvés:', localEventMedia?.length || 0);
      
      // Combiner les médias Firebase et locaux
      const allEventMedia = [...eventMedia, ...(localEventMedia || [])];
      console.log('✅ EventGallery - Total médias combinés:', allEventMedia.length);
      
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
      
      // Combiner les médias Firebase, locaux et statiques
      const allMedia = [...allEventMedia, ...staticMedia];
      console.log('✅ EventGallery - Total médias:', allMedia.length);
      console.log('🔍 EventGallery - Détail des médias:', allMedia.map(m => ({
        id: m.id,
        type: m.type,
        hasData: !!m.data,
        hasCloudinaryUrl: !!m.cloudinaryUrl,
        hasUrl: !!m.url,
        dataUrl: m.data ? m.data.substring(0, 50) + '...' : 'null',
        cloudinaryUrl: m.cloudinaryUrl ? m.cloudinaryUrl.substring(0, 50) + '...' : 'null',
        firebaseUrl: m.url ? m.url.substring(0, 50) + '...' : 'null'
      })));
      setMedia(allMedia);
      
      // Preload des médias après le chargement
      if (allMedia.length > 0) {
        imageCache.preloadImages(allMedia, 'medium');
      }
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
      // Valider la taille du fichier avec CloudinaryService
      const validation = CloudinaryService.validateFileSize(file, 50); // 50MB max
      if (!validation.valid) {
        alert(`Le fichier ${file.name} est trop volumineux (${validation.sizeMB}MB). Taille maximum: 50MB`);
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
      setUploading(true);
      setUploadProgress(0);
      setUploadStatus('Upload en cours...');
      
      const eventIdentifier = event.key || event.id;
      
      try {
        let uploadResult;
        
        // Upload vers Cloudinary avec métadonnées
        if (uploadData.type === 'image') {
          uploadResult = await CloudinaryService.uploadImage(uploadData.file, {
            folder: `cice-edmonton/events/${eventIdentifier}`,
            public_id: `${eventIdentifier}_${Date.now()}`,
            tags: `cice-edmonton,${eventIdentifier},gallery`,
            context: `title=${uploadData.name}|description=${uploadData.description}`
          });
        } else {
          uploadResult = await CloudinaryService.uploadVideo(uploadData.file, {
            folder: `cice-edmonton/events/${eventIdentifier}`,
            public_id: `${eventIdentifier}_${Date.now()}`,
            tags: `cice-edmonton,${eventIdentifier},gallery`,
            context: `title=${uploadData.name}|description=${uploadData.description}`
          });
        }
        
        if (uploadResult.success) {
          setUploadProgress(100);
          setUploadStatus('✅ Upload réussi !');
          
          // Créer les données du média avec l'URL Cloudinary
      const mediaData = {
        type: uploadData.type,
            data: uploadResult.data.secure_url, // URL Cloudinary correcte
            cloudinaryUrl: uploadResult.data.secure_url,
            cloudinaryPublicId: uploadResult.data.public_id,
        name: uploadData.name,
        description: uploadData.description,
            fileSize: uploadResult.data.bytes,
            mimeType: uploadData.file.type,
            uploadedAt: new Date().toISOString()
      };
      
          console.log('Ajout de média Cloudinary pour:', eventIdentifier, eventType, mediaData);
          
          // Sauvegarder dans le dataManager
        const result = await dataManager.addEventMedia(eventIdentifier, mediaData, eventType);
        console.log('Résultat ajout:', result);
          
          // AUSSI ajouter à Firebase pour que TOUS les utilisateurs voient l'image
          const galleryImageData = {
            title: mediaData.name || `Image ${eventIdentifier}`,
            description: mediaData.description || '',
            url: mediaData.cloudinaryUrl,
            public_id: mediaData.cloudinaryPublicId,
            filename: mediaData.name,
            size: mediaData.fileSize,
            type: mediaData.mimeType,
            category: 'events', // Catégorie par défaut
            isVideo: mediaData.type === 'video',
            width: uploadResult.data.width,
            height: uploadResult.data.height,
            duration: uploadResult.data.duration || null,
            eventId: eventIdentifier,
            eventType: eventType
          };
          
          // Ajouter à Firebase (pour tous les utilisateurs)
          const firebaseResult = await FirebaseService.addImage(galleryImageData);
          if (firebaseResult.success) {
            console.log('✅ Image ajoutée à Firebase pour tous les utilisateurs');
          } else {
            console.error('❌ Erreur ajout Firebase:', firebaseResult.error);
          }
          
          // AUSSI ajouter localement (pour compatibilité)
          dataManager.addImage(galleryImageData);
          console.log('✅ Image ajoutée localement aussi');
          
          // Recharger les médias
        await loadMedia();
          
          // Fermer le modal après un délai
          setTimeout(() => {
        setShowUpload(false);
        setUploadData({ file: null, type: 'image', description: '' });
            setUploading(false);
            setUploadProgress(0);
            setUploadStatus('');
          }, 2000);
          
        } else {
          throw new Error(uploadResult.error || 'Erreur lors de l\'upload');
        }
        
      } catch (error) {
        console.error('Erreur lors de l\'upload Cloudinary:', error);
        setUploadStatus(`❌ Erreur: ${error.message}`);
        setUploading(false);
        
        // Message d'erreur plus informatif
        if (error.message.includes('Configuration Cloudinary manquante')) {
          alert('Configuration Cloudinary manquante.\n\nL\'upload est désactivé. L\'application fonctionne en mode local uniquement.\n\nPour activer l\'upload, configurez les variables d\'environnement Cloudinary.');
        } else if (error.message.includes('Unknown API key')) {
          alert('Clé API Cloudinary invalide.\n\nVeuillez vérifier votre configuration Cloudinary dans le fichier .env');
        } else {
          alert(`Erreur lors de l'upload: ${error.message}`);
        }
      }
    }
  };

  const handleDelete = async (mediaId) => {
    console.log('🗑️ handleDelete appelé avec mediaId:', mediaId);
    console.log('🗑️ Event:', event);
    console.log('🗑️ EventType:', eventType);
    console.log('🗑️ Médias actuels:', media);
    
    // Utiliser une confirmation personnalisée pour mobile
    const confirmDelete = () => {
      return new Promise((resolve) => {
        if (window.confirm) {
          resolve(window.confirm('Êtes-vous sûr de vouloir supprimer ce média ?'));
        } else {
          // Fallback pour les navigateurs qui ne supportent pas confirm
          resolve(true);
        }
      });
    };
    
    try {
      const confirmed = await confirmDelete();
      console.log('🗑️ Confirmation:', confirmed);
      
      if (confirmed) {
        console.log('🗑️ Début de la suppression...');
        const eventIdentifier = event.key || event.id;
        console.log('🗑️ Suppression avec eventIdentifier:', eventIdentifier);
        
        const success = await dataManager.deleteEventMedia(eventIdentifier, mediaId, eventType);
        console.log('🗑️ Résultat de la suppression:', success);
        
        if (success) {
          console.log('✅ Média supprimé avec succès, rechargement des médias...');
          await loadMedia();
          console.log('✅ Médias rechargés');
        } else {
          console.error('❌ Échec de la suppression du média, tentative de suppression directe...');
          
          // Tentative de suppression directe en retirant le média de la liste locale
          const updatedMedia = media.filter(m => m.id !== mediaId);
          console.log('🗑️ Suppression directe - médias avant:', media.length, 'après:', updatedMedia.length);
          
          if (updatedMedia.length < media.length) {
            setMedia(updatedMedia);
            console.log('✅ Média supprimé directement de la liste locale');
          } else {
            console.error('❌ Média non trouvé dans la liste locale');
            alert('Erreur : Impossible de supprimer le média');
          }
        }
      } else {
        console.log('🗑️ Suppression annulée par l\'utilisateur');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression du média: ' + error.message);
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
            </p>
          </div>
          <div className="flex space-x-2 w-full sm:w-auto">
            {isAdmin ? (
              <>
                <button
                  onClick={() => setShowUpload(true)}
                  className="px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base flex-1 sm:flex-none bg-white text-orange-500 hover:bg-orange-50"
                  title="Ajouter un média"
                >
                  <i className="fas fa-plus mr-1 sm:mr-2"></i>
                  <span className="hidden sm:inline">
                    Ajouter
                  </span>
                  <span className="sm:hidden">
                    +
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
              <p className="text-gray-500 text-lg">{t?.admin?.gallery?.noMedia || "Aucun média pour cet événement"}</p>
              {isAdmin ? (
                <button
                  onClick={() => setShowUpload(true)}
                  className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Ajouter le premier média
                </button>
              ) : (
                <p className="text-gray-400 text-sm mt-2">
                  {t?.admin?.gallery?.adminOnly || "Seuls les administrateurs peuvent ajouter des médias"}
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
              {media && media.length > 0 ? media.map((mediaItem, index) => (
                <div key={mediaItem.id} className="relative group">
                  <div
                    className="aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300"
                    onClick={() => openLightbox(mediaItem)}
                  >
                    {mediaItem.type === 'image' ? (
                      <OptimizedImage
                        image={mediaItem}
                        size="small"
                        className="w-full h-full"
                        alt={mediaItem.description || mediaItem.name}
                        priority={index < 8} // Priorité pour les 8 premiers médias
                      />
                    ) : (
                      <div className="relative w-full h-full">
                        <video
                          src={mediaItem.url || mediaItem.cloudinaryUrl || mediaItem.data}
                          className="w-full h-full object-cover"
                          muted
                          onError={(e) => {
                            // Fallback vers Cloudinary puis local si Firebase échoue
                            if (mediaItem.url && mediaItem.cloudinaryUrl && mediaItem.url !== mediaItem.cloudinaryUrl) {
                              e.target.src = mediaItem.cloudinaryUrl;
                            } else if (mediaItem.cloudinaryUrl && mediaItem.data && mediaItem.cloudinaryUrl !== mediaItem.data) {
                              e.target.src = mediaItem.data;
                            }
                          }}
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
                  
                  {/* Bouton de suppression - seulement pour les admins et quand le modal n'est pas ouvert */}
                  {isAdmin && !showUpload && (
                    <div className="absolute top-2 right-2 z-10 hidden sm:block">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('🗑️ Bouton suppression cliqué pour:', mediaItem.id);
                          handleDelete(mediaItem.id);
                        }}
                        onTouchEnd={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('🗑️ Bouton suppression touché pour:', mediaItem.id);
                          handleDelete(mediaItem.id);
                        }}
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 active:bg-red-700 transition-colors shadow-lg opacity-90 hover:opacity-100 touch-manipulation"
                        title="Supprimer ce média"
                        style={{ 
                          minWidth: '44px', 
                          minHeight: '44px',
                          fontSize: '16px' // Éviter le zoom automatique sur iOS
                        }}
                      >
                        <i className="fas fa-trash text-sm"></i>
                      </button>
                    </div>
                  )}
                  
                  {/* Bouton de suppression pour mobile - en bas à droite */}
                  {isAdmin && !showUpload && (
                    <div className="absolute bottom-2 right-2 z-10 sm:hidden">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('🗑️ Bouton suppression mobile cliqué pour:', mediaItem.id);
                          handleDelete(mediaItem.id);
                        }}
                        onTouchEnd={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('🗑️ Bouton suppression mobile touché pour:', mediaItem.id);
                          handleDelete(mediaItem.id);
                        }}
                        className="bg-red-600 text-white px-3 py-2 rounded-lg shadow-lg opacity-90 active:opacity-100 touch-manipulation"
                        style={{ fontSize: '14px' }}
                      >
                        <i className="fas fa-trash mr-1"></i>
                        Supprimer
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
              )) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">Aucun média disponible</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Upload Modal */}
        {showUpload && (
          <div className="fixed inset-0 z-60 bg-black bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Ajouter un média</h3>
              
              {/* Barre de progression */}
              {uploading && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Upload en cours...</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  {uploadStatus && (
                    <p className="text-sm text-gray-600 mt-2">{uploadStatus}</p>
                  )}
                </div>
              )}
              
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
                    disabled={uploading}
                    className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                      uploading 
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                        : 'bg-orange-500 text-white hover:bg-orange-600'
                    }`}
                  >
                    {uploading ? 'Upload...' : 'Ajouter'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUpload(false)}
                    disabled={uploading}
                    className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                      uploading 
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                        : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                    }`}
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
                  <OptimizedImage
                    image={selectedMedia}
                    size="large"
                    className="max-w-full max-h-full w-auto h-auto object-contain"
                    alt={selectedMedia.description || selectedMedia.name}
                    priority={true}
                  />
                ) : (
                  <video
                    src={selectedMedia.cloudinaryUrl || selectedMedia.data}
                    controls
                    autoPlay
                    className="max-w-full max-h-full w-auto h-auto"
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                    onError={(e) => {
                      // Fallback vers l'URL locale si Cloudinary échoue
                      if (selectedMedia.cloudinaryUrl && selectedMedia.data !== selectedMedia.cloudinaryUrl) {
                        e.target.src = selectedMedia.data;
                      }
                    }}
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

      {/* Statut Cloudinary */}
      <CloudinaryStatus isVisible={isAdmin} />
    </div>
  );
};

export default EventGallery;
