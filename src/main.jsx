import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registrado correctamente: ', registration.scope);
      })
      .catch((registrationError) => {
        console.log('Error registrando SW: ', registrationError);
      });
  });
}

// Manejar el prompt de instalación (para mostrar botón personalizado)
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  // Previene que se muestre el prompt por defecto
  e.preventDefault();
  deferredPrompt = e;
  // Dispatch event para que la app pueda mostrar un botón de instalar
  window.dispatchEvent(new CustomEvent('pwa-install-available', { detail: {} }));
});

// Exponer una función para mostrar el prompt desde la UI
window.showPwaInstallPrompt = async () => {
  if (!deferredPrompt) return false;
  deferredPrompt.prompt();
  const choiceResult = await deferredPrompt.userChoice;
  deferredPrompt = null;
  return choiceResult.outcome === 'accepted';
};
