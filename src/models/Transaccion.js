// src/models/Transaccion.js
const mongoose = require('mongoose');

const TransaccionSchema = new mongoose.Schema({
  id_estudiante: { type: Number, required: true },
  id_tarea: { type: Number, required: true },
  descripcion_tarea: { type: String, required: true },
  salida_esperada: { type: String, required: true },
  codigo_gpt: { type: String, default: '' },
  codigo_estudiante: { type: String, required: true },
  tipo_retroalimentacion: { type: String, default: '' },
  test_case: { type: mongoose.Schema.Types.Mixed, default: {} } // Accept any JSON structure
});

module.exports = mongoose.model('Transaccion', TransaccionSchema);
