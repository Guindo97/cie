// Gestionnaire de données local pour l'administration
import indexedDBManager from './indexedDBManager.js';

export class DataManager {
  constructor() {
    this.storageKey = 'cie_edmonton_data';
    this.defaultData = {
      events: {
        upcoming: [],
        past: []
      },
      gallery: {
        images: []
      }
    };
    this.useIndexedDB = true;
    this.indexedDBReady = false;
    this.initIndexedDB();
  }

  // Initialiser IndexedDB
  async initIndexedDB() {
    try {
      await indexedDBManager.init();
      this.indexedDBReady = true;
      console.log('IndexedDB prêt pour le stockage');
    } catch (error) {
      console.warn('IndexedDB non disponible, utilisation de localStorage:', error);
      this.useIndexedDB = false;
    }
  }

  // Initialiser les données
  init() {
    const existingData = localStorage.getItem(this.storageKey);
    if (!existingData) {
      this.saveData(this.defaultData);
    }
  }

  // Initialiser les événements statiques dans le localStorage
  initStaticEvents(staticEvents) {
    const data = this.loadData();
    let hasChanges = false;

    // Ajouter les événements statiques s'ils n'existent pas
    staticEvents.forEach(staticEvent => {
      const existingEvent = data.events.past.find(event => 
        event.key === staticEvent.key || event.id === staticEvent.key
      );
      
      if (!existingEvent) {
        data.events.past.unshift({
          ...staticEvent,
          media: []
        });
        hasChanges = true;
      } else if (!existingEvent.media) {
        // Si l'événement existe mais n'a pas de propriété media, l'ajouter
        existingEvent.media = [];
        hasChanges = true;
      }
    });

    if (hasChanges) {
      this.saveData(data);
    }
  }

