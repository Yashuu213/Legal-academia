const mongoose = require('mongoose');

const unlockedNoteSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    noteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Note', required: true },
    unlockedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UnlockedNote', unlockedNoteSchema);
