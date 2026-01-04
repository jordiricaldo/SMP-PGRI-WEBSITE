const Facility = require('../models/Facility');

exports.getAll = async (req, res) => {
  try {
    const data = await Facility.find();
    res.json({ success: true, data });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const newData = await Facility.create(req.body);
    res.json({ success: true, data: newData });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.delete = async (req, res) => {
  try {
    await Facility.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};