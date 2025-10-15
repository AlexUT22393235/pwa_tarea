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
    // No recargar la página, la UI se actualiza sola
  };

  const eliminarTarea = (id) => {
    setTareas(prev => prev.filter(t => t.id !== id));
  };

  return (
    <>
      <div>
        <div className="flex flex-col">
          <div>
            <h3 className="text-5xl mb-4">To Do App</h3>
            <label className="block text-2xl">Ingresa tu tarea</label>
            <input className="border-4 rounded-md my-4 w-sm h-12 pl-2" type='text' placeholder='Título de tu tarea' id="tituloTarea" />
            <button type='submit' className="border-4 rounded-md my-4 w-sm h-12 bg-cyan-500 block mx-auto text-md font-semibold" onClick={guardarTarea}>Agregar tarea</button>
          </div>
        </div>
        <div className="flex flew-row flex-wrap w-auto h-124 overflow-y-auto overscroll-none">
          {titulo_tareas}
        </div>
        <p style={{fontSize: '0.9em', color: '#888'}}>Tus tareas se guardan localmente y funcionan offline.</p>
      </div>
    </>
  );
}

export default App
