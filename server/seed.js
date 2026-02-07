const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
        if (adminExists) {
            console.log('Admin exists, updating password...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);
            adminExists.password = hashedPassword;
            await adminExists.save();
            console.log('Admin password updated successfully');
            process.exit();
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);

        const adminUser = new User({
            name: 'Admin User',
            email: process.env.ADMIN_EMAIL,
            password: hashedPassword,
            role: 'admin',
            status: 'active'
        });

        await adminUser.save();
        console.log('Admin User Created Successfully');
        console.log(`Email: ${process.env.ADMIN_EMAIL}`);
        console.log(`Password: ${process.env.ADMIN_PASSWORD}`);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAdmin();
