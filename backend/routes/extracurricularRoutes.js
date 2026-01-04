const express = require('express');
const router = express.Router();
const controller = require('../controllers/extracurricularController');

// PERBAIKAN: Gunakan kurung kurawal { } di sini juga
const { authMiddleware } = require('../middleware/auth');

router.get('/', controller.getAll);
router.post('/', authMiddleware, controller.create);
router.delete('/:id', authMiddleware, controller.delete);

module.exports = router;