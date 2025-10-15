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
      <div className="todo-container">
        <h3 className="todo-title">To Do App</h3>
        <label className="todo-label" htmlFor="tituloTarea">Ingresa tu tarea</label>
        <input className="todo-input" type='text' placeholder='Título de tu tarea' id="tituloTarea" />
        <button type='submit' className="todo-btn" onClick={guardarTarea}>Agregar tarea</button>
        <div className="tareas-list">
          {titulo_tareas}
        </div>
        <p style={{fontSize: '0.9em', color: '#888', marginTop: '1.5rem'}}>Tus tareas se guardan localmente y funcionan offline.</p>
      </div>
    </>
  );
}

export default App
