import React, { useState, useEffect } from 'react';
import { dataManager } from '../utils/dataManager';

const Evenements = ({ t }) => {
  // État pour les événements dynamiques
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  
  // Charger les événements depuis le dataManager
  useEffect(() => {
  const loadEvents = () => {
    // Nettoyer les doublons existants
    dataManager.cleanDuplicates();
    
    // Initialiser les événements statiques dans le localStorage
    if (t.events.items?.past) {
      dataManager.initStaticEvents(t.events.items.past, 'past');
    }
    
    // Initialiser les événements statiques upcoming
    if (t.events.items?.upcoming) {
      dataManager.initStaticEvents(t.events.items.upcoming, 'upcoming');
    }

    const upcoming = dataManager.getEvents('upcoming');
    const past = dataManager.getEvents('past');
    
    // Diagnostic des doublons
    console.log('🔍 DIAGNOSTIC DOUBLONS:');
    console.log('Événements upcoming dans localStorage:', upcoming);
    console.log('Événements upcoming statiques:', t.events.items?.upcoming);
    
    // Vérifier spécifiquement attiekeWomenDay
    const attiekeInUpcoming = upcoming.filter(e => e.title?.includes('attiéké') || e.key === 'attiekeWomenDay');
    const attiekeInStatic = t.events.items?.upcoming?.filter(e => e.title?.includes('attiéké') || e.key === 'attiekeWomenDay');
    console.log('Attiéké dans upcoming localStorage:', attiekeInUpcoming);
    console.log('Attiéké dans upcoming statique:', attiekeInStatic);

      // Combiner avec les événements statiques des traductions
      const staticUpcoming = t.events.items?.upcoming ?? [];
      const staticPast = t.events.items?.past ?? [];

      console.log('Événements dynamiques upcoming:', upcoming);
      console.log('Événements statiques upcoming:', staticUpcoming);
      console.log('Événements dynamiques past:', past);
      console.log('Événements statiques past:', staticPast);
      console.log('Recherche barbecueAccueil2025 dans past:', past.find(e => e.key === 'barbecueAccueil2025'));
      console.log('Recherche barbecueAccueil2025 dans staticPast:', staticPast.find(e => e.key === 'barbecueAccueil2025'));

      // Utiliser directement les événements du localStorage (qui incluent déjà les statiques)
      // Mettre à jour les événements existants avec les nouvelles propriétés des traductions
      const updatedUpcoming = upcoming.map(dynamicEvent => {
        const staticEvent = staticUpcoming.find(staticEvent => 
          staticEvent.key === dynamicEvent.key || staticEvent.key === dynamicEvent.id ||
          (staticEvent.title === dynamicEvent.title && staticEvent.date === dynamicEvent.date)
        );
        return staticEvent ? { ...dynamicEvent, ...staticEvent } : dynamicEvent;
      });
      
      const updatedPast = past.map(dynamicEvent => {
        const staticEvent = staticPast.find(staticEvent => 
          staticEvent.key === dynamicEvent.key || staticEvent.key === dynamicEvent.id ||
          (staticEvent.title === dynamicEvent.title && staticEvent.date === dynamicEvent.date)
        );
        console.log('Mise à jour événement past:', dynamicEvent.title, 'avec static:', staticEvent?.title);
        return staticEvent ? { ...dynamicEvent, ...staticEvent } : dynamicEvent;
      });

      // NE PAS ajouter d'événements statiques supplémentaires - ils sont déjà dans le localStorage
      // Utiliser directement les événements mis à jour
      console.log('Événements upcoming finaux:', updatedUpcoming);
      console.log('Événements past finaux:', updatedPast);

      // Trier les événements passés du plus récent au plus ancien
      const sortedPastEvents = updatedPast.sort((a, b) => {
        // Extraire la date de l'événement
        const dateA = a.date || '';
        const dateB = b.date || '';
        
        // Si les dates sont identiques, garder l'ordre original
        if (dateA === dateB) return 0;
        
        // Fonction pour convertir les dates françaises en format ISO
        const convertFrenchDate = (dateStr) => {
          if (!dateStr) return null;
          
          // Gérer les formats français comme "30 août 2024"
          const months = {
            'janvier': '01', 'février': '02', 'mars': '03', 'avril': '04',
            'mai': '05', 'juin': '06', 'juillet': '07', 'août': '08',
            'septembre': '09', 'octobre': '10', 'novembre': '11', 'décembre': '12'
          };
          
          const parts = dateStr.split(' ');
          if (parts.length === 3) {
            const day = parts[0].padStart(2, '0');
            const month = months[parts[1].toLowerCase()];
            const year = parts[2];
            if (month) {
              return `${year}-${month}-${day}`;
            }
          }
          
          return dateStr;
        };
        
        // Convertir les dates
        const isoDateA = convertFrenchDate(dateA);
        const isoDateB = convertFrenchDate(dateB);
        
        // Essayer de convertir en Date pour un tri plus précis
        try {
          const dateObjA = new Date(isoDateA);
          const dateObjB = new Date(isoDateB);
          
          // Si les dates sont valides, les comparer
          if (!isNaN(dateObjA.getTime()) && !isNaN(dateObjB.getTime())) {
            return dateObjB.getTime() - dateObjA.getTime(); // Plus récent en premier
          }
        } catch (error) {
          // En cas d'erreur, utiliser le tri par chaîne
          console.warn('Erreur lors du tri des dates:', error);
        }
        
        // Fallback: tri par chaîne (plus récent en premier)
        return dateB.localeCompare(dateA);
      });

      setUpcomingEvents(updatedUpcoming);
      setPastEvents(sortedPastEvents);
    };
    
    loadEvents();
    
    // Écouter les changements dans le localStorage
    const handleStorageChange = () => {
      loadEvents();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Vérifier les changements toutes les 2 secondes (pour les changements dans le même onglet)
    const interval = setInterval(loadEvents, 2000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [t.events.items]);

  // Re-trier les événements passés quand ils changent
  useEffect(() => {
    if (pastEvents.length > 0) {
      const sortedEvents = [...pastEvents].sort((a, b) => {
        const dateA = a.date || '';
        const dateB = b.date || '';
        
        if (dateA === dateB) return 0;
        
        // Fonction pour convertir les dates françaises en format ISO
        const convertFrenchDate = (dateStr) => {
          if (!dateStr) return null;
          
          const months = {
            'janvier': '01', 'février': '02', 'mars': '03', 'avril': '04',
            'mai': '05', 'juin': '06', 'juillet': '07', 'août': '08',
            'septembre': '09', 'octobre': '10', 'novembre': '11', 'décembre': '12'
          };
          
          const parts = dateStr.split(' ');
          if (parts.length === 3) {
            const day = parts[0].padStart(2, '0');
            const month = months[parts[1].toLowerCase()];
            const year = parts[2];
            if (month) {
              return `${year}-${month}-${day}`;
            }
          }
          
          return dateStr;
        };
        
        const isoDateA = convertFrenchDate(dateA);
        const isoDateB = convertFrenchDate(dateB);
        
        try {
          const dateObjA = new Date(isoDateA);
          const dateObjB = new Date(isoDateB);
          
          if (!isNaN(dateObjA.getTime()) && !isNaN(dateObjB.getTime())) {
            return dateObjB.getTime() - dateObjA.getTime();
          }
        } catch (error) {
          console.warn('Erreur lors du tri des dates:', error);
        }
        
        return dateB.localeCompare(dateA);
      });
      
      // Mettre à jour seulement si l'ordre a changé
      const orderChanged = sortedEvents.some((event, index) => 
        event.key !== pastEvents[index]?.key || event.id !== pastEvents[index]?.id
      );
      
      if (orderChanged) {
        setPastEvents(sortedEvents);
      }
    }
  }, [pastEvents]);

  // --- État du formulaire d'inscription ---
  const [isOpen, setIsOpen] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    eventName: "",
  });


  // Empêche le scroll derrière le modal (mobile/desktop)
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const openForm = (eventTitle) => {
    setFormSent(false);
    setFormData((prev) => ({ ...prev, eventName: eventTitle }));
    setIsOpen(true);
  };

  const closeForm = () => {
    setIsOpen(false);
    setFormSent(false);
    setFormData({ firstName: "", lastName: "", eventName: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici tu peux envoyer les données (EmailJS / API backend) si tu veux.
    setFormSent(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* En-tête */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold gradient-text mb-6">
            {t.events.title}
          </h1>
          <p className="text-2xl text-gray-600">
            {t.events.subtitle}
          </p>
        </div>

        {/* À venir / Upcoming */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
            <i className="fas fa-calendar-plus text-orange-500 mr-4"></i>
            {t.events.upcoming}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {upcomingEvents.map((event, index) => (
              <div key={event.key || event.id || index} className="card-hover bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="relative h-48 sm:h-56 overflow-hidden bg-gradient-to-r from-orange-500 to-green-500">
                  {event.image && (event.image.startsWith('/img/') || event.image.startsWith('data:image/')) ? (
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-full object-cover"
                      onLoad={() => console.log('Image chargée avec succès:', event.image)}
                      onError={(e) => {
                        console.error('Erreur de chargement de l\'image:', event.image);
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className={`absolute inset-0 flex flex-col items-center justify-center ${event.image && (event.image.startsWith('/img/') || event.image.startsWith('data:image/')) ? 'bg-gradient-to-r from-orange-500/80 to-green-500/80' : 'bg-gradient-to-r from-orange-500 to-green-500'}`}
                    style={{display: event.image && (event.image.startsWith('/img/') || event.image.startsWith('data:image/')) ? 'none' : 'flex'}}
                  >
                    <div className="text-6xl mb-2">{event.image || '🎉'}</div>
                  <div className="text-white font-bold text-lg">{event.price}</div>
                  </div>
                  {/* Overlay pour le prix quand il y a une image */}
                  {event.image && (event.image.startsWith('/img/') || event.image.startsWith('data:image/')) && (
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {event.price}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{event.title}</h3>
                  <div className="space-y-2 mb-4">
                    {event.date && (
                    <div className="flex items-center text-gray-600">
                      <i className="fas fa-calendar text-orange-500 w-5"></i>
                      <span className="ml-2">{event.date}</span>
                    </div>
                    )}
                    {event.time && (
                    <div className="flex items-center text-gray-600">
                      <i className="fas fa-clock text-green-500 w-5"></i>
                      <span className="ml-2">{event.time}</span>
                    </div>
                    )}
                    {event.location && (
                    <div className="flex items-center text-gray-600">
                      <i className="fas fa-map-marker-alt text-blue-500 w-5"></i>
                      <span className="ml-2">{event.location}</span>
                    </div>
                    )}
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">{event.description}</p>
                  <button
                    onClick={() => openForm(event.title)}
                    className="w-full bg-gradient-to-r from-orange-500 to-green-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    <i className="fas fa-ticket-alt mr-2"></i>
                    {t.events.register}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Passés / Past */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
            <i className="fas fa-history text-green-500 mr-4"></i>
            {t.events.past}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {pastEvents.map((event, index) => (
              <div key={event.key || event.id || index} className="card-hover bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="relative h-48 overflow-hidden bg-gradient-to-r from-orange-500 to-green-500">
                  {event.image && (event.image.startsWith('/img/') || event.image.startsWith('data:image/')) ? (
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-4xl">{event.image || '🎉'}</div>
                    </div>
                  )}
                </div>
                <div className="p-6 text-center">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-2">{event.date}</p>
                {event.participants && (
                    <p className="text-orange-600 font-semibold mb-4">{event.participants}</p>
                )}
                {event.description && (
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{event.description}</p>
                )}
                  
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Modal d'inscription --- */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4" role="dialog" aria-modal="true">
          {/* Fond */}
          <button className="absolute inset-0 bg-black/50" onClick={closeForm} aria-label={t.events.form.close} />

          {/* Boîte */}
          <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* En-tête */}
            <div className="bg-gradient-to-r from-orange-500 to-green-500 p-6 text-white">
              <h3 className="text-2xl font-bold">{t.events.form.title}</h3>
              {formData.eventName && (
                <p className="mt-1 opacity-90">
                  {t.events.form.eventName}: <span className="font-semibold">{formData.eventName}</span>
                </p>
              )}
            </div>

            {/* Contenu */}
            <div className="p-6 space-y-6">
              {formSent ? (
                <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl">
                  <i className="fas fa-check-circle mr-2"></i>
                  {t.events.form.success}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">{t.events.form.firstName}</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData((p) => ({ ...p, firstName: e.target.value }))}
                        required
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-1">{t.events.form.lastName}</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData((p) => ({ ...p, lastName: e.target.value }))}
                        required
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-1">{t.events.form.eventName}</label>
                    <input
                      type="text"
                      value={formData.eventName}
                      onChange={(e) => setFormData((p) => ({ ...p, eventName: e.target.value }))}
                      required
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <div className="font-semibold mb-1">
                      <i className="fas fa-wallet mr-2 text-orange-600"></i>
                      {t.events.form.paymentTitle}
                    </div>
                    <p className="text-gray-700">
                      {t.events.form.paymentDesc}{" "}
                      <span className="font-semibold">{t.events.form.paymentNumber}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-orange-500 to-green-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      {t.events.form.submit}
                    </button>
                    <button
                      type="button"
                      onClick={closeForm}
                      className="px-4 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      {t.events.form.cancel}
                    </button>
                  </div>
                </form>
              )}

              {formSent && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="px-4 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    {t.events.form.close}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Evenements;
