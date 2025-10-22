# PWA - cómo probar offline e push

Guía rápida para probar la aplicación `tarea-pwa` localmente con notificaciones push y soporte offline.

Requisitos
- Node.js (>=16 recomendado)

1) Instalación y ejecución del servidor de ejemplo para Push

```powershell
cd server
npm install
npm start
```

El servidor arranca en `http://localhost:4000` y expone:
- `GET /vapidPublicKey` -> devuelve la VAPID public key (JSON)
- `POST /subscribe` -> recibe y guarda la suscripción
- `POST /sendNotification` -> envía notificación a todas las suscripciones guardadas

2) Ejecutar la app (cliente)

```powershell
# en la raíz del proyecto
npm install
npm run dev
```

Nota: Para que Service Workers y Push funcionen en producción se requiere HTTPS. En localhost funciona en Chrome como `http://localhost:5173` (Vite) sin HTTPS.

3) Probar Push
- En la app, haz clic en "Suscribirse a Push (experimental)". Esto pedirá permiso y luego enviará la suscripción al servidor (`/subscribe`).
- En el servidor, después de que una suscripción esté guardada, ejecuta:

```powershell
curl -X POST http://localhost:4000/sendNotification -H "Content-Type: application/json" -d "{\"title\":\"Prueba\",\"body\":\"Hola desde server\",\"url\":\"/\"}"
```

- Si todo está bien, el navegador recibirá una push y el Service Worker mostrará la notificación.

4) Probar instalación PWA
- Abre la app en Chrome para Android o en desktop en Chrome (DevTools > Application > Manifest). Cuando el evento `beforeinstallprompt` ocurra, verás el botón "Instalar app" en la UI. En Android se mostrará la opción estándar.

5) Notas
- El servidor de ejemplo genera claves VAPID al inicio si no se dan por variables de entorno. Para producción debes generar y guardar estas claves y configurar `VAPID_PUBLIC_KEY` y `VAPID_PRIVATE_KEY`.
- Las suscripciones se guardan en memoria; reiniciar el servidor las borra.

Si quieres puedo:
- Añadir scripts para generar certificados locales y servir la app con HTTPS para probar en dispositivos reales.
- Proveer un ejemplo de backend que persista suscripciones en archivo o BD.
