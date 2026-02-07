const express = require('express');
const router = express.Router();
const Update = require('../models/Update');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// @desc    Get all updates
// @route   GET /api/updates
// @access  Public
router.get('/', async (req, res) => {
    try {
        const updates = await Update.find().sort({ createdAt: -1 });
        res.json(updates);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc    Create a new update
// @route   POST /api/updates
// @access  Private (Admin only)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
    const { title, description, link, type } = req.body;

    try {
        const update = new Update({
            title,
            description,
            link,
            type,
            postedBy: req.user._id
        });

        const createdUpdate = await update.save();

        // NOTIFICATION TRIGGER: Notify all students
        const students = await User.find({ role: 'student' });
        if (students.length > 0) {
            const notifications = students.map(student => ({
                userId: student._id,
                message: `New Update Posted: ${title}`,
                type: 'update',
                link: '/updates'
            }));
            await Notification.insertMany(notifications);
        }

        res.status(201).json(createdUpdate);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @desc    Delete an update
// @route   DELETE /api/updates/:id
// @access  Private (Admin only)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {
        const update = await Update.findById(req.params.id);

        if (update) {
            await update.deleteOne();
            res.json({ message: 'Update removed' });
        } else {
            res.status(404).json({ message: 'Update not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
