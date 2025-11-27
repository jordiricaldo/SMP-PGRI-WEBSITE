// backend/resetGallery.js
const mongoose = require('mongoose');
const Gallery = require('./models/Gallery'); // Pastikan path ini benar
require('dotenv').config();

const resetGallery = async () => {
  try {
    console.log('🔄 Menghubungkan ke Database...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smp-pgri');
    console.log('✅ Terhubung ke MongoDB');

    // Hapus Semua Data di Koleksi Gallery
    const result = await Gallery.deleteMany({});
    
    console.log('====================================');
    console.log(`🗑️  BERHASIL MENGHAPUS ${result.deletedCount} FOTO/ITEM DARI GALERI.`);
    console.log('✨  Database Galeri sekarang BERSIH (Kosong).');
    console.log('====================================');

    process.exit(0);
  } catch (error) {
    console.error('❌ Gagal menghapus:', error.message);
    process.exit(1);
  }
};

resetGallery();