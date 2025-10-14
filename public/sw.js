const CACHE_NAME = 'tarea-pwa-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/logo192.png'
];

// Instalación - cachear todos los recursos esenciales
self.addEventListener('install', (event) => {
  console.log('Service Worker instalándose...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Todos los recursos cacheados');
        return self.skipWaiting(); // Activar inmediatamente
      })
  );
});

// Activar y limpiar caches viejos
self.addEventListener('activate', (event) => {
  console.log('Service Worker activado');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando cache viejo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker listo para controlar clientes');
      return self.clients.claim(); // Tomar control inmediato
    })
  );
});

// Estrategia: Cache First, luego Network
self.addEventListener('fetch', (event) => {
  // Solo manejar peticiones GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Si existe en cache, devolverlo
        if (cachedResponse) {
          console.log('Servido desde cache:', event.request.url);
          return cachedResponse;
        }

        // Si no está en cache, hacer petición y cachear
        return fetch(event.request)
          .then((response) => {
            // Verificar que la respuesta sea válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clonar la respuesta para cachear
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
                console.log('Nuevo recurso cacheado:', event.request.url);
              });

            return response;
          })
          .catch((error) => {
            console.log('Error en fetch, sirviendo página offline:', error);
            // Si es una página HTML y no hay conexión, servir index.html
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
          });
      })
  );
});