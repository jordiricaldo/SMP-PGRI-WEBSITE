// backend/routes/galleryRoutes.js
const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/', galleryController.getGallery);
router.post('/', authMiddleware, adminMiddleware, galleryController.addPhoto);
router.delete('/:id', authMiddleware, adminMiddleware, galleryController.deletePhoto);

module.exports = router;