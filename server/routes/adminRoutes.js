const router = require('express').Router();
const User = require('../models/User');
const PurchaseRequest = require('../models/PurchaseRequest');
const MentorshipRequest = require('../models/MentorshipRequest');
const { verifyAdmin } = require('../middleware/authMiddleware');

router.get('/notifications', verifyAdmin, async (req, res) => {
    try {
        // 1. Fetch Latest 5 Users
        const latestUsers = await User.find().sort({ createdAt: -1 }).limit(5);

        // 2. Fetch Pending Purchase Requests
        const pendingPurchases = await PurchaseRequest.find({ status: 'pending' })
            .populate('studentId', 'name email')
            .populate('noteId', 'title')
            .sort({ createdAt: -1 });

        // 3. Fetch Pending Mentorship Requests
        const pendingMentorships = await MentorshipRequest.find({ status: 'pending' })
            .populate('studentId', 'name email')
            .sort({ createdAt: -1 });

        res.json({
            users: latestUsers,
            purchases: pendingPurchases,
            mentorships: pendingMentorships
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Manual Grant Access to Note
const UnlockedNote = require('../models/UnlockedNote');
const ChatRoom = require('../models/ChatRoom');

router.post('/grant-access', verifyAdmin, async (req, res) => {
    try {
        const { studentId, noteId } = req.body;

        // 1. Update User's purchasedNotes
        await User.findByIdAndUpdate(studentId, {
            $addToSet: { purchasedNotes: noteId }
        });

        // 2. Create UnlockedNote Entry
        const unlockedExists = await UnlockedNote.findOne({ studentId, noteId });
        if (!unlockedExists) {
            await new UnlockedNote({ studentId, noteId }).save();
        }

        // 3. Create Chat Room
        const chatExists = await ChatRoom.findOne({ studentId, relatedNoteId: noteId });
        if (!chatExists) {
            await new ChatRoom({ studentId, relatedNoteId: noteId }).save();
        }

        res.json({ message: 'Access Granted Successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
