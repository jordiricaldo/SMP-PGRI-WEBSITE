const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/AchievementController');
const { authMiddleware } = require('../middleware/auth');

router.get('/', achievementController.getAll);
router.post('/', authMiddleware, achievementController.create);
router.delete('/:id', authMiddleware, achievementController.deleteAchievement);

module.exports = router;
