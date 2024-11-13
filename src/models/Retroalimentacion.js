// src/models/Retroalimentacion.js
const mongoose = require('mongoose');

const RetroalimentacionSchema = new mongoose.Schema({
  tipo_retroalimentacion: { type: String, required: true },
  prompt: { type: String, required: false },
  penalizacion: { type: Number, default: 0 }
});

module.exports = mongoose.model('Retroalimentacion', RetroalimentacionSchema);
