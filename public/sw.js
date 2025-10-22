const CACHE_NAME = 'tarea-pwa-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo192.png',
  '/offline.html'
];

// Instalación - cachear todos los recursos esenciales
self.addEventListener('install', (event) => {
  console.log('Service Worker instalándose...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache abierto');
        // Intentar cachear todos los recursos listados. Algunos pueden fallar en dev, así que usamos Promise.allSettled
        return Promise.allSettled(urlsToCache.map(u => cache.add(u))).then(() => {});
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
  // Para navegación (requests de página), intentar network-first, fallback a cache y luego offline.html
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Actualizar cache con la nueva respuesta
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then(cached => cached || caches.match('/offline.html'));
        })
    );
    return;
  }

  // Para otros recursos: cache-first
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request)
          .then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
            return response;
          })
          .catch(() => {
            // Si no está en cache y la petición falla, devolver offline.html para navegación ya manejado; aquí solo retornamos undefined
            return undefined;
          });
      })
  );
});

// Manejar evento push (cuando se envíe una push desde un servidor)
self.addEventListener('push', function(event) {
  console.log('Push recibido');
  let data = { title: 'Nueva notificación', body: 'Tienes una actualización', url: '/' };
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'Notificación', body: event.data.text() };
    }
  }

  const options = {
    body: data.body,
    icon: '/logo192.png',
    badge: '/favicon.ico',
    data: { url: data.url }
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Manejar click sobre la notificación
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const openUrl = event.notification.data && event.notification.data.url ? event.notification.data.url : '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      // Si ya hay una ventana abierta, enfocarla
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === openUrl && 'focus' in client) {
          return client.focus();
        }
      }
      // Si no, abrir una nueva
      if (clients.openWindow) {
        return clients.openWindow(openUrl);
      }
    })
  );
});