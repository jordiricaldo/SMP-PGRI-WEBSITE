// models/School.js
const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  about: {
    visi: {
      type: String,
      default: 'Menjadi lembaga pendidikan yang unggul dalam prestasi, berakhlak mulia, dan berbudaya lingkungan.'
    },
    misi: {
      type: String,
      default: 'Menyelenggarakan pendidikan berkualitas yang mengembangkan potensi siswa secara optimal dalam akademik dan non-akademik.'
    },
    prestasi: {
      type: String,
      default: 'Meraih berbagai prestasi di tingkat kota dan provinsi dalam bidang akademik, olahraga, dan seni.'
    }
  },
  socialMedia: {
    youtubeUrl: { type: String, default: '' },
    instagramUsername: { type: String, default: '' },
    facebookUrl: { type: String, default: '' },
    twitterUrl: { type: String, default: '' }
  },
  contact: {
    alamat: { type: String, default: 'Jl. Pendidikan No. 123, Ciputat, Tangerang Selatan' },
    telepon: { type: String, default: '(021) 1234-5678' },
    email: { type: String, default: 'info@smppgri1ciputat.sch.id' },
    website: { type: String, default: 'www.smppgri1ciputat.sch.id' }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

schoolSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('School', schoolSchema);