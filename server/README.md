# Server de ejemplo para Push (tarea-pwa)

Este servidor de ejemplo usa `express` y `web-push` para demostrar cómo enviar notificaciones push a suscripciones web push.

Instrucciones rápidas:

1. Instalar dependencias

```powershell
cd server
npm install
```

2. Ejecutar (genera claves VAPID temporales si no defines variables de entorno)

```powershell
npm start
```

Al arrancar verás en consola las VAPID keys generadas (temporalmente). Para producción genera y guarda tus claves y exporta las variables `VAPID_PUBLIC_KEY` y `VAPID_PRIVATE_KEY`.

3. Endpoints

- GET /vapidPublicKey -> devuelve { publicKey }
- POST /subscribe -> recibe la suscripción (JSON) desde el cliente y la guarda en memoria
- POST /sendNotification -> enviar una notificación a todas las suscripciones guardadas. Body: { title, body, url }

Ejemplo de envío con curl:

```powershell
curl -X POST http://localhost:4000/sendNotification -H "Content-Type: application/json" -d "{\"title\":\"Prueba\",\"body\":\"Hola desde server\",\"url\":\"/\"}"
```

Nota: Esto es un servidor de ejemplo para desarrollo. En producción debes persistir suscripciones y manejar errores/limpieza de suscripciones inválidas, proteger los endpoints y usar HTTPS.
