const mongoose = require('mongoose');

const extracurricularSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String }, // Misal: "Latihan setiap Sabtu"
  schedule: { type: String } 
});

module.exports = mongoose.model('Extracurricular', extracurricularSchema);