import './App.css';
import CardTareas from './components/CardTareas';
import { useState, useEffect } from 'react';

function App() {
  const [tareas, setTareas] = useState([]);

  // Cargar tareas del localStorage al iniciar
  useEffect(() => {
    const todasLasTareas = [];
    
    // Recorrer todos los items del localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      // Solo tomar los items que empiezan con "tarea_"
      if (key.startsWith("tarea_")) {
        const tarea = JSON.parse(localStorage.getItem(key));
        todasLasTareas.push(tarea);
      }
    }
    
    setTareas(todasLasTareas);
  }, []);


  // const agreagar_tarea=
  const titulo_tareas = tareas.map(tarea =>
    <li class="list-none">
      <CardTareas
        id={tarea.id}
        titulo={tarea.titulo}></CardTareas>
    </li>
  )

  const guardarTarea = () => {
  const tituloIngresado = document.getElementById("tituloTarea").value;
  
  if (!tituloIngresado.trim()) {
    alert("Por favor, ingresa un título para la tarea");
    return;
  }

  // Generar un nuevo ID para cada tarea
  const idTarea = crypto.randomUUID();
  
  // Crear la nueva tarea
  const nuevaTarea = {id: idTarea, titulo: tituloIngresado};
  
  // Guardar cada tarea como un item individual
  localStorage.setItem(`tarea_${idTarea}`, JSON.stringify(nuevaTarea));
  
  // Limpiar el input
  document.getElementById("tituloTarea").value = "";
  
  alert("¡Tarea guardada exitósamente!");
  window.location.reload(); // Recargar para ver los cambios
}

  return (
    <>
      <div>
        <div class="flex flex-col">
          <div>

            <h3 class="text-5xl mb-4">To Do App</h3>
            <label class="block text-2xl">Ingresa tu tarea</label>
            <input class="border-4 rounded-md my-4 w-sm h-12 pl-2" type='text' placeholder='Título de tu tarea' id="tituloTarea" />
            <button type='sumbmit' class="border-4 rounded-md my-4 w-sm h-12 bg-cyan-500 block mx-auto text-md font-semibold" onClick={guardarTarea}>Agregar tarea</button>
          </div>
        </div>

        <div class="flex flew-row flex-wrap w-auto h-124 overflow-y-auto overscroll-none">
          {titulo_tareas}
        </div>
      </div>
    </>
  )
}

export default App
