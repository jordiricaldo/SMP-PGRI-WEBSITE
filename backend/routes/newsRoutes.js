// backend/routes/newsRoutes.js
const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Public
router.get('/', newsController.getAllNews);
router.get('/:id', newsController.getNewsById);

// Protected (Admin Only)
router.post('/', authMiddleware, adminMiddleware, newsController.createNews);
router.delete('/:id', authMiddleware, adminMiddleware, newsController.deleteNews);

module.exports = router;