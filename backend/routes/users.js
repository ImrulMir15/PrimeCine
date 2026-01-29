/**
 * User Routes - Handle user profile operations
 */

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Booking = require('../models/Booking');
const isAdmin = require('../middleware/isAdmin');

/**
 * GET /api/users
 * Get all users (Admin only)
 */
router.get('/', isAdmin, async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const usersCount = await User.countDocuments({});
        const users = await User.find({})
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        res.json({
            success: true,
            data: users,
            pagination: {
                total: usersCount,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(usersCount / limit)
            }
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users',
            error: error.message
        });
    }
});

/**
 * GET /api/users/profile
 * Get user profile
 */
router.get('/profile', async (req, res) => {
    try {
        const { firebaseUid } = req.query;

        if (!firebaseUid) {
            return res.status(400).json({
                success: false,
                message: 'Firebase UID is required'
            });
        }

        const user = await User.findOne({ firebaseUid });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch profile',
            error: error.message
        });
    }
});

/**
 * PUT /api/users/profile
 * Update user profile
 */
router.put('/profile', async (req, res) => {
    try {
        const { firebaseUid, displayName, phone, preferences } = req.body;

        if (!firebaseUid) {
            return res.status(400).json({
                success: false,
                message: 'Firebase UID is required'
            });
        }

        const updateData = {};
        if (displayName) updateData.displayName = displayName;
        if (phone) updateData.phone = phone;
        if (preferences) updateData.preferences = preferences;

        const user = await User.findOneAndUpdate(
            { firebaseUid },
            updateData,
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: user
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
            error: error.message
        });
    }
});

/**
 * GET /api/users/bookings
 * Get user's booking history
 */
router.get('/bookings', async (req, res) => {
    try {
        const { firebaseUid, status } = req.query;

        if (!firebaseUid) {
            return res.status(400).json({
                success: false,
                message: 'Firebase UID is required'
            });
        }

        const filter = { firebaseUid };
        if (status) filter.status = status;

        const bookings = await Booking.find(filter)
            .sort({ createdAt: -1 });

        // Separate into upcoming and past
        const now = new Date();
        const upcoming = bookings.filter(b => new Date(b.showtime.date) >= now && b.status !== 'cancelled');
        const past = bookings.filter(b => new Date(b.showtime.date) < now || b.status === 'cancelled');

        res.json({
            success: true,
            data: {
                all: bookings,
                upcoming,
                past,
                stats: {
                    total: bookings.length,
                    upcoming: upcoming.length,
                    past: past.length
                }
            }
        });
    } catch (error) {
        console.error('Get user bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch booking history',
            error: error.message
        });
    }
});

/**
 * DELETE /api/users/account
 * Delete user account (GDPR compliance)
 */
router.delete('/account', async (req, res) => {
    try {
        const { firebaseUid } = req.body;

        if (!firebaseUid) {
            return res.status(400).json({
                success: false,
                message: 'Firebase UID is required'
            });
        }

        // Delete user
        await User.findOneAndDelete({ firebaseUid });

        // Note: Firebase account deletion should be done on the frontend

        res.json({
            success: true,
            message: 'Account deleted successfully'
        });
    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete account',
            error: error.message
        });
    }
});

module.exports = router;
