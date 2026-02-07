const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
    try {
        const username = process.env.DB_USER || 'Law_database';
        const password = process.env.DB_PASS || 'Legal academia@123';
        const cluster = 'cluster0.jreximg.mongodb.net';
        const dbName = 'law-platform';

        const uri = `mongodb+srv://${username}:${encodeURIComponent(password)}@${cluster}/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;

        console.log(`Connecting to MongoDB Atlas...`);
        await mongoose.connect(uri);
        console.log('MongoDB Connected');

        // Check if Admin exists
        const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);

        if (adminExists) {
            console.log('Admin exists, updating password...');
            adminExists.password = hashedPassword;
            await adminExists.save();
            console.log('Admin password updated successfully');
        } else {
            const adminUser = new User({
                name: 'Admin User',
                email: process.env.ADMIN_EMAIL,
                password: hashedPassword,
                role: 'admin',
                status: 'active'
            });

            await adminUser.save();
            console.log('Admin User Created Successfully');
        }

        console.log(`Email: ${process.env.ADMIN_EMAIL}`);
        console.log(`Password: ${process.env.ADMIN_PASSWORD}`);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAdmin();
