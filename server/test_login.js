const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const testLogin = async () => {
    try {
        console.log("Connecting to DB:", process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;

        console.log(`Testing Login for: ${email} with password: ${password}`);

        const user = await User.findOne({ email });
        if (!user) {
            console.log('❌ User NOT FOUND in database.');
            process.exit(1);
        }

        console.log(`✅ User Found! Role: ${user.role}, ID: ${user._id}`);
        console.log(`Stored Hash: ${user.password}`);

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            console.log('✅ PASSWORD MATCHES! The credentials are correct.');
            console.log('The issue is likely in the Frontend or API URL.');
        } else {
            console.log('❌ PASSWORD DOES NOT MATCH HASH.');
            console.log('Re-running seed might be required or salt rounds are inconsistent.');
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.connection.close();
        process.exit();
    }
};

testLogin();
