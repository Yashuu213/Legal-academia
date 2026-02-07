const mongoose = require('mongoose');

const mentorshipRequestSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    topic: { type: String, required: true },
    subject: { type: String, required: true },
    reason: { type: String, required: true },
    preferredTime: { type: String, required: true },
    message: { type: String },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MentorshipRequest', mentorshipRequestSchema);
