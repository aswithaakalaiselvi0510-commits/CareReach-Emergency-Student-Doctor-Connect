// CareReach Progressive Web App Service Worker
// Version: carereach-offline-v2

const STATIC_CACHE_NAME = 'carereach-static-v2';
const DATA_CACHE_NAME = 'carereach-medical-data-v2';

const ESSENTIAL_ROUTES_AND_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline-emergency-data.json',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
  '/safety',
  '/how-it-works',
  '/student/dashboard',
  '/student/emergency-contacts',
  '/student/clinics'
];

// Precache essential routes and emergency data on install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Precaching essential app routes and emergency contacts');
      return cache.addAll(ESSENTIAL_ROUTES_AND_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Purge obsolete caches on activation
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== STATIC_CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log('[ServiceWorker] Removing legacy cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event handler with offline emergency resilience
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // 1. Emergency Medical API Calls: Network-First with Cache Fallback
  if (
    requestUrl.pathname === '/api/facilities' ||
    requestUrl.pathname === '/api/triage/emergency-criteria' ||
    requestUrl.pathname === '/offline-emergency-data.json'
  ) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(DATA_CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          console.log('[ServiceWorker] Network failure: serving cached emergency medical data for:', requestUrl.pathname);
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            // Fallback to offline emergency data bundle
            return caches.match('/offline-emergency-data.json');
          });
        })
    );
    return;
  }

  // 2. HTML Navigation Requests (SPA routing)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(STATIC_CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          console.log('[ServiceWorker] Offline navigation: serving cached route or SPA index.html for:', requestUrl.pathname);
          return caches.match(event.request).then((cachedMatch) => {
            return cachedMatch || caches.match('/index.html') || caches.match('/');
          });
        })
    );
    return;
  }

  // 3. Static Assets: Cache-First with Network Revalidation
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch in background to update cache (stale-while-revalidate)
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
              caches.open(STATIC_CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse);
              });
            }
          })
          .catch(() => {
            // Non-fatal if offline
          });
        return cachedResponse;
      }

      // If not in cache, fetch from network and store in cache
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(STATIC_CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Fallback for missing offline image or asset
        return null;
      });
    })
  );
});
