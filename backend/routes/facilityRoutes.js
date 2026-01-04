const express = require('express');
const router = express.Router();
const controller = require('../controllers/facilityController');

// PERBAIKAN: Gunakan kurung kurawal { } karena auth.js mengekspor objek
const { authMiddleware } = require('../middleware/auth'); 

router.get('/', controller.getAll);
router.post('/', authMiddleware, controller.create);
router.delete('/:id', authMiddleware, controller.delete);

module.exports = router;