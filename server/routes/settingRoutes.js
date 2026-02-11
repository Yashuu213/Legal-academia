const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// Public route to get a setting (like whatsapp link)
router.get('/:key', settingController.getSetting);

// Admin only route to update a setting
router.put('/:key', verifyToken, verifyAdmin, settingController.updateSetting);

module.exports = router;
