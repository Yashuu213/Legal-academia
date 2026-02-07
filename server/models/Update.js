const mongoose = require('mongoose');

const updateSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String }, // Optional link for application/news
    type: {
        type: String,
        enum: ['internship', 'news', 'update'],
        default: 'update'
    },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Update', updateSchema);
