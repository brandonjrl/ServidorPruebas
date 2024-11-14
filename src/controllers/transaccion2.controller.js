const Transaccion = require('../models/Transaccion');
const Retroalimentacion = require('../models/Retroalimentacion');
const historialController = require('./historial.controller');
const Historial = require('../models/Historial');

const obtenerCodigoGPT = () => {
    // Aquí puedes calcular o asignar un valor a codigo_gpt
    return 'valor_calculado2';
};

// Función para concatenar el Promt
const crearPrompt = (retroalimentacion, descripcion_tarea, salida_esperada, test_case = null) => {
    return `
    ${retroalimentacion}\n
    Descripción de la tarea: ${descripcion_tarea}\n
    Salida esperada:\n${salida_esperada}\n
    ${test_case ? `Test Case:\n${JSON.stringify(test_case)}` : ''}
    `;
};
const transaccion2Controller = {};

// Función para validar los datos
const validarDatos = ({ id_estudiante, id_tarea, descripcion_tarea, codigo_estudiante, salida_esperada, tipo_retroalimentacion }) => {
    if (!id_estudiante || !id_tarea || !descripcion_tarea || !codigo_estudiante || !salida_esperada || !tipo_retroalimentacion) {
        throw new Error('Faltan parámetros obligatorios');
    }
};

// Función para buscar en el historial si ya existe una transacción con el mismo código de estudiante y retroalimentación
async function buscarCodigoHistorial(id_estudiante, id_tarea, codigo_estudiante, tipo_retroalimentacion) {
    const historial = await Historial.findOne({ id_estudiante, id_tarea });

    if (!historial) {
        return null; // No hay historial previo, así que no hay repetición
    }

    // Busca una coincidencia en las descripciones
    const descripcionCoincidente = historial.descripcion.find(descripcion =>
        descripcion.codigo_estudiante === codigo_estudiante &&
        descripcion.tipo_retroalimentacion === tipo_retroalimentacion
    );

    // Retorna la descripción coincidente o null si no existe
    return descripcionCoincidente || null;
}

// Método para procesar la transacción
transaccion2Controller.procesarTransaccion = async (req, res) => {
    try {
        // 1. Validar los datos que llegan en la solicitud
        try {
            validarDatos(req.body);
        } catch (validationError) {
            // Si hay un error en la validación, devolver una respuesta de error y detener la ejecución
            return res.status(400).json({ message: validationError.message });
        }

        const { id_estudiante, id_tarea, descripcion_tarea, codigo_estudiante, salida_esperada, tipo_retroalimentacion, test_case } = req.body;
        console.log("Código estudiante:", codigo_estudiante);

        // 2. Buscar en el historial si ya existe una transacción con el mismo código y retroalimentación
        const descripcionCoincidente = await buscarCodigoHistorial(id_estudiante, id_tarea, codigo_estudiante, tipo_retroalimentacion);
        if (descripcionCoincidente) {
            console.log(`Código repetido encontrado: ${descripcionCoincidente.codigo_estudiante || 'Código no definido'}`);
            //return res.status(400).json({ message: 'Ya has realizado esta solicitud con el mismo código y retroalimentación.' });
        }

        // 3. Buscar el prompt en la base de datos de retroalimentaciones
        const retroalimentacion = await Retroalimentacion.findOne({ tipo_retroalimentacion });
        if (!retroalimentacion) {
            return res.status(400).json({ message: 'No se encontró el tipo de retroalimentación solicitado.' });
        }
        // 4. Crear el prompt para la IA usando los datos recibidos, incluyendo test_case si existe
        const promptGPT = crearPrompt(retroalimentacion.prompt, descripcion_tarea, salida_esperada, test_case || null);
        console.log("Prompt System");
        console.log(promptGPT);

        const codigo_gpt = obtenerCodigoGPT(); // Llamamos a la función para obtener el valor real de codigo_gpt

        const nuevaTransaccion = new Transaccion({
            id_estudiante,
            id_tarea,
            descripcion_tarea,
            salida_esperada,
            codigo_gpt,
            codigo_estudiante,
            tipo_retroalimentacion,
            test_case: test_case || null // Almacenar test_case como null si no está definido
        });

        await nuevaTransaccion.save();

        await historialController.guardarHistorial({
            id_estudiante,
            id_tarea,
            descripcion_tarea,
            salida_esperada,
            codigo_estudiante,
            codigo_gpt,
            tipo_retroalimentacion
        });

        return res.status(200).json({
            message: 'Transacción procesada correctamente', //Se puede eliminar para evitar que se envie el mensaje, este es usado como un control
            retroalimentacion: codigo_gpt
        });

    } catch (error) {
        console.error('Error en el servidor:', error);
        return res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

module.exports = transaccion2Controller;
