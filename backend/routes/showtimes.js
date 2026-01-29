/**
 * Showtime Routes - Handle showtime operations
 */

const express = require('express');
const router = express.Router();
const Showtime = require('../models/Showtime');

/**
 * GET /api/showtimes
 * Get all showtimes with optional filters
 */
router.get('/', async (req, res) => {
    try {
        const { date, cinema } = req.query;
        
        const filter = {};
        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            filter.date = { $gte: startOfDay, $lte: endOfDay };
        }
        if (cinema) filter['cinema.name'] = cinema;
        
        const showtimes = await Showtime.find(filter)
            .populate('movie', 'title posterUrl genre duration rating')
            .sort({ date: 1, startTime: 1 });
        
        res.json({
            success: true,
            data: showtimes
        });
    } catch (error) {
        console.error('Get showtimes error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch showtimes',
            error: error.message
        });
    }
});

/**
 * GET /api/showtimes/movie/:movieId
 * Get all showtimes for a specific movie
 */
router.get('/movie/:movieId', async (req, res) => {
    try {
        const { movieId } = req.params;
        const { date } = req.query;
        
        const filter = { movie: movieId };
        
        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            filter.date = { $gte: startOfDay, $lte: endOfDay };
        } else {
            // Default: show next 7 days
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const nextWeek = new Date(today);
            nextWeek.setDate(nextWeek.getDate() + 7);
            filter.date = { $gte: today, $lte: nextWeek };
        }
        
        // Only show showtimes that are not full or cancelled
        filter.status = { $in: ['scheduled', 'open'] };
        
        const showtimes = await Showtime.find(filter)
            .populate('movie', 'title posterUrl duration')
            .sort({ date: 1, startTime: 1 });
        
        // Group by date
        const groupedByDate = showtimes.reduce((acc, showtime) => {
            const dateKey = showtime.date.toISOString().split('T')[0];
            if (!acc[dateKey]) acc[dateKey] = [];
            acc[dateKey].push(showtime);
            return acc;
        }, {});
        
        res.json({
            success: true,
            data: showtimes,
            grouped: groupedByDate
        });
    } catch (error) {
        console.error('Get movie showtimes error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch showtimes',
            error: error.message
        });
    }
});

/**
 * GET /api/showtimes/:id
 * Get single showtime by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const showtime = await Showtime.findById(req.params.id)
            .populate('movie', 'title posterUrl genre duration rating director cast');
        
        if (!showtime) {
            return res.status(404).json({
                success: false,
                message: 'Showtime not found'
            });
        }
        
        res.json({
            success: true,
            data: showtime
        });
    } catch (error) {
        console.error('Get showtime error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch showtime',
            error: error.message
        });
    }
});

/**
 * GET /api/showtimes/:id/seats
 * Get seat layout for a showtime
 */
router.get('/:id/seats', async (req, res) => {
    try {
        const showtime = await Showtime.findById(req.params.id);
        
        if (!showtime) {
            return res.status(404).json({
                success: false,
                message: 'Showtime not found'
            });
        }
        
        const seatLayout = showtime.getSeatLayout();
        
        res.json({
            success: true,
            data: {
                showtimeId: showtime._id,
                hall: showtime.hall,
                pricing: showtime.pricing,
                bookedSeats: showtime.bookedSeats,
                availableSeats: showtime.availableSeats,
                layout: seatLayout
            }
        });
    } catch (error) {
        console.error('Get seats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch seat layout',
            error: error.message
        });
    }
});

/**
 * POST /api/showtimes
 * Create a new showtime (Admin only)
 */
router.post('/', async (req, res) => {
    try {
        const showtimeData = req.body;
        
        // Calculate total seats if not provided
        if (showtimeData.hall && !showtimeData.hall.totalSeats) {
            showtimeData.hall.totalSeats = showtimeData.hall.rows * showtimeData.hall.columns;
        }
        
        const showtime = await Showtime.create(showtimeData);
        
        res.status(201).json({
            success: true,
            message: 'Showtime created successfully',
            data: showtime
        });
    } catch (error) {
        console.error('Create showtime error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create showtime',
            error: error.message
        });
    }
});

/**
 * PUT /api/showtimes/:id
 * Update a showtime (Admin only)
 */
router.put('/:id', async (req, res) => {
    try {
        const showtime = await Showtime.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!showtime) {
            return res.status(404).json({
                success: false,
                message: 'Showtime not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Showtime updated successfully',
            data: showtime
        });
    } catch (error) {
        console.error('Update showtime error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update showtime',
            error: error.message
        });
    }
});

/**
 * DELETE /api/showtimes/:id
 * Delete a showtime (Admin only)
 */
router.delete('/:id', async (req, res) => {
    try {
        const showtime = await Showtime.findByIdAndDelete(req.params.id);
        
        if (!showtime) {
            return res.status(404).json({
                success: false,
                message: 'Showtime not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Showtime deleted successfully'
        });
    } catch (error) {
        console.error('Delete showtime error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete showtime',
            error: error.message
        });
    }
});

module.exports = router;
