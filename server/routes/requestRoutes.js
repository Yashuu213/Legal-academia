const router = require('express').Router();
const PurchaseRequest = require('../models/PurchaseRequest');
const MentorshipRequest = require('../models/MentorshipRequest');
const ChatRoom = require('../models/ChatRoom');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// --- Purchase Requests ---

// MULTER CONFIG
const multer = require('multer');
const path = require('path');
const { verifyPaymentScreenshot } = require('../utils/aiService');

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, 'payment-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage }).single('paymentImage');


router.post('/purchase', verifyToken, async (req, res) => {
    try {
        const { noteId } = req.body;
        const newReq = new PurchaseRequest({ studentId: req.user.id, noteId });
        await newReq.save();
        res.json(newReq);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// NEW: Verify Payment Route
router.post('/verify-payment', verifyToken, (req, res) => {
    upload(req, res, async (err) => {
        if (err) return res.status(400).json({ message: err });
        if (!req.file) return res.status(400).json({ message: 'No image uploaded' });

        try {
            const { noteId } = req.body;

            // 1. AI Analysis
            const aiResult = await verifyPaymentScreenshot(req.file.path, req.file.mimetype);

            let aiStatus = 'doubtful';
            if (aiResult.isValid && aiResult.confidence > 80) aiStatus = 'verified';

            // 2. Save Request
            const newRequest = new PurchaseRequest({
                studentId: req.user.id,
                noteId: noteId,
                paymentScreenshotUrl: `/uploads/${req.file.filename}`,
                aiVerificationStatus: aiStatus,
                aiConfidence: aiResult.confidence,
                aiAnalysis: JSON.stringify(aiResult),
                status: 'pending'
            });

            await newRequest.save();
            res.status(201).json({ message: 'Uploaded', data: newRequest });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    });
});

router.get('/purchase', verifyAdmin, async (req, res) => {
    try {
        const reqs = await PurchaseRequest.find().populate('studentId').populate('noteId');
        res.json(reqs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/purchase/:id', verifyAdmin, async (req, res) => {
    try {
        const { status } = req.body; // accepted, rejected
        const request = await PurchaseRequest.findByIdAndUpdate(req.params.id, { status }, { new: true });

        if (status === 'accepted') {
            // Unlock Note for User (Redundant but safe)
            const User = require('../models/User');
            await User.findByIdAndUpdate(request.studentId, {
                $addToSet: { purchasedNotes: request.noteId }
            });

            // CREATE UNLOCKED NOTE ENTRY (Critical for "My Notes" page)
            const UnlockedNote = require('../models/UnlockedNote');
            const unlockedExists = await UnlockedNote.findOne({ studentId: request.studentId, noteId: request.noteId });
            if (!unlockedExists) {
                await new UnlockedNote({ studentId: request.studentId, noteId: request.noteId }).save();
            }

            // Create Chat Room
            const exists = await ChatRoom.findOne({ studentId: request.studentId, relatedNoteId: request.noteId });
            if (!exists) {
                await new ChatRoom({ studentId: request.studentId, relatedNoteId: request.noteId }).save();
            }
        }
        res.json(request);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- Mentorship Requests ---
router.post('/mentorship', verifyToken, async (req, res) => {
    try {
        const { topic, subject, reason, preferredTime, message } = req.body;
        const newReq = new MentorshipRequest({
            studentId: req.user.id,
            topic, subject, reason, preferredTime, message
        });
        await newReq.save();
        res.json(newReq);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/mentorship', verifyAdmin, async (req, res) => {
    try {
        const reqs = await MentorshipRequest.find().populate('studentId');
        res.json(reqs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/mentorship/:id', verifyAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        const request = await MentorshipRequest.findByIdAndUpdate(req.params.id, { status }, { new: true });

        if (status === 'accepted') {
            const exists = await ChatRoom.findOne({ mentorshipRequestId: request._id });
            if (!exists) {
                await new ChatRoom({ studentId: request.studentId, mentorshipRequestId: request._id, status: 'active' }).save();
            } else {
                exists.status = 'active';
                await exists.save();
            }
        }
        res.json(request);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// NEW: Chat Inquiry Request (Pre-payment)
router.post('/chat-inquiry', verifyToken, async (req, res) => {
    console.log("Received /chat-inquiry request:", req.body);
    try {
        const { noteId } = req.body;
        if (!noteId) {
            console.error("Missing noteId in request");
            return res.status(400).json({ message: "noteId is required" });
        }

        // 1. Create Mentorship Request (Automatic)
        const newReq = new MentorshipRequest({
            studentId: req.user.id,
            topic: 'Course Inquiry',
            subject: 'Pre-payment Question',
            reason: 'I want to discuss before purchasing.',
            preferredTime: 'ASAP',
            message: `User is interested in Note ID: ${noteId}`,
            status: 'pending'
        });
        await newReq.save();

        // 2. Create Chat Room (Pending)
        const newRoom = new ChatRoom({
            studentId: req.user.id,
            relatedNoteId: noteId,
            mentorshipRequestId: newReq._id,
            status: 'pending'
        });
        await newRoom.save();

        res.status(201).json({ message: 'Request Sent', chatRoomId: newRoom._id });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
