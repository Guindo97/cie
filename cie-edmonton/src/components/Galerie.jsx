import React, { useState, useEffect } from "react";
import { dataManager } from '../utils/dataManager';
import EventGallery from './EventGallery';
import CloudinaryService from '../utils/cloudinaryService';
import FirebaseService from '../utils/firebaseService';

const Galerie = ({ t }) => {
  const g = t.gallery;

  // Catégories disponibles (doivent exister dans translations.js)
  const categoryKeys = [
    "all",
    "events",
    "culture",
    "community",
    "family",
    "celebrations",
    "sport",
    "commerce",
  ];

  // Clés d'items (doivent correspondre à g.items.*)
  const galleryItems = [
    { key: "barbecueAccueil", category: "events", emoji: "🍖" },
    { key: "africanMarket", category: "commerce", emoji: "🛒" },
    { key: "independence2023", category: "events", emoji: "🎉" },
    { key: "cookingWorkshop", category: "culture", emoji: "🍲" },
    { key: "danceNight", category: "culture", emoji: "💃" },
    { key: "generalAssembly", category: "community", emoji: "🤝" },
    { key: "kidsFestival", category: "family", emoji: "👶" },
    { key: "weddingCeremony", category: "celebrations", emoji: "💒" },
    { key: "footballMatch", category: "sport", emoji: "⚽" },
    { key: "musicConcert", category: "culture", emoji: "🎵" },
  ];

  const [selectedCategoryKey, setSelectedCategoryKey] = useState("all");
  const [openKey, setOpenKey] = useState(null); // clé de l'item ouvert
  const [photoIndex, setPhotoIndex] = useState(0); // index du carrousel
  
  // État pour l'authentification admin et la galerie d'événements
  const [isAdmin, setIsAdmin] = useState(false);
  const [showEventGallery, setShowEventGallery] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // État pour les images uploadées via Cloudinary
  const [uploadedImages, setUploadedImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const itemsFiltered =
    selectedCategoryKey === "all"
      ? galleryItems
      : galleryItems.filter((i) => i.category === selectedCategoryKey);

  const openDetails = (key) => {
    setOpenKey(key);
    setPhotoIndex(0);
  };
  const closeDetails = () => {
    setOpenKey(null);
    setPhotoIndex(0);
  };

  // Fonction pour ouvrir la galerie d'événements
  const openEventGallery = (eventKey) => {
    const event = {
      key: eventKey,
      id: eventKey, // Utiliser la clé comme ID
      title: g.items[eventKey]?.title,
      date: meta(eventKey).date,
      participants: meta(eventKey).participants,
      description: meta(eventKey).description,
      image: meta(eventKey).image,
      photos: meta(eventKey).photos || [], // Ajouter les photos statiques
      category: galleryItems.find(item => item.key === eventKey)?.category || 'events'
    };
    console.log('🔍 Galerie - Ouverture EventGallery pour:', eventKey, 'Event:', event);
    console.log('🔍 Galerie - Photos statiques:', meta(eventKey).photos);
    console.log('🔍 Galerie - Image:', meta(eventKey).image);
    setSelectedEvent(event);
    setShowEventGallery(true);
  };

  const closeEventGallery = () => {
    setShowEventGallery(false);
    setSelectedEvent(null);
  };

  // Fonction pour vérifier l'authentification admin
  const checkAdminAuth = () => {
    const password = prompt("Mot de passe administrateur :");
    if (password === "cice2025") {
      setIsAdmin(true);
      return true;
    } else {
      alert("Mot de passe incorrect");
      return false;
    }
  };

  // Récupère de façon sûre les méta-données d'un item (date/lieu/desc/photos)
  const meta = (key) => g.items?.[key] ?? {};
  const photos = (key) => (meta(key).photos ?? []).filter(Boolean);

  // Mapping des images statiques vers Cloudinary (seulement celles uploadées)
  const cloudinaryImages = {
    // 'barbecueAccueil': 'barbecue-accueil', // Pas encore uploadé
    // 'cookingWorkshop': 'atelier-cuisine', // Pas encore uploadé
    // 'danceNight': 'soiree-danse', // Pas encore uploadé
    // 'independence2023': 'independence-2023', // Pas encore uploadé
    // 'africanMarket': 'marche-africain', // Pas encore uploadé
    // 'generalAssembly': 'president', // Pas encore uploadé
    // 'kidsFestival': 'vice-presidente', // Pas encore uploadé
    // 'musicConcert': 'attieke' // Pas encore uploadé
  };

  // Génère l'URL Cloudinary optimisée
  const getCloudinaryImageUrl = (key) => {
    const cloudinaryId = cloudinaryImages[key];
    if (!cloudinaryId) return null;
    
    return `https://res.cloudinary.com/dwe2qubud/image/upload/q_auto,f_auto,w_auto,h_auto,c_fill/${cloudinaryId}`;
  };

  // Charger les images uploadées via Firebase
  useEffect(() => {
    const loadUploadedImages = async () => {
      try {
        // Récupérer les images depuis Firebase (pour TOUS les utilisateurs)
        const firebaseImages = await FirebaseService.getImages();
        console.log('🔍 Galerie - Images Firebase récupérées:', firebaseImages.length);
        
        // NE PAS afficher les images Firebase dans la galerie principale
        // Elles seront affichées seulement dans EventGallery ("Voir plus")
        setUploadedImages([]);
        console.log('✅ Galerie - Images Firebase masquées dans la galerie principale');
      } catch (error) {
        console.error('❌ Erreur chargement images Firebase:', error);
        // Fallback vers localStorage en cas d'erreur
        const localImages = dataManager.getImages();
        setUploadedImages(localImages);
        console.log('⚠️ Fallback vers images locales:', localImages.length);
      } finally {
        setLoading(false);
      }
    };

    loadUploadedImages();
  }, []);

  // Écouter l'événement personnalisé pour ouvrir la galerie d'événements
  useEffect(() => {
    const handleOpenEventGallery = (event) => {
      const eventKey = event.detail.eventKey;
      if (eventKey) {
        openEventGallery(eventKey);
      }
    };

    window.addEventListener('openEventGallery', handleOpenEventGallery);
    return () => {
      window.removeEventListener('openEventGallery', handleOpenEventGallery);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold gradient-text mb-6">{g.title}</h1>
          <p className="text-2xl text-gray-600">{g.subtitle}</p>
          
          {/* Section Statistiques masquée */}
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categoryKeys.map((ck) => (
            <button
              key={ck}
              onClick={() => setSelectedCategoryKey(ck)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                selectedCategoryKey === ck
                  ? "bg-gradient-to-r from-orange-500 to-green-500 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-50 shadow-md"
              }`}
            >
              {g.categories[ck]}
            </button>
          ))}
        </div>

        {/* Section Images Cloudinary masquée - les images s'affichent seulement dans EventGallery */}

        {/* Grille des images statiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {itemsFiltered.map((item) => (
            <div
              key={item.key}
              className="card-hover bg-white rounded-2xl shadow-xl overflow-hidden"
            >
     <div className="h-48 sm:h-56 bg-gradient-to-br from-orange-200 via-white to-green-200 flex items-center justify-center relative overflow-hidden">
       {/* Images locales avec fallback Cloudinary */}
       {meta(item.key).image ? (
         <img
           src={meta(item.key).image}
           alt={meta(item.key).title}
           className={`w-full h-full object-cover transition-transform duration-300 hover:scale-105 ${
             item.key === 'weddingCeremony' || item.key === 'footballMatch' ? 'object-top' : ''
           }`}
           onLoad={(e) => {
             console.log('✅ Image locale chargée avec succès:', meta(item.key).image);
             e.target.style.display = 'block';
           }}
           onError={(e) => {
             console.log('⚠️ Image locale non trouvée, tentative Cloudinary...');
             // Essayer Cloudinary en cas d'échec
             const cloudinaryUrl = getCloudinaryImageUrl(item.key);
             if (cloudinaryUrl) {
               e.target.src = cloudinaryUrl;
               e.target.onError = () => {
                 console.error('❌ Aucune image trouvée (locale et Cloudinary)');
                 e.target.style.display = 'none';
               };
             } else {
               e.target.style.display = 'none';
             }
           }}
           style={{display: 'block'}}
         />
       ) : getCloudinaryImageUrl(item.key) ? (
         <img
           src={getCloudinaryImageUrl(item.key)}
           alt={meta(item.key).title || item.key}
           className={`w-full h-full object-cover transition-transform duration-300 hover:scale-105 ${
             item.key === 'weddingCeremony' || item.key === 'footballMatch' ? 'object-top' : ''
           }`}
           onLoad={(e) => {
             console.log('✅ Image Cloudinary chargée avec succès:', getCloudinaryImageUrl(item.key));
             e.target.style.display = 'block';
           }}
           onError={(e) => {
             console.error('❌ Erreur de chargement de l\'image Cloudinary:', getCloudinaryImageUrl(item.key));
             e.target.style.display = 'none';
           }}
           style={{display: 'block'}}
         />
       ) : (
         <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-200 to-green-200">
           <div className="text-center">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
             <span className="text-sm text-gray-600">Aucune image disponible</span>
           </div>
         </div>
       )}
                <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                  {g.categories[item.category]}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {g.items[item.key]?.title}
                </h3>
                {meta(item.key).date && (
                  <p className="text-sm text-orange-600 font-semibold mb-2">
                    📅 {meta(item.key).date}
                  </p>
                )}
                {meta(item.key).participants && (
                  <p className="text-sm text-green-600 font-semibold mb-2">
                    👥 {meta(item.key).participants}
                  </p>
                )}
                <p className="text-gray-600">
                  {g.items[item.key]?.description || g.cardDesc}
                </p>
                <button
                  onClick={() => {
                    // Ouvrir la galerie d'événements pour tous les éléments
                    openEventGallery(item.key);
                  }}
                  className="mt-4 text-orange-500 hover:text-orange-600 font-medium flex items-center"
                >
                  <span>{g.more}</span>
                  <i className="fas fa-arrow-right ml-2" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL détails */}
      {openKey && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeDetails}
            aria-label="Close"
          />
          {/* Boîte */}
          <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-green-500 p-6 text-white">
              <h3 className="text-2xl font-bold">
                {g.items[openKey]?.title}
              </h3>
              <div className="mt-2 text-white/90 text-sm space-x-4 flex flex-wrap">
                {meta(openKey).date && (
                  <span className="inline-flex items-center">
                    <i className="fas fa-calendar mr-2" />
                    {meta(openKey).date}
                  </span>
                )}
                {meta(openKey).location && (
                  <span className="inline-flex items-center">
                    <i className="fas fa-map-marker-alt mr-2" />
                    {meta(openKey).location}
                  </span>
                )}
              </div>
            </div>

            {/* Contenu */}
            <div className="p-6 space-y-6">
              {/* Carrousel photo (si photos fournies) */}
              {photos(openKey).length > 0 ? (
                <div className="relative">
                  <img
                    src={photos(openKey)[photoIndex]}
                    alt={`${g.items[openKey]?.title} ${photoIndex + 1}`}
                    className="w-full h-72 object-cover rounded-xl"
                  />
                  {/* Controls */}
                  {photos(openKey).length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setPhotoIndex((i) =>
                            (i - 1 + photos(openKey).length) %
                            photos(openKey).length
                          )
                        }
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center shadow"
                        aria-label="Previous"
                      >
                        <i className="fas fa-chevron-left" />
                      </button>
                      <button
                        onClick={() =>
                          setPhotoIndex((i) =>
                            (i + 1) % photos(openKey).length
                          )
                        }
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center shadow"
                        aria-label="Next"
                      >
                        <i className="fas fa-chevron-right" />
                      </button>
                    </>
                  )}
                  {/* Dots */}
                  {photos(openKey).length > 1 && (
                    <div className="flex justify-center gap-2 mt-3">
                      {photos(openKey).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setPhotoIndex(i)}
                          className={`w-2.5 h-2.5 rounded-full ${
                            photoIndex === i ? "bg-orange-500" : "bg-gray-300"
                          }`}
                          aria-label={`Go to photo ${i + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // Fallback si aucune photo fournie
                <div className="h-40 rounded-xl bg-gradient-to-br from-orange-100 to-green-100 flex items-center justify-center text-6xl">
                  {galleryItems.find((i) => i.key === openKey)?.emoji ?? "📷"}
                </div>
              )}

              {/* Description détaillée */}
              {meta(openKey).longDescription ? (
                <p className="text-gray-700 leading-relaxed">
                  {meta(openKey).longDescription}
                </p>
              ) : meta(openKey).description ? (
                <p className="text-gray-700 leading-relaxed">
                  {meta(openKey).description}
                </p>
              ) : (
                <p className="text-gray-700 leading-relaxed">{g.cardDesc}</p>
              )}

              <div className="flex justify-end">
                <button
                  onClick={closeDetails}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  {g.close ?? "Fermer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Galerie d'événements avec mode admin */}
      {showEventGallery && selectedEvent && (
        <EventGallery
          event={selectedEvent}
          eventType="past"
          onClose={closeEventGallery}
          isAdmin={isAdmin}
          onAdminAuth={checkAdminAuth}
        />
      )}
    </div>
  );
};

export default Galerie;
