const News = require('../models/News');
const Gallery = require('../models/Gallery');
const Visitor = require('../models/Visitor');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalNews = await News.countDocuments();
    const totalGallery = await Gallery.countDocuments();
    const totalVisitors = await Visitor.countDocuments();
    
    // Data dummy untuk grafik bulanan (biar terlihat keren di chart)
    // Nanti bisa diganti query agregasi beneran kalau Mutiara sempat
    const monthlyVisits = [120, 150, 180, 200, 250, 300, totalVisitors]; 

    res.json({
      success: true,
      data: {
        totalNews,
        totalGallery,
        totalVisitors,
        monthlyVisits
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};