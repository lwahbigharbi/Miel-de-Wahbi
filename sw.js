const CACHE_NAME = 'miel-wahbi-v2';
const urlsToCache = [
  '/',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/images/eucalyptus.jpg',
  '/images/thym.jpg',
  '/images/fleurs.jpg',
  '/images/agrumes.jpg'
];

// INSTALL - Cache tout
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// FETCH - Ultra rapide + Offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => caches.match('/offline.html'))
  );
});

// ACTIVATE - Nettoyage ancien cache
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => 
      Promise.all(
        cacheNames.map(cache => 
          cache !== CACHE_NAME && caches.delete(cache)
        )
      )
    )
  );
  return self.clients.claim();
});

// PUSH NOTIFICATIONS (futur)
self.addEventListener('push', event => {
  const options = {
    body: event.data.text(),
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-72.png',
    vibrate: [100, 50, 100]
  };
  event.waitUntil(self.registration.showNotification('🆕 Nouvelle promo miel !', options));
});
