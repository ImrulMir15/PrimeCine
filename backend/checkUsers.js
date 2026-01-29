const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const listUsers = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.error('❌ MONGODB_URI not set');
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const users = await User.find({});
        console.log(`\nFound ${users.length} users:`);

        users.forEach(u => {
            console.log(`- ${u.email} (Role: ${u.role}, UID: ${u.firebaseUid})`);
        });

        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error:', error);
    }
};

listUsers();
