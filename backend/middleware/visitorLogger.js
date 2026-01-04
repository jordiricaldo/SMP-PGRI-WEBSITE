const Visitor = require('../models/Visitor');

const logVisitor = async (req, res, next) => {
  try {
    // Cek apakah IP ini sudah berkunjung hari ini (opsional, biar simple rekam aja semua hit)
    // Untuk demo sidang, rekam semua request ke '/' biar grafiknya naik terus saat direfresh
    await Visitor.create({ ip: req.ip || req.connection.remoteAddress });
  } catch (error) {
    console.error("Gagal mencatat visitor:", error);
  }
  next();
};

module.exports = logVisitor;