/**
 * Auth Routes - Handle user authentication sync with Firebase
 */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * POST /api/auth/sync
 * Sync Firebase user with MongoDB
 * Called after successful Firebase authentication
 */
router.post('/sync', async (req, res) => {
    try {
        const { firebaseUid, email, displayName, photoURL } = req.body;

        if (!firebaseUid || !email) {
            return res.status(400).json({
                success: false,
                message: 'Firebase UID and email are required'
            });
        }

        // Find or create user
        let user = await User.findOne({ firebaseUid });

        if (user) {
            // Update existing user
            user.email = email;
            user.displayName = displayName || user.displayName;
            user.photoURL = photoURL || user.photoURL;
            await user.save();
        } else {
            // Create new user
            user = await User.create({
                firebaseUid,
                email,
                displayName: displayName || email.split('@')[0],
                photoURL
            });
        }

        // Generate JWT token for backend authorization
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({
            success: true,
            message: 'User synced successfully',
            token,
            user: {
                id: user._id,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Auth sync error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to sync user',
            error: error.message
        });
    }
});

/**
 * POST /api/auth/register
 * Register a new user (alternative to sync)
 */
router.post('/register', async (req, res) => {
    try {
        const { firebaseUid, email, displayName, phone } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({
            $or: [{ firebaseUid }, { email }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        const user = await User.create({
            firebaseUid,
            email,
            displayName,
            phone
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: user._id,
                email: user.email,
                displayName: user.displayName
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
});

module.exports = router;
