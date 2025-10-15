function CardTareas({ id, titulo, eliminarTarea }) {
    return (
        <>
            <div className="w-64 h-62 border-4 rounded-sm ml-8 mt-4">
                <p className="text-4xl pt-4 px-4 text-center wrap-anywhere">{titulo}</p>
                <button 
                  className="mt-30 w-32 h-12 bg-red-500 border-2 rounded-lg" 
                  onClick={eliminarTarea}
                >
                  Eliminar
                </button>
            </div>
        </>
    );
}

export default CardTareas;