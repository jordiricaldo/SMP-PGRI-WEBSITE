// routes/schoolRoutes.js
const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// PUBLIC ROUTES
router.get('/', schoolController.getSchoolData);
router.get('/about', schoolController.getAboutData);
router.get('/social-media', schoolController.getSocialMediaData);
router.get('/contact', schoolController.getContactData);

// PROTECTED ROUTES (Admin only)
router.put('/about', authMiddleware, adminMiddleware, schoolController.updateAboutData);
router.put('/social-media', authMiddleware, adminMiddleware, schoolController.updateSocialMediaData);
router.put('/contact', authMiddleware, adminMiddleware, schoolController.updateContactData);

module.exports = router;