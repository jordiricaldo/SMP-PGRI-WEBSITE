// backend/controllers/schoolController.js
const School = require('../models/School');

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

// UPDATE BESAR DI SINI (HANDLE SAMBUTAN & KURIKULUM)
exports.updateAboutData = async (req, res) => {
  try {
    const { visi, misi, prestasi, deskripsi, sambutan, kurikulum } = req.body;
    let school = await School.findOne();
    if (!school) school = await School.create({});
    
    // Update Info Dasar
    if (visi !== undefined) school.about.visi = visi;
    if (misi !== undefined) school.about.misi = misi;
    if (prestasi !== undefined) school.about.prestasi = prestasi;
    if (deskripsi !== undefined) school.about.deskripsi = deskripsi;
    
    // Update Sambutan Kepsek
    if (sambutan) {
      if (sambutan.judul !== undefined) school.about.sambutan.judul = sambutan.judul;
      if (sambutan.konten !== undefined) school.about.sambutan.konten = sambutan.konten;
      if (sambutan.namaKepsek !== undefined) school.about.sambutan.namaKepsek = sambutan.namaKepsek;
      if (sambutan.fotoKepsek !== undefined) school.about.sambutan.fotoKepsek = sambutan.fotoKepsek;
    }

    // Update Link Kurikulum (Disimpan di root object, bukan di dalam about)
    if (kurikulum) {
      if (kurikulum.eraporUrl !== undefined) school.kurikulum.eraporUrl = kurikulum.eraporUrl;
      if (kurikulum.absensiUrl !== undefined) school.kurikulum.absensiUrl = kurikulum.absensiUrl;
    }
    
    await school.save();
    res.json({ 
      success: true, 
      message: 'Data berhasil diupdate', 
      data: { about: school.about, kurikulum: school.kurikulum } 
    });
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