// src/controllers/retroalimentacion.controller.js
const Retroalimentacion = require('../models/Retroalimentacion');

// Crear una nueva retroalimentación
const crearRetroalimentacion = async (req, res) => {
  const { tipo_retroalimentacion, prompt, penalizacion } = req.body;

  try {
    const nuevaRetroalimentacion = new Retroalimentacion({
      tipo_retroalimentacion,
      prompt,
      penalizacion,
    });

    const retroalimentacionGuardada = await nuevaRetroalimentacion.save();
    res.status(201).json(retroalimentacionGuardada);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la retroalimentación', error: error.message || error });
  }
};

// Obtener todas las retroalimentaciones (solo tipo_retroalimentacion y excluir _id)
const obtenerRetroalimentaciones = async (req, res) => {
    try {
      // Seleccionar solo el campo "tipo_retroalimentacion" y excluir "_id"
      const retroalimentaciones = await Retroalimentacion.find().select('tipo_retroalimentacion -_id');
      res.status(200).json(retroalimentaciones);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener las retroalimentaciones', error });
    }
  };
  

// Obtener una retroalimentación por ID
const obtenerRetroalimentacionPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const retroalimentacion = await Retroalimentacion.findById(id);

    if (!retroalimentacion) {
      return res.status(404).json({ message: 'Retroalimentación no encontrada' });
    }

    res.status(200).json(retroalimentacion);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la retroalimentación', error });
  }
};

// Actualizar una retroalimentación por ID
const actualizarRetroalimentacion = async (req, res) => {
  const { id } = req.params;
  const { tipo_retroalimentacion, prompt, penalizacion } = req.body;

  try {
    const retroalimentacionActualizada = await Retroalimentacion.findByIdAndUpdate(
      id,
      { tipo_retroalimentacion, prompt, penalizacion },
      { new: true } // Retornar el documento actualizado
    );

    if (!retroalimentacionActualizada) {
      return res.status(404).json({ message: 'Retroalimentación no encontrada' });
    }

    res.status(200).json(retroalimentacionActualizada);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la retroalimentación', error });
  }
};

// Eliminar una retroalimentación por ID
const eliminarRetroalimentacion = async (req, res) => {
  const { id } = req.params;

  try {
    const retroalimentacionEliminada = await Retroalimentacion.findByIdAndDelete(id);

    if (!retroalimentacionEliminada) {
      return res.status(404).json({ message: 'Retroalimentación no encontrada' });
    }

    res.status(200).json({ message: 'Retroalimentación eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la retroalimentación', error });
  }
};

// Eliminar una retroalimentación por nombre (tipo_retroalimentacion)
const eliminarRetroalimentacionPorNombre = async (req, res) => {
  const { tipo_retroalimentacion } = req.params;

  try {
    const retroalimentacionEliminada = await Retroalimentacion.findOneAndDelete({ tipo_retroalimentacion });

    if (!retroalimentacionEliminada) {
      return res.status(404).json({ message: 'Retroalimentación no encontrada' });
    }

    res.status(200).json({ message: 'Retroalimentación eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la retroalimentación', error });
  }
};

module.exports = {
  crearRetroalimentacion,
  obtenerRetroalimentaciones,
  obtenerRetroalimentacionPorId,
  actualizarRetroalimentacion,
  eliminarRetroalimentacion,
  eliminarRetroalimentacionPorNombre,
};
