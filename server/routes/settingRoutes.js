const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public route to get a setting (like whatsapp link)
router.get('/:key', settingController.getSetting);

// Admin only route to update a setting
router.put('/:key', protect, admin, settingController.updateSetting);

module.exports = router;
