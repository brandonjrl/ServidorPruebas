const Historial = require('../models/Historial');
const Descripcion = require('../models/Descripcion');

// Controlador de historial
const historialController = {};

// Método para guardar el historial
historialController.guardarHistorial = async ({ id_estudiante, id_tarea, descripcion_tarea, salida_esperada, codigo_estudiante, codigo_gpt, tipo_retroalimentacion }) => {
    try {
        // Buscar si ya existe un historial para ese estudiante y tarea
        let historial = await Historial.findOne({ id_estudiante, id_tarea });

        // Crear una nueva descripción
        const nuevaDescripcion = new Descripcion({
            codigo_gpt,
            codigo_estudiante,
            tipo_retroalimentacion 
        });

        if (historial) {
            // Si el historial ya existe, agrega la nueva descripción al array
            historial.descripcion.push(nuevaDescripcion);
        } else {
            // Si no existe, crea un nuevo historial con la nueva descripción
            historial = new Historial({
                id_estudiante,
                id_tarea,
                descripcion_tarea,
                salida_esperada,
                descripcion: [nuevaDescripcion]
            });
        }

        // Guardar el historial actualizado o nuevo
        await historial.save();
    } catch (error) {
        console.error('Error al guardar el historial:', error);
        throw new Error('No se pudo guardar el historial');
    }
};

module.exports = historialController;
