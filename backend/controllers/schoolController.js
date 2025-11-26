// controllers/schoolController.js
const School = require('../models/school');

exports.getSchoolData = async (req, res) => {
  try {
    let school = await School.findOne();
    if (!school) {
      school = await School.create({});
    }
    res.json({ success: true, data: school });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAboutData = async (req, res) => {
  try {
    let school = await School.findOne();
    if (!school) school = await School.create({});
    res.json({ success: true, data: school.about });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAboutData = async (req, res) => {
  try {
    const { visi, misi, prestasi } = req.body;
    let school = await School.findOne();
    if (!school) school = await School.create({});
    
    if (visi !== undefined) school.about.visi = visi;
    if (misi !== undefined) school.about.misi = misi;
    if (prestasi !== undefined) school.about.prestasi = prestasi;
    
    await school.save();
    res.json({ success: true, message: 'Data berhasil diupdate', data: school.about });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSocialMediaData = async (req, res) => {
  try {
    let school = await School.findOne();
    if (!school) school = await School.create({});
    res.json({ success: true, data: school.socialMedia });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSocialMediaData = async (req, res) => {
  try {
    const { youtubeUrl, instagramUsername, facebookUrl, twitterUrl } = req.body;
    let school = await School.findOne();
    if (!school) school = await School.create({});
    
    if (youtubeUrl !== undefined) school.socialMedia.youtubeUrl = youtubeUrl;
    if (instagramUsername !== undefined) school.socialMedia.instagramUsername = instagramUsername;
    if (facebookUrl !== undefined) school.socialMedia.facebookUrl = facebookUrl;
    if (twitterUrl !== undefined) school.socialMedia.twitterUrl = twitterUrl;
    
    await school.save();
    res.json({ success: true, message: 'Data berhasil diupdate', data: school.socialMedia });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getContactData = async (req, res) => {
  try {
    let school = await School.findOne();
    if (!school) school = await School.create({});
    res.json({ success: true, data: school.contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateContactData = async (req, res) => {
  try {
    const { alamat, telepon, email, website } = req.body;
    let school = await School.findOne();
    if (!school) school = await School.create({});
    
    if (alamat) school.contact.alamat = alamat;
    if (telepon) school.contact.telepon = telepon;
    if (email) school.contact.email = email;
    if (website) school.contact.website = website;
    
    await school.save();
    res.json({ success: true, message: 'Data berhasil diupdate', data: school.contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};