  // Charger les données
  loadData() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : this.defaultData;
  }

  // Sauvegarder les données avec gestion d'erreur de quota et stockage par chunks
  saveData(data) {
    try {
      // Essayer de sauvegarder normalement
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      return true;
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.warn('Quota de localStorage dépassé. Tentative de sauvegarde par chunks...');
        
        try {
          // Sauvegarder par chunks (morceaux)
          this.saveDataByChunks(data);
          return true;
        } catch (chunkError) {
          console.warn('Sauvegarde par chunks échouée. Tentative de nettoyage...');
          this.cleanupOldData();
          
          // Réessayer après nettoyage
          try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            return true;
          } catch (retryError) {
            console.error('Impossible de sauvegarder après nettoyage:', retryError);
            alert('Espace de stockage insuffisant. Veuillez supprimer des médias anciens ou recharger la page.');
            return false;
          }
        }
      } else {
        console.error('Erreur de sauvegarde:', error);
        throw error;
      }
    }
  }

  // Sauvegarder les données par chunks pour éviter les erreurs de quota
  saveDataByChunks(data) {
    // Séparer les médias volumineux des autres données
    const { events, gallery } = data;
    const baseData = { events: {}, gallery: [] };
    
    // Sauvegarder d'abord la structure de base
    Object.keys(events).forEach(eventId => {
      baseData.events[eventId] = {
        ...events[eventId],
        media: [] // Médias vides pour l'instant
      };
    });
    
    localStorage.setItem(this.storageKey, JSON.stringify(baseData));
    
    // Sauvegarder les médias par chunks
    Object.keys(events).forEach(eventId => {
      if (events[eventId].media && events[eventId].media.length > 0) {
        this.saveMediaByChunks(eventId, events[eventId].media);
      }
    });
  }

  // Sauvegarder les médias d'un événement par chunks
  saveMediaByChunks(eventId, mediaArray) {
    const chunkSize = 3; // 3 médias par chunk
    const chunks = [];
    
    for (let i = 0; i < mediaArray.length; i += chunkSize) {
      chunks.push(mediaArray.slice(i, i + chunkSize));
    }
    
    // Sauvegarder chaque chunk
    chunks.forEach((chunk, index) => {
      const chunkKey = `${this.storageKey}_${eventId}_chunk_${index}`;
      try {
        localStorage.setItem(chunkKey, JSON.stringify(chunk));
      } catch (error) {
        console.warn(`Impossible de sauvegarder le chunk ${index} pour ${eventId}:`, error);
      }
    });
    
    // Marquer le nombre de chunks
    localStorage.setItem(`${this.storageKey}_${eventId}_chunks`, chunks.length.toString());
  }

  // Charger les médias depuis les chunks
  loadMediaFromChunks(eventId) {
    const chunksCount = localStorage.getItem(`${this.storageKey}_${eventId}_chunks`);
    if (!chunksCount) return [];
    
    const media = [];
    for (let i = 0; i < parseInt(chunksCount); i++) {
      const chunkKey = `${this.storageKey}_${eventId}_chunk_${i}`;
      const chunk = localStorage.getItem(chunkKey);
      if (chunk) {
        try {
          media.push(...JSON.parse(chunk));
        } catch (error) {
          console.warn(`Erreur lors du chargement du chunk ${i} pour ${eventId}:`, error);
        }
      }
    }
    
    return media;
  }

  // Nettoyer les anciennes données pour libérer de l'espace
  cleanupOldData() {
    const data = this.loadData();
    let totalRemoved = 0;
    
    // Supprimer les médias les plus anciens (garder seulement les 15 plus récents par événement)
    Object.keys(data.events).forEach(eventId => {
      if (data.events[eventId].media && data.events[eventId].media.length > 15) {
        const originalCount = data.events[eventId].media.length;
        data.events[eventId].media = data.events[eventId].media
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .slice(0, 15);
        totalRemoved += originalCount - 15;
      }
    });
    
    // Sauvegarder les données nettoyées
    localStorage.setItem(this.storageKey, JSON.stringify(data));
    
    console.log(`Nettoyage effectué : ${totalRemoved} médias supprimés`);
    return totalRemoved;
  }

  // === GESTION DES ÉVÉNEMENTS ===

  // Ajouter un événement
  addEvent(event, type = 'upcoming') {
    const data = this.loadData();
    const newEvent = {
      ...event,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    data.events[type].unshift(newEvent);
    this.saveData(data);
    return newEvent;
  }

  // Modifier un événement
  updateEvent(eventId, updates, type = 'upcoming') {
    const data = this.loadData();
    const eventIndex = data.events[type].findIndex(event => event.id === eventId);
    
    if (eventIndex !== -1) {
      data.events[type][eventIndex] = {
        ...data.events[type][eventIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveData(data);
      return data.events[type][eventIndex];
    }
    return null;
  }

  // Supprimer un événement
  deleteEvent(eventId, type = 'upcoming') {
    const data = this.loadData();
    data.events[type] = data.events[type].filter(event => event.id !== eventId);
    this.saveData(data);
    return true;
  }

  // Obtenir tous les événements
  getEvents(type = 'upcoming') {
    const data = this.loadData();
    return data.events[type] || [];
  }

  // Déplacer un événement d'upcoming vers past
  moveEventToPast(eventId) {
    const data = this.loadData();
    const eventIndex = data.events.upcoming.findIndex(event => event.id === eventId);
    
    if (eventIndex !== -1) {
      const event = data.events.upcoming[eventIndex];
      event.movedToPastAt = new Date().toISOString();
      
      data.events.past.unshift(event);
      data.events.upcoming.splice(eventIndex, 1);
      
      this.saveData(data);
      return event;
    }
    return null;
  }

  // === GESTION DE LA GALERIE ===

  // Ajouter une image
  addImage(imageData) {
    const data = this.loadData();
    const newImage = {
      ...imageData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    data.gallery.images.unshift(newImage);
    this.saveData(data);
    return newImage;
  }

  // Ajouter une photo/vidéo à un événement
  async addEventMedia(eventId, mediaData, eventType = 'past') {
    // Utiliser IndexedDB si disponible
    if (this.useIndexedDB && this.indexedDBReady) {
      try {
        // Sauvegarder le média dans IndexedDB
        const newMedia = await indexedDBManager.saveMedia(mediaData, eventId, eventType);
        
        // Nettoyer les anciens médias si nécessaire (limite augmentée)
        await indexedDBManager.cleanupOldMedia(20);
        
        return newMedia;
      } catch (error) {
        console.error('Erreur IndexedDB, bascule vers localStorage:', error);
        this.useIndexedDB = false;
      }
    }
    
    // Fallback vers localStorage
    const data = this.loadData();
    
    // Si l'événement n'existe pas dans le localStorage, le créer
    let eventIndex = data.events[eventType].findIndex(event => 
      event.id === eventId || event.key === eventId
    );
    
    if (eventIndex === -1) {
      // Créer un nouvel événement pour les événements statiques
      const newEvent = {
        key: eventId,
        title: `Événement ${eventId}`,
        media: []
      };
      data.events[eventType].unshift(newEvent);
      eventIndex = 0;
    }
    
    if (!data.events[eventType][eventIndex].media) {
      data.events[eventType][eventIndex].media = [];
    }
    
    const newMedia = {
      ...mediaData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    data.events[eventType][eventIndex].media.unshift(newMedia);
    
    // Essayer de sauvegarder normalement d'abord
    const saved = this.saveData(data);
    
    if (!saved) {
      console.log('Sauvegarde normale échouée, sauvegarde par chunks...');
      // Sauvegarder seulement les médias par chunks
      this.saveMediaByChunks(eventId, data.events[eventType][eventIndex].media);
      // Sauvegarder la structure sans les médias
      const dataWithoutMedia = JSON.parse(JSON.stringify(data));
      dataWithoutMedia.events[eventType][eventIndex].media = [];
      this.saveData(dataWithoutMedia);
    }
    
    return newMedia;
  }

  // Obtenir les médias d'un événement
  async getEventMedia(eventId, eventType = 'past') {
    // Utiliser IndexedDB si disponible
    if (this.useIndexedDB && this.indexedDBReady) {
      try {
        return await indexedDBManager.getEventMedia(eventId, eventType);
      } catch (error) {
        console.error('Erreur IndexedDB, bascule vers localStorage:', error);
        this.useIndexedDB = false;
      }
    }
    
    // Fallback vers localStorage
    const data = this.loadData();
    // Chercher par id ou par key
    const event = data.events[eventType].find(event => 
      event.id === eventId || event.key === eventId
    );
    
    if (event) {
      // Vérifier s'il y a des médias dans les chunks
      const chunkedMedia = this.loadMediaFromChunks(eventId);
      if (chunkedMedia.length > 0) {
        return chunkedMedia;
      }
      
      // Sinon, retourner les médias normaux
      return event.media || [];
    }
    
    // Si l'événement n'existe pas, retourner un tableau vide
    console.log(`Événement ${eventId} non trouvé dans ${eventType}`);
    return [];
  }

  // Supprimer un média d'un événement
  async deleteEventMedia(eventId, mediaId, eventType = 'past') {
    // Utiliser IndexedDB si disponible
    if (this.useIndexedDB && this.indexedDBReady) {
      try {
        await indexedDBManager.deleteMedia(mediaId);
        console.log('Média supprimé de IndexedDB:', mediaId);
        return true;
      } catch (error) {
        console.error('Erreur IndexedDB lors de la suppression, bascule vers localStorage:', error);
        this.useIndexedDB = false;
      }
    }
    
    // Fallback vers localStorage
    const data = this.loadData();
    // Chercher par id ou par key
    const eventIndex = data.events[eventType].findIndex(event => 
      event.id === eventId || event.key === eventId
    );
    
    if (eventIndex !== -1 && data.events[eventType][eventIndex].media) {
      data.events[eventType][eventIndex].media = data.events[eventType][eventIndex].media.filter(media => media.id !== mediaId);
      this.saveData(data);
      return true;
    }
    return false;
  }

  // Modifier une image
  updateImage(imageId, updates) {
    const data = this.loadData();
    const imageIndex = data.gallery.images.findIndex(image => image.id === imageId);
    
    if (imageIndex !== -1) {
      data.gallery.images[imageIndex] = {
        ...data.gallery.images[imageIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveData(data);
      return data.gallery.images[imageIndex];
    }
    return null;
  }

  // Supprimer une image
  deleteImage(imageId) {
    const data = this.loadData();
    data.gallery.images = data.gallery.images.filter(image => image.id !== imageId);
    this.saveData(data);
    return true;
  }

  // Obtenir toutes les images
  getImages() {
    const data = this.loadData();
    return data.gallery.images || [];
  }

  // === UTILITAIRES ===

  // Exporter les données (backup)
  exportData() {
    const data = this.loadData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cie_edmonton_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Importer les données (restore)
  importData(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          this.saveData(data);
          resolve(data);
        } catch (error) {
          reject(new Error('Fichier de données invalide'));
        }
      };
      reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'));
      reader.readAsText(file);
    });
  }

  // Réinitialiser les données
  resetData() {
    this.saveData(this.defaultData);
  }

  // Vider seulement les événements
  clearEvents() {
    const data = this.loadData();
    data.events = {
      upcoming: [],
      past: []
    };
    this.saveData(data);
  }

  // Nettoyer les doublons d'événements
  cleanDuplicates() {
    const data = this.loadData();
    let hasChanges = false;

    // Nettoyer les événements passés
    const seenKeys = new Set();
    const cleanedPast = data.events.past.filter(event => {
      const key = event.key || event.id;
      if (seenKeys.has(key)) {
        hasChanges = true;
        return false; // Supprimer le doublon
      }
      seenKeys.add(key);
      return true;
    });

    if (hasChanges) {
      data.events.past = cleanedPast;
      this.saveData(data);
    }

    return hasChanges;
  }

  // Obtenir les statistiques
  getStats() {
    const data = this.loadData();
    return {
      totalEvents: data.events.upcoming.length + data.events.past.length,
      upcomingEvents: data.events.upcoming.length,
      pastEvents: data.events.past.length,
      totalImages: data.gallery.images.length,
      lastUpdate: new Date().toISOString()
    };
  }
}

// Instance singleton
export const dataManager = new DataManager();

// Initialiser au chargement
dataManager.init();
