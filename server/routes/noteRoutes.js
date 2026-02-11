const router = require('express').Router();
const Note = require('../models/Note');
const UnlockedNote = require('../models/UnlockedNote');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Multer Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Create Note (Admin) - Accept 'file' (PDF) and 'poster' (Image)
router.post('/', verifyAdmin, upload.fields([{ name: 'file', maxCount: 1 }, { name: 'poster', maxCount: 1 }]), async (req, res) => {
    try {
        const { title, description, price } = req.body;

        // Handle Files
        const fileUrl = req.files['file'] ? `/uploads/${req.files['file'][0].filename}` : '';
        const posterUrl = req.files['poster'] ? `/uploads/${req.files['poster'][0].filename}` : '';

        if (!fileUrl) return res.status(400).json({ message: 'Main PDF file is required' });

        const newNote = new Note({
            title,
            description,
            price,
            fileUrl,
            posterUrl,
            createdBy: req.user.id
        });
        await newNote.save();
        res.status(201).json(newNote);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get All Notes (Public/Student) - Don't show fileUrl unless unlocked? 
// Actually frontend decides. But logically secure: User needs middleware to access file.
router.get('/', async (req, res) => {
    try {
        const notes = await Note.find().sort({ createdAt: -1 });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Unlock Note for Student (Admin)
router.post('/unlock', verifyAdmin, async (req, res) => {
    try {
        const { studentId, noteId } = req.body;
        const exists = await UnlockedNote.findOne({ studentId, noteId });
        if (exists) return res.status(400).json({ message: 'Already unlocked' });

        const unlocked = new UnlockedNote({ studentId, noteId });
        await unlocked.save();
        res.json({ message: 'Note unlocked successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get My Unlocked Notes (Student)
router.get('/unlocked', verifyToken, async (req, res) => {
    try {
        const unlocked = await UnlockedNote.find({ studentId: req.user.id }).populate('noteId');
        res.json(unlocked);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
