const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional if always same admin
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    relatedNoteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Note' },
    mentorshipRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'MentorshipRequest' },
    status: { type: String, enum: ['active', 'pending'], default: 'active' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatRoom', chatRoomSchema);
