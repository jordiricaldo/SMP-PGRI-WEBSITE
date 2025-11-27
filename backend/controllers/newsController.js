// backend/controllers/newsController.js
const News = require('../models/News');

// Get All News (Public)
exports.getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 }); // Urutkan dari yang terbaru
    res.json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create News (Admin Only)
exports.createNews = async (req, res) => {
  try {
    const { title, content, image } = req.body;
    const news = await News.create({ title, content, image });
    res.status(201).json({ success: true, data: news, message: 'Berita berhasil dibuat' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete News (Admin Only)
exports.deleteNews = async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) return res.status(404).json({ success: false, message: 'Berita tidak ditemukan' });
    res.json({ success: true, message: 'Berita berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ success: false, message: 'Berita tidak ditemukan' });
    }
    res.json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};