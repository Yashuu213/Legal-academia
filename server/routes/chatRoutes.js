const router = require('express').Router();
const ChatRoom = require('../models/ChatRoom');
const Message = require('../models/Message');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// Get My Chat Rooms (Student)
router.get('/my-rooms', verifyToken, async (req, res) => {
    try {
        const rooms = await ChatRoom.find({ studentId: req.user.id })
            .populate('relatedNoteId')
            .populate('mentorshipRequestId')
            .populate('adminId'); // if adminId is saved
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get All Chat Rooms (Admin)
router.get('/all-rooms', verifyAdmin, async (req, res) => {
    try {
        const rooms = await ChatRoom.find()
            .populate('studentId')
            .populate('relatedNoteId')
            .populate('mentorshipRequestId');
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Messages for Room
router.get('/:roomId/messages', verifyToken, async (req, res) => {
    try {
        // Basic check: user must be admin OR student of the room
        const room = await ChatRoom.findById(req.params.roomId);
        if (!room) return res.status(404).json({ message: 'Room not found' });

        if (req.user.role !== 'admin' && room.studentId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access Denied' });
        }

        const messages = await Message.find({ chatRoomId: req.params.roomId }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
