const Achievement = require('../models/Achievement');

exports.getAll = async (req, res) => {
    try {
        const achievements = await Achievement.find().sort({ date: -1 });
        res.json({ success: true, data: achievements });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.create = async (req, res) => {
    const achievement = new Achievement({
        title: req.body.title,
        description: req.body.description,
        image: req.body.image
    });

    try {
        const newAchievement = await achievement.save();
        res.status(201).json(newAchievement);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteAchievement = async (req, res) => {
    try {
        const achievement = await Achievement.findById(req.params.id);
        if (!achievement) return res.status(404).json({ message: 'Achievement not found' });

        await achievement.deleteOne();
        res.json({ message: 'Achievement deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
