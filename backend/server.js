// server.js
// Backend Server dengan Express.js + Authentication + Upload + Visitor Log

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

// === 1. IMPORT SEMUA ROUTES & MIDDLEWARE DI SINI (PALING ATAS) ===
const authRoutes = require('./routes/authRoutes');
const schoolRoutes = require('./routes/schoolRoutes');
const newsRoutes = require('./routes/newsRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const facilityRoutes = require('./routes/facilityRoutes'); // <-- TAMBAH
const extracurricularRoutes = require('./routes/extracurricularRoutes');

// Import Middleware Visitor (Pastikan file ini ada di folder middleware)
const logVisitor = require('./middleware/visitorLogger'); 

const app = express();
const PORT = process.env.PORT || 5000;

// === 2. MIDDLEWARE GLOBAL ===
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === 3. DATABASE CONNECTION ===
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smp-pgri', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB Connected Successfully');
  console.log(`📊 Database: ${mongoose.connection.name}`);
})
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err.message);
  process.exit(1);
});

// === 4. KONFIGURASI FOLDER UPLOAD ===
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// === 5. SETUP ROUTES (JALUR API) ===

// Auth tidak perlu visitor log
app.use('/api/auth', authRoutes);

// Pasang logVisitor di route publik yang sering diakses user
// Jadi setiap kali Frontend minta data sekolah, pengunjung dihitung +1
app.use('/api/school', logVisitor, schoolRoutes); 

// Route berita & galeri
app.use('/api/news', newsRoutes);
app.use('/api/gallery', galleryRoutes);

// Route upload
app.use('/api/upload', uploadRoutes);

// Route fasilitas
app.use('/api/facility', facilityRoutes);
app.use('/api/extracurricular', extracurricularRoutes);

// === 6. HEALTH CHECK & ERROR HANDLING ===
app.get('/', (req, res) => {
  res.json({ 
    message: 'SMP PGRI 1 CIPUTAT API is running!',
    version: '1.0.0'
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// === 7. START SERVER ===
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});