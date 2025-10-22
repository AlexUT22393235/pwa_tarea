const express = require('express');
const bodyParser = require('body-parser');
const webpush = require('web-push');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Generar claves VAPID si no están definidas en env
let VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || '';
let VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '';

if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
  const keys = webpush.generateVAPIDKeys();
  VAPID_PUBLIC_KEY = keys.publicKey;
  VAPID_PRIVATE_KEY = keys.privateKey;
  console.log('Se generaron VAPID keys (temporal, no persistidas):');
  console.log(keys);
}

webpush.setVapidDetails(
  'mailto:example@example.com',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

// En memoria - para ejemplo
const subscriptions = [];

app.get('/vapidPublicKey', (req, res) => {
  res.json({ publicKey: VAPID_PUBLIC_KEY });
});

app.post('/subscribe', (req, res) => {
  const sub = req.body;
  if (!sub || !sub.endpoint) {
    return res.status(400).json({ error: 'Invalid subscription' });
  }
  subscriptions.push(sub);
  console.log('Nueva suscripción guardada. Total:', subscriptions.length);
  res.json({ success: true });
});

app.post('/sendNotification', async (req, res) => {
  const { title, body, url } = req.body || { title: 'Notificación', body: 'Mensaje', url: '/' };

  const payload = JSON.stringify({ title, body, url });

  const results = [];
  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(sub, payload);
      results.push({ endpoint: sub.endpoint, status: 'sent' });
    } catch (err) {
      console.error('Error enviando a', sub.endpoint, err.message);
      results.push({ endpoint: sub.endpoint, status: 'error', message: err.message });
    }
  }

  res.json({ results });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log('Server listening on port', PORT);
  console.log('VAPID Public Key:', VAPID_PUBLIC_KEY);
});