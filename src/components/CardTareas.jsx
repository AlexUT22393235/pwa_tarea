function CardTareas({ id, titulo }) {

    const eliminarTarea = () => {
        // Eliminar directamente el item del localStorage
        localStorage.removeItem(`tarea_${id}`);
        alert("La tarea fue eliminada con éxito.");
        window.location.reload(); // Recargar para ver los cambios
    }

    return (
        <>
            <div class="w-64 h-62 border-4 rounded-sm ml-8 mt-4">
                <p class="text-4xl pt-4 px-4 text-center wrap-anywhere">{titulo}</p>
                <button 
                  class="mt-30 w-32 h-12 bg-red-500 border-2 rounded-lg" 
                  onClick={eliminarTarea}
                >
                  Eliminar
                </button>
            </div>
        </>
    )
}

export default CardTareas;