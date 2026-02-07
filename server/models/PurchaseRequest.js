const mongoose = require('mongoose');

const purchaseRequestSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    noteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Note', required: true },
    paymentScreenshotUrl: { type: String },
    aiVerificationStatus: { type: String, enum: ['pending', 'verified', 'doubtful', 'failed'], default: 'pending' },
    aiConfidence: { type: Number, default: 0 },
    aiAnalysis: { type: String }, // Details from AI
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PurchaseRequest', purchaseRequestSchema);
