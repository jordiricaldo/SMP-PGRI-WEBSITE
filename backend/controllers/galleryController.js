const Gallery = require('../models/Gallery');

exports.getGallery = async (req, res) => {
  try {
    const photos = await Gallery.find().sort({ createdAt: -1 }).limit(6);
    res.json({ success: true, data: photos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addPhoto = async (req, res) => {
  try {
    // Tambahkan igLink di sini
    const { mediaUrl, caption, type = 'image', igLink } = req.body; 
    
    const photo = await Gallery.create({ 
      mediaUrl, 
      caption, 
      type,
      igLink // Simpan link IG
    });
    
    res.status(201).json({ success: true, data: photo, message: 'Media berhasil ditambahkan' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deletePhoto = async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Media berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};