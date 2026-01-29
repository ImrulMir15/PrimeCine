/**
 * Booking Model - MongoDB Schema for Ticket Bookings
 * 
 * Stores booking information including
 * user, movie, showtime, seats, and payment status
 */

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    // Booking reference number (human-readable)
    bookingRef: {
        type: String,
        required: true,
        unique: true
    },

    // User who made the booking
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Firebase UID for direct lookup
    firebaseUid: {
        type: String,
        required: true
    },

    // Movie details (denormalized for quick access)
    movie: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Movie',
            required: true
        },
        title: String,
        posterUrl: String
    },

    // Showtime details
    showtime: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Showtime',
            required: true
        },
        date: Date,
        startTime: String,
        cinema: String,
        hall: String,
        hallType: String
    },

    // Booked seats - relaxed validation
    seats: [mongoose.Schema.Types.Mixed],

    // Pricing breakdown
    pricing: {
        subtotal: {
            type: Number,
            required: true
        },
        tax: {
            type: Number,
            default: 0
        },
        serviceFee: {
            type: Number,
            default: 0
        },
        discount: {
            type: Number,
            default: 0
        },
        total: {
            type: Number,
            required: true
        }
    },

    // Payment info
    payment: {
        method: {
            type: String,
            enum: ['stripe', 'cash', 'free'],
            default: 'stripe'
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'pending'
        },
        stripePaymentIntentId: String,
        paidAt: Date
    },

    // Booking status
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed', 'expired'],
        default: 'pending'
    },

    // Contact info (for confirmation)
    contactEmail: {
        type: String,
        required: true
    },

    contactPhone: {
        type: String
    },

    // QR code for ticket (URL to QR image)
    qrCode: {
        type: String
    },

    // Cancellation info
    cancelledAt: Date,
    cancellationReason: String,

    // Expiry for unpaid bookings (15 minutes)
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
    }
}, {
    timestamps: true
});

// Indexes
bookingSchema.index({ bookingRef: 1 });
bookingSchema.index({ user: 1 });
bookingSchema.index({ firebaseUid: 1 });
bookingSchema.index({ 'showtime.id': 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ createdAt: -1 });

// Generate booking reference before saving
bookingSchema.pre('save', async function () {
    if (!this.bookingRef) {
        // Format: PC-YYYYMMDD-XXXXX (e.g., PC-20260121-A3B5C)
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const random = JSON.stringify(Math.random()).split('.')[1].substring(0, 5); // Simple random fallback
        this.bookingRef = `PC-${date}-${random}`;
    }
});

// Virtual for total seats count
bookingSchema.virtual('seatCount').get(function () {
    return this.seats.length;
});

// Method to confirm booking after payment
bookingSchema.methods.confirmBooking = function (paymentIntentId) {
    this.status = 'confirmed';
    this.payment.status = 'completed';
    this.payment.stripePaymentIntentId = paymentIntentId;
    this.payment.paidAt = new Date();
    this.expiresAt = null; // Remove expiry
    return this.save();
};

// Method to cancel booking
bookingSchema.methods.cancelBooking = async function (reason) {
    this.status = 'cancelled';
    this.cancelledAt = new Date();
    this.cancellationReason = reason;

    // Release seats in showtime
    const Showtime = mongoose.model('Showtime');
    const showtime = await Showtime.findById(this.showtime.id);
    if (showtime) {
        const seatIds = this.seats.map(s => s.id);
        await showtime.releaseSeats(seatIds);
    }

    return this.save();
};

module.exports = mongoose.model('Booking', bookingSchema);
