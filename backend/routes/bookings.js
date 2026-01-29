/**
 * Booking Routes - Handle ticket booking operations
 */

const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Showtime = require('../models/Showtime');
const User = require('../models/User');
const isAdmin = require('../middleware/isAdmin');

/**
 * GET /api/bookings/all
 * Get all bookings (Admin only)
 */
router.get('/all', isAdmin, async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const bookingsCount = await Booking.countDocuments({});
        const bookings = await Booking.find({})
            .populate('user', 'displayName email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        res.json({
            success: true,
            data: bookings,
            pagination: {
                total: bookingsCount,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(bookingsCount / limit)
            }
        });
    } catch (error) {
        console.error('Get all bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch all bookings',
            error: error.message
        });
    }
});

/**
 * POST /api/bookings
 * Create a new booking
 */
router.post('/', async (req, res) => {
    try {
        const {
            firebaseUid,
            showtimeId,
            seats,
            contactEmail,
            contactPhone
        } = req.body;

        // Validate required fields
        if (!firebaseUid || !showtimeId || !seats || !seats.length || !contactEmail) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Get showtime
        const showtime = await Showtime.findById(showtimeId).populate('movie');
        if (!showtime) {
            return res.status(404).json({
                success: false,
                message: 'Showtime not found'
            });
        }

        if (!showtime.movie) {
            return res.status(404).json({
                success: false,
                message: 'Movie not found for this showtime'
            });
        }

        // Get user
        const user = await User.findOne({ firebaseUid });
        if (!user) {
            console.log('User not found for uid:', firebaseUid);
            // Try to create user if not exists (sync fallback)
            // For now, return error
            return res.status(404).json({
                success: false,
                message: `User account not found. Please log out and log in again. (UID: ${firebaseUid})`
            });
        }

        // Check if seats are available
        const seatIds = seats.map(s => s.id);
        if (!showtime.checkSeatsAvailable(seatIds)) {
            return res.status(400).json({
                success: false,
                message: 'Some selected seats are already booked. Please choose other seats.'
            });
        }

        // Calculate pricing
        const subtotal = seats.reduce((sum, seat) => sum + seat.price, 0);
        const tax = Math.round(subtotal * 0.05); // 5% tax
        const serviceFee = 100; // $1 service fee
        const total = subtotal + tax + serviceFee;

        // Generate bookingRef explicitly
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
        const bookingRef = `PC-${dateStr}-${randomStr}`;

        // Sanitize seats to ensure they match schema
        const sanitizedSeats = seats.map(s => ({
            id: s.id,
            row: s.row,
            number: s.number,
            type: s.type,
            price: s.price
        }));

        // Create booking
        const booking = await Booking.create({
            bookingRef, // Explicitly set required field
            user: user._id,
            firebaseUid,
            movie: {
                id: showtime.movie._id,
                title: showtime.movie.title,
                posterUrl: showtime.movie.posterUrl
            },
            showtime: {
                id: showtime._id,
                date: showtime.date,
                startTime: showtime.startTime,
                cinema: showtime.cinema.name,
                hall: showtime.hall.name,
                hallType: showtime.hall.type
            },
            seats: sanitizedSeats,
            pricing: {
                subtotal,
                tax,
                serviceFee,
                total
            },
            contactEmail,
            contactPhone,
            status: 'confirmed', // Auto-confirm for demo
            payment: {
                status: 'completed',
                paidAt: new Date()
            }
        });

        // Book seats in showtime
        await showtime.bookSeats(seatIds);

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: booking
        });
    } catch (error) {
        console.error('Create booking error:', error);

        // Debug info
        const seatsType = Array.isArray(req.body.seats) ? 'Array' : typeof req.body.seats;
        const seatsContent = JSON.stringify(req.body.seats).substring(0, 50); // First 50 chars
        const debugMsg = `Seats type: ${seatsType}, Val: ${seatsContent}`;

        res.status(500).json({
            success: false,
            message: `Failed to create booking: ${error.message}. Debug: ${debugMsg}`,
            error: error.message
        });
    }
});

/**
 * GET /api/bookings/user
 * Get all bookings for current user
 */
router.get('/user', async (req, res) => {
    try {
        const { firebaseUid } = req.query;

        if (!firebaseUid) {
            return res.status(400).json({
                success: false,
                message: 'Firebase UID is required'
            });
        }

        const bookings = await Booking.find({ firebaseUid })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: bookings
        });
    } catch (error) {
        console.error('Get user bookings error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch bookings',
            error: error.message
        });
    }
});

/**
 * GET /api/bookings/:id
 * Get single booking by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        res.json({
            success: true,
            data: booking
        });
    } catch (error) {
        console.error('Get booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch booking',
            error: error.message
        });
    }
});

/**
 * GET /api/bookings/ref/:bookingRef
 * Get booking by reference number
 */
router.get('/ref/:bookingRef', async (req, res) => {
    try {
        const booking = await Booking.findOne({
            bookingRef: req.params.bookingRef
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        res.json({
            success: true,
            data: booking
        });
    } catch (error) {
        console.error('Get booking by ref error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch booking',
            error: error.message
        });
    }
});

/**
 * PUT /api/bookings/:id/confirm
 * Confirm booking after payment
 */
router.put('/:id/confirm', async (req, res) => {
    try {
        const { paymentIntentId } = req.body;

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        await booking.confirmBooking(paymentIntentId);

        res.json({
            success: true,
            message: 'Booking confirmed successfully',
            data: booking
        });
    } catch (error) {
        console.error('Confirm booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to confirm booking',
            error: error.message
        });
    }
});

/**
 * PUT /api/bookings/:id/cancel
 * Cancel a booking
 */
router.put('/:id/cancel', async (req, res) => {
    try {
        const { reason } = req.body;

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        if (booking.status === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Booking is already cancelled'
            });
        }

        // Check if cancellation is allowed (before showtime)
        const showtimeDate = new Date(booking.showtime.date);
        if (showtimeDate < new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Cannot cancel past bookings'
            });
        }

        await booking.cancelBooking(reason || 'User requested cancellation');

        res.json({
            success: true,
            message: 'Booking cancelled successfully',
            data: booking
        });
    } catch (error) {
        console.error('Cancel booking error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to cancel booking',
            error: error.message
        });
    }
});

module.exports = router;
