const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Note = require('./models/Note');
const User = require('./models/User');

dotenv.config();

const seedNotes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Find the admin to be the 'creator' of notes
        const admin = await User.findOne({ email: process.env.ADMIN_EMAIL });
        if (!admin) {
            console.log('Admin not found. Please run seed.js first.');
            process.exit(1);
        }

        const notes = [
            {
                title: 'Constitutional Law: Fundamental Rights',
                description: 'Comprehensive guide to Articles 12-35 of the Constitution. Includes case laws and analysis.',
                price: 499,
                fileUrl: 'http://localhost:5000/uploads/sample_note.pdf',
                createdBy: admin._id
            },
            {
                title: 'Criminal Procedure Code (CrPC) Summary',
                description: 'Quick revision notes for CrPC 1973. Perfect for exam preparation.',
                price: 299,
                fileUrl: 'http://localhost:5000/uploads/sample_note.pdf',
                createdBy: admin._id
            },
            {
                title: 'Law of Torts: Negligence & Liability',
                description: 'Deep dive into negligence, strict liability, and absolute liability with landmark judgments.',
                price: 399,
                fileUrl: 'http://localhost:5000/uploads/sample_note.pdf',
                createdBy: admin._id
            },
            {
                title: 'Contract Law: Essentials of Valid Contract',
                description: 'Detailed analysis of Indian Contract Act 1872 sections 1-75.',
                price: 199,
                fileUrl: 'http://localhost:5000/uploads/sample_note.pdf',
                createdBy: admin._id
            }
        ];

        await Note.deleteMany({}); // Clear existing notes
        await Note.insertMany(notes);

        console.log('Sample Notes Seeded Successfully');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedNotes();
