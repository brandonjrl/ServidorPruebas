// src/routes/retroalimentacion.routes.js
const express = require('express');
const router = express.Router();
const {
  crearRetroalimentacion,
  obtenerRetroalimentaciones,
  obtenerRetroalimentacionPorId,
  actualizarRetroalimentacion,
  eliminarRetroalimentacion,
  eliminarRetroalimentacionPorNombre,
} = require('../controllers/retroalimentacion.controller');

// Ruta para crear una nueva retroalimentación (POST)
// URL: /retroalimentacion
router.post('/', crearRetroalimentacion);

// Ruta para obtener todas las retroalimentaciones (GET)
// URL: /retroalimentacion
router.get('/', obtenerRetroalimentaciones);

// Ruta para obtener una retroalimentación por ID (GET)
// URL: /retroalimentacion/:id
router.get('/:id', obtenerRetroalimentacionPorId);

// Ruta para actualizar una retroalimentación por ID (PUT)
// URL: /retroalimentacion/:id
router.put('/:id', actualizarRetroalimentacion);

// Ruta para eliminar una retroalimentación por ID (DELETE)
// URL: /retroalimentacion/:id
router.delete('/:id', eliminarRetroalimentacion);

// Ruta para eliminar una retroalimentación por nombre (DELETE)
// URL: /retroalimentacion/nombre/:tipo_retroalimentacion
router.delete('/nombre/:tipo_retroalimentacion', eliminarRetroalimentacionPorNombre);

module.exports = router;
