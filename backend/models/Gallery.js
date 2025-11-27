const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  mediaUrl: { type: String, required: true }, // Link Gambar Tampilan
  igLink: { type: String, default: '' },      // Link Menuju Postingan IG
  caption: { type: String, default: '' },
  type: { type: String, default: 'image' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Gallery', gallerySchema);