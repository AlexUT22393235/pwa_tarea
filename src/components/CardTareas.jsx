function CardTareas({ id, titulo, eliminarTarea }) {
    return (
        <div className="card-tarea">
            <p className="card-tarea-titulo">{titulo}</p>
            <button 
              className="card-tarea-btn"
              onClick={eliminarTarea}
            >
              Eliminar
            </button>
        </div>
    );
}

export default CardTareas;