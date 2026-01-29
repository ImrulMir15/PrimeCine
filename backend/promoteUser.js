const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

// Load environment variables
dotenv.config();

const promoteUser = async () => {
    // Get email from command line args
    const email = process.argv[2];

    if (!email) {
        console.error('❌ Please provide an email address.');
        console.log('Usage: node promoteUser.js <email>');
        process.exit(1);
    }

    try {
        // Connect to MongoDB
        if (!process.env.MONGODB_URI) {
            console.error('❌ MONGODB_URI not set in .env file');
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Find and update user
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            console.error(`❌ User with email '${email}' not found.`);
            console.log('👉 Please register this user on the frontend first!');
            process.exit(1);
        }

        user.role = 'admin';
        await user.save();

        console.log(`\n🎉 Success! User '${email}' is now an Admin.`);
        console.log('👉 You can now log in at /admin-login');

        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

promoteUser();
