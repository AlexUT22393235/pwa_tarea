import './App.css';
import CardTareas from './components/CardTareas';
import { useState, useEffect } from 'react';

function App() {
  // Cargar tareas desde localStorage (todas en un solo array)
  const [tareas, setTareas] = useState(() => {
    const saved = localStorage.getItem("tareas");
    return saved ? JSON.parse(saved) : [];
  });

  // Guardar tareas en localStorage cada vez que cambian
  useEffect(() => {
    localStorage.setItem("tareas", JSON.stringify(tareas));
  }, [tareas]);


  // const agreagar_tarea=
  const titulo_tareas = tareas.map(tarea =>
    <li className="list-none" key={tarea.id}>
      <CardTareas
        id={tarea.id}
        titulo={tarea.titulo}
        eliminarTarea={() => eliminarTarea(tarea.id)}
      />
    </li>
  );

  const guardarTarea = () => {
    const tituloIngresado = document.getElementById("tituloTarea").value;
    if (!tituloIngresado.trim()) {
      alert("Por favor, ingresa un título para la tarea");
      return;
    }
    const idTarea = crypto.randomUUID();
    const nuevaTarea = { id: idTarea, titulo: tituloIngresado };
    setTareas(prev => [...prev, nuevaTarea]);
    document.getElementById("tituloTarea").value = "";
    // Mostrar notificación informativa
    notifyLocal({ title: 'Tarea agregada', body: nuevaTarea.titulo, url: '/' });
  };

  const eliminarTarea = (id) => {
    const tarea = tareas.find(t => t.id === id);
    setTareas(prev => prev.filter(t => t.id !== id));
    notifyLocal({ title: 'Tarea eliminada', body: tarea ? tarea.titulo : 'Tarea', url: '/' });
  };

  // Solicitar permiso de notificaciones al montar
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('Permission for notifications:', permission);
      });
    }

    // Escuchar evento de disponibilidad del prompt de instalación
    const handler = () => setShowInstall(true);
    window.addEventListener('pwa-install-available', handler);
    return () => window.removeEventListener('pwa-install-available', handler);
  }, []);

  const [showInstall, setShowInstall] = useState(false);
  const [pushSubscribed, setPushSubscribed] = useState(false);

  useEffect(() => {
    // Verificar si ya hay una suscripción guardada (solo cliente)
    const s = localStorage.getItem('push_subscription');
    if (s) setPushSubscribed(true);
  }, []);

  const handleInstallClick = async () => {
    if (window.showPwaInstallPrompt) {
      const accepted = await window.showPwaInstallPrompt();
      setShowInstall(false);
      console.log('Install accepted:', accepted);
    }
  };

  // Mostrar notificación local usando ServiceWorker si está disponible, si no usar Notification API
  const notifyLocal = async ({ title, body, url = '/' }) => {
    const payload = { title, body, url };
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          registration.showNotification(title, { body, icon: '/logo192.png', data: { url } });
          return;
        }
      } catch (e) {
        console.error('Error mostrando notificación vía SW', e);
      }
    }

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/logo192.png' });
    }
  };

  // Suscribirse a Push (cliente). Requiere VAPID public key y backend para enviar mensajes.
  const subscribePush = async () => {
    if (!('serviceWorker' in navigator)) {
      alert('Service Worker no disponible en este navegador');
      return;
    }
    if (!('PushManager' in window)) {
      alert('Push no es soportado en este navegador');
      return;
    }
    try {
      const registration = await navigator.serviceWorker.ready;

      // TODO: Reemplazar por tu VAPID public key (base64 URL-safe)
      const vapidPublicKey = '<REPLACE_WITH_YOUR_VAPID_PUBLIC_KEY>';
      if (vapidPublicKey === '<REPLACE_WITH_YOUR_VAPID_PUBLIC_KEY>') {
        alert('Suscripción push: agrega tu VAPID public key en el código para completar la suscripción. Se guardará localmente para pruebas.');
      }

      const convertedVapidKey = vapidPublicKey ? urlBase64ToUint8Array(vapidPublicKey) : null;

      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey
      }).catch(err => {
        console.error('Error al suscribir push:', err);
        return null;
      });

      if (sub) {
        localStorage.setItem('push_subscription', JSON.stringify(sub));
        setPushSubscribed(true);
        console.log('Push subscription:', sub);
        alert('Suscripción push guardada en localStorage. Copia el objeto en la consola para usarlo en el servidor.');
      }
    } catch (e) {
      console.error(e);
      alert('Error al suscribir push. Revisa la consola.');
    }
  };

  // Utilidad para convertir VAPID key
  function urlBase64ToUint8Array(base64String) {
    if (!base64String) return null;
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  return (
    <>
      <div className="todo-container">
        <h3 className="todo-title">To Do App</h3>
        {showInstall && (
          <div style={{ textAlign: 'right', marginBottom: '0.5rem' }}>
            <button className="todo-btn" onClick={handleInstallClick} style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>Instalar app</button>
          </div>
        )}
        <label className="todo-label" htmlFor="tituloTarea">Ingresa tu tarea</label>
        <input className="todo-input" type='text' placeholder='Título de tu tarea' id="tituloTarea" />
        <button type='submit' className="todo-btn" onClick={guardarTarea}>Agregar tarea</button>
        <div className="tareas-list">
          {titulo_tareas}
        </div>

        <div style={{ marginTop: '1rem' }}>
          <button className="todo-btn" onClick={subscribePush} style={{ background: '#0ea5e9' }}>
            {pushSubscribed ? 'Push suscrito' : 'Suscribirse a Push (experimental)'}
          </button>
          <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
            Nota: la suscripción push requiere un servidor que envíe mensajes (VAPID). Este botón
            guarda la suscripción en localStorage y muestra el objeto en consola.
          </p>
        </div>
        <p style={{fontSize: '0.9em', color: '#888', marginTop: '1.5rem'}}>Tus tareas se guardan localmente y funcionan offline.</p>
      </div>
    </>
  );
}

export default App
