const router = require('express').Router();
const User = require('../models/User');
const { verifyAdmin } = require('../middleware/authMiddleware');

// Get all users (Admin only)
router.get('/', verifyAdmin, async (req, res) => {
    try {
        const users = await User.find({ role: 'student' }).select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Block/Unblock user
router.put('/:id/status', verifyAdmin, async (req, res) => {
    try {
        const { status } = req.body; // active or blocked
        await User.findByIdAndUpdate(req.params.id, { status });
        res.json({ message: 'User status updated' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
