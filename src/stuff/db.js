/**
 * IndexedDB helper for PlayVer Music Station
 * Stores user-uploaded custom audio tracks permanently on client device
 * Uses pure Promises (no regeneratorRuntime dependency)
 */

const DB_NAME = 'PlayVerMusicDB';
const DB_VERSION = 1;
const STORE_NAME = 'custom_tracks';

export function openAudioDB() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('dateAdded', 'dateAdded', { unique: false });
      }
    };

    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
}

export function getCustomTracks() {
  return openAudioDB().then((db) => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();

      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }).catch((err) => {
    console.warn('IndexedDB getCustomTracks error:', err);
    return [];
  });
}

export function saveCustomTrack(file) {
  return openAudioDB().then((db) => {
    const trackId = 'custom_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    const cleanName = file.name.replace(/\.[^/.]+$/, '').trim();

    const trackRecord = {
      id: trackId,
      name: cleanName || 'Безымянный трек',
      blob: file,
      size: file.size,
      type: file.type || 'audio/mpeg',
      dateAdded: Date.now(),
      isCustom: true
    };

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(trackRecord);

      req.onsuccess = () => resolve(trackRecord);
      req.onerror = () => reject(req.error);
    });
  });
}

export function deleteCustomTrack(id) {
  return openAudioDB().then((db) => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);

      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  }).catch((err) => {
    console.warn('IndexedDB deleteCustomTrack error:', err);
    return false;
  });
}

export function clearAllCustomTracks() {
  return openAudioDB().then((db) => {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.clear();

      req.onsuccess = () => resolve(true);
      req.onerror = () => reject(req.error);
    });
  }).catch((err) => {
    console.warn('IndexedDB clearAllCustomTracks error:', err);
    return false;
  });
}
