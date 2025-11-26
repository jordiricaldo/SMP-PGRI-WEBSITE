// backend/models/News.js
const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Judul berita harus diisi']
  },
  content: {
    type: String,
    required: [true, 'Isi berita harus diisi']
  },
  image: {
    type: String, // Bisa berupa URL gambar atau base64 string
    default: ''
  },
  author: {
    type: String,
    default: 'Admin'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('News', newsSchema);