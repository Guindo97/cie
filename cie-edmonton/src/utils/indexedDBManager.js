// Gestionnaire de stockage IndexedDB pour éviter les limites de localStorage
class IndexedDBManager {
  constructor() {
    this.dbName = 'CIEEdmontonDB';
    this.dbVersion = 1;
    this.db = null;
  }

  // Initialiser la base de données
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error('Erreur lors de l\'ouverture d\'IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB initialisé avec succès');
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Créer les stores
        if (!db.objectStoreNames.contains('events')) {
          const eventsStore = db.createObjectStore('events', { keyPath: 'id' });
          eventsStore.createIndex('type', 'type', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('media')) {
          const mediaStore = db.createObjectStore('media', { keyPath: 'id' });
          mediaStore.createIndex('eventId', 'eventId', { unique: false });
          mediaStore.createIndex('eventType', 'eventType', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('gallery')) {
          db.createObjectStore('gallery', { keyPath: 'id' });
        }
      };
    });
  }

  // Obtenir la base de données (initialise si nécessaire)
  async getDB() {
    if (!this.db) {
      await this.init();
    }
    return this.db;
  }

  // Sauvegarder un événement
  async saveEvent(event, type = 'past') {
    const db = await this.getDB();
    const transaction = db.transaction(['events'], 'readwrite');
    const store = transaction.objectStore('events');
    
    const eventData = {
      ...event,
      type: type,
      id: event.id || event.key || Date.now().toString(),
      lastModified: new Date().toISOString()
    };
    
    return new Promise((resolve, reject) => {
      const request = store.put(eventData);
      request.onsuccess = () => resolve(eventData);
      request.onerror = () => reject(request.error);
    });
  }

  // Obtenir tous les événements d'un type
  async getEvents(type = 'past') {
    const db = await this.getDB();
    const transaction = db.transaction(['events'], 'readonly');
    const store = transaction.objectStore('events');
    const index = store.index('type');
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(type);
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // Sauvegarder un média
  async saveMedia(mediaData, eventId, eventType = 'past') {
    const db = await this.getDB();
    const transaction = db.transaction(['media'], 'readwrite');
    const store = transaction.objectStore('media');
    
    const media = {
      ...mediaData,
      id: mediaData.id || Date.now().toString(),
      eventId: eventId,
      eventType: eventType,
      createdAt: new Date().toISOString()
    };
    
    return new Promise((resolve, reject) => {
      const request = store.put(media);
      request.onsuccess = () => resolve(media);
      request.onerror = () => reject(request.error);
    });
  }

  // Lister tous les médias pour diagnostic
  async getAllMedia() {
    const db = await this.getDB();
    const transaction = db.transaction(['media'], 'readonly');
    const store = transaction.objectStore('media');
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        console.log('🔍 IndexedDB - Tous les médias dans la base:', request.result);
        resolve(request.result || []);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Obtenir tous les médias d'un événement
  async getEventMedia(eventId, eventType = 'past') {
    const db = await this.getDB();
    const transaction = db.transaction(['media'], 'readonly');
    const store = transaction.objectStore('media');
    const index = store.index('eventId');
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(eventId);
      request.onsuccess = () => {
        console.log('🔍 IndexedDB - Recherche médias pour:', eventId, eventType);
        console.log('🔍 IndexedDB - Tous les médias trouvés:', request.result);
        
        // Filtrer par type d'événement aussi
        const media = (request.result || []).filter(m => m.eventType === eventType);
        console.log('🔍 IndexedDB - Médias filtrés par type:', media);
        
        // Si aucun média trouvé avec le type spécifié, essayer sans filtre
        if (media.length === 0 && request.result && request.result.length > 0) {
          console.log('⚠️ IndexedDB - Aucun média trouvé avec le type', eventType, ', essai sans filtre');
          const allMedia = request.result || [];
          console.log('🔍 IndexedDB - Tous les médias disponibles:', allMedia);
          // Trier par date de création (plus récent en premier)
          allMedia.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          console.log('✅ IndexedDB - Médias sans filtre:', allMedia);
          resolve(allMedia);
          return;
        }
        
        // Trier par date de création (plus récent en premier)
        media.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        console.log('✅ IndexedDB - Médias finaux:', media);
        resolve(media);
      };
      request.onerror = () => {
        console.error('❌ IndexedDB - Erreur lors de la récupération des médias:', request.error);
        reject(request.error);
      };
    });
  }

  // Supprimer un média
  async deleteMedia(mediaId) {
    const db = await this.getDB();
    const transaction = db.transaction(['media'], 'readwrite');
    const store = transaction.objectStore('media');
    
    return new Promise((resolve, reject) => {
      const request = store.delete(mediaId);
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  // Nettoyer les anciens médias (garder les N plus récents par événement)
  async cleanupOldMedia(maxMediaPerEvent = 3) {
    const db = await this.getDB();
    const transaction = db.transaction(['media'], 'readwrite');
    const store = transaction.objectStore('media');
    const index = store.index('eventId');
    
    return new Promise((resolve, reject) => {
      const request = index.getAll();
      request.onsuccess = () => {
        const allMedia = request.result || [];
        
        // Grouper par événement
        const mediaByEvent = {};
        allMedia.forEach(media => {
          const key = `${media.eventId}_${media.eventType}`;
          if (!mediaByEvent[key]) {
            mediaByEvent[key] = [];
          }
          mediaByEvent[key].push(media);
        });
        
        // Supprimer les anciens médias
        let totalRemoved = 0;
        Object.values(mediaByEvent).forEach(eventMedia => {
          if (eventMedia.length > maxMediaPerEvent) {
            // Trier par date de création (plus récent en premier)
            eventMedia.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            // Supprimer les anciens
            const toDelete = eventMedia.slice(maxMediaPerEvent);
            toDelete.forEach(media => {
              store.delete(media.id);
              totalRemoved++;
            });
          }
        });
        
        console.log(`Nettoyage IndexedDB effectué : ${totalRemoved} médias supprimés`);
        resolve(totalRemoved);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Vider complètement la base de données
  async clearAll() {
    const db = await this.getDB();
    const transaction = db.transaction(['events', 'media', 'gallery'], 'readwrite');
    
    return Promise.all([
      new Promise((resolve, reject) => {
        const request = transaction.objectStore('events').clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }),
      new Promise((resolve, reject) => {
        const request = transaction.objectStore('media').clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      }),
      new Promise((resolve, reject) => {
        const request = transaction.objectStore('gallery').clear();
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      })
    ]);
  }

  // Obtenir la taille approximative de la base de données
  async getStorageSize() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        used: estimate.usage || 0,
        available: estimate.quota || 0,
        percentage: estimate.quota ? (estimate.usage / estimate.quota * 100).toFixed(2) : 0
      };
    }
    return { used: 0, available: 0, percentage: 0 };
  }
}

// Instance singleton
const indexedDBManager = new IndexedDBManager();

export default indexedDBManager;
