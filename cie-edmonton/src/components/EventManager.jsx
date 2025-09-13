import React, { useState, useEffect } from 'react';
import { dataManager } from '../utils/dataManager';
import CloudinaryService from '../utils/cloudinaryService';

const EventManager = ({ onClose }) => {
  const [events, setEvents] = useState({ upcoming: [], past: [] });
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    price: '',
    image: '🎉',
    imageFile: null
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  // Fonction pour déterminer la catégorie de l'événement selon la date
  const getEventCategory = (date) => {
    if (!date) return null;
    const eventDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate >= today ? 'upcoming' : 'past';
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    const upcoming = dataManager.getEvents('upcoming');
    const past = dataManager.getEvents('past');
    setEvents({ upcoming, past });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide (JPG, PNG, GIF, etc.)');
      return;
    }

    // Valider la taille du fichier
    const validation = CloudinaryService.validateFileSize(file, 10); // 10MB max
    if (!validation.valid) {
      alert(`L'image est trop volumineuse (${validation.sizeMB}MB). Taille maximum: 10MB`);
      return;
    }

    setUploadingImage(true);
    setUploadStatus('Upload de l\'image...');

    try {
      const uploadResult = await CloudinaryService.uploadImage(file, {
        folder: 'cice-edmonton/events',
        uploadPreset: 'cice_edmonton',
        width: 400,
        height: 300,
        crop: 'fill'
      });

      if (uploadResult.success) {
        setFormData({
          ...formData,
          image: uploadResult.data.secure_url,
          imageFile: file
        });
        setUploadStatus('✅ Image uploadée avec succès !');
      } else {
        alert(`Erreur lors de l'upload: ${uploadResult.error}`);
        setUploadStatus('❌ Erreur lors de l\'upload');
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      alert('Erreur lors de l\'upload de l\'image');
      setUploadStatus('❌ Erreur lors de l\'upload');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = (e, eventType) => {
    e.preventDefault();
    
    // Préparer les données de l'événement
    const eventData = { ...formData };
    delete eventData.imageFile; // Ne pas sauvegarder le fichier, juste l'URL
    
    if (editingEvent) {
      // Modifier un événement existant
      dataManager.updateEvent(editingEvent.id, eventData, editingEvent.type);
    } else {
      // Ajouter l'événement dans la catégorie spécifiée
      dataManager.addEvent(eventData, eventType);
    }
    
    loadEvents();
    resetForm();
  };

  const handleEdit = (event, type) => {
    setEditingEvent({ ...event, type });
    setFormData({
      title: event.title || '',
      date: event.date || '',
      time: event.time || '',
      location: event.location || '',
      description: event.description || '',
      price: event.price || '',
      image: event.image || '🎉',
      imageFile: null
    });
    setShowForm(true);
  };

  const handleDelete = (eventId, type) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      dataManager.deleteEvent(eventId, type);
      loadEvents();
    }
  };

  const handleMoveToPast = (eventId) => {
    if (window.confirm('Déplacer cet événement vers les événements passés ?')) {
      dataManager.moveEventToPast(eventId);
      loadEvents();
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      time: '',
      location: '',
      description: '',
      price: '',
      image: '🎉',
      imageFile: null
    });
    setEditingEvent(null);
    setShowForm(false);
  };

  const EventCard = ({ event, type }) => (
    <div className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            {event.image && (event.image.startsWith('data:image/') || event.image.startsWith('/img/')) ? (
              <img 
                src={event.image} 
                alt={event.title}
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) => {
                  console.error('Erreur d\'affichage de l\'image:', event.image.substring(0, 50) + '...');
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'inline';
                }}
              />
            ) : null}
            <span className="text-2xl" style={{display: event.image && (event.image.startsWith('data:image/') || event.image.startsWith('/img/')) ? 'none' : 'inline'}}>
              {event.image || '🎉'}
            </span>
            <h4 className="font-semibold text-gray-800">{event.title}</h4>
          </div>
          <div className="space-y-1 text-sm text-gray-600">
            {event.date && <p><i className="fas fa-calendar mr-2"></i>{event.date}</p>}
            {event.time && <p><i className="fas fa-clock mr-2"></i>{event.time}</p>}
            {event.location && <p><i className="fas fa-map-marker-alt mr-2"></i>{event.location}</p>}
            {event.price && <p><i className="fas fa-dollar-sign mr-2"></i>{event.price}</p>}
            {event.participants && <p><i className="fas fa-users mr-2"></i>{event.participants}</p>}
          </div>
          {event.description && (
            <p className="text-sm text-gray-500 mt-2 line-clamp-2">{event.description}</p>
          )}
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => handleEdit(event, type)}
            className="text-blue-500 hover:text-blue-700 p-1"
            title="Modifier"
          >
            <i className="fas fa-edit"></i>
          </button>
          {type === 'upcoming' && (
            <button
              onClick={() => handleMoveToPast(event.id)}
              className="text-yellow-500 hover:text-yellow-700 p-1"
              title="Déplacer vers passé"
            >
              <i className="fas fa-history"></i>
            </button>
          )}
          <button
            onClick={() => handleDelete(event.id, type)}
            className="text-red-500 hover:text-red-700 p-1"
            title="Supprimer"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  );

  if (showForm) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-800">
                {editingEvent ? 'Modifier l\'événement' : 'Ajouter un événement'}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
          </div>

          <form className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heure
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lieu
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix
                </label>
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="Ex: Gratuit, 15$ CAD"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image de l'événement
                </label>
                <div className="space-y-4">
                  {/* Upload d'image */}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="eventImageUpload"
                    />
                    <label
                      htmlFor="eventImageUpload"
                      className="inline-block bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 cursor-pointer"
                    >
                      <i className="fas fa-upload mr-2"></i>
                      Choisir une photo
                    </label>
                  </div>
                  
                  {/* Statut d'upload */}
                  {uploadingImage && (
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-spinner fa-spin text-blue-500"></i>
                        <span className="text-sm text-blue-700">{uploadStatus}</span>
                      </div>
                    </div>
                  )}

                  {/* Aperçu de l'image */}
                  {formData.image && (formData.image.startsWith('data:') || formData.image.startsWith('https://')) && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-2">Aperçu :</p>
                      <img
                        src={formData.image}
                        alt="Aperçu"
                        className="w-16 h-16 rounded-lg object-cover border border-gray-300"
                      />
                      {uploadStatus && !uploadingImage && (
                        <p className="text-xs text-green-600 mt-1">{uploadStatus}</p>
                      )}
                    </div>
                  )}
                  
                  {/* Champ emoji/texte en fallback */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Ou utilisez un emoji/texte :
                    </label>
                    <input
                      type="text"
                      value={formData.image.startsWith('data:') ? '' : formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      placeholder="🎉"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              
              {editingEvent ? (
                <button
                  onClick={(e) => handleSubmit(e, editingEvent.type)}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center space-x-2"
                >
                  <i className="fas fa-save"></i>
                  <span>Modifier l'événement</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={(e) => handleSubmit(e, 'upcoming')}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center space-x-2"
                  >
                    <i className="fas fa-plus"></i>
                    <span>Valider et ajouter dans les événements à venir</span>
                  </button>
                  <button
                    onClick={(e) => handleSubmit(e, 'past')}
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center space-x-2"
                  >
                    <i className="fas fa-history"></i>
                    <span>Valider et ajouter dans les événements passés</span>
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          <i className="fas fa-calendar-plus mr-3 text-orange-500"></i>
          Gestion des Événements
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center space-x-2"
        >
          <i className="fas fa-plus"></i>
          <span>Ajouter un événement</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Événements à venir */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <i className="fas fa-clock mr-2 text-green-500"></i>
            Événements à venir ({events.upcoming.length})
          </h3>
          <div className="space-y-4">
            {events.upcoming.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Aucun événement à venir</p>
            ) : (
              events.upcoming.map(event => (
                <EventCard key={event.id} event={event} type="upcoming" />
              ))
            )}
          </div>
        </div>

        {/* Événements passés */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <i className="fas fa-history mr-2 text-gray-500"></i>
            Événements passés ({events.past.length})
          </h3>
          <div className="space-y-4">
            {events.past.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Aucun événement passé</p>
            ) : (
              events.past.map(event => (
                <EventCard key={event.id} event={event} type="past" />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventManager;
