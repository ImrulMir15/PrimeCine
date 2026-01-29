/**
 * Showtime Model - MongoDB Schema for Movie Showtimes
 * 
 * Stores showtime information including
 * date, time, cinema, hall, and seat availability
 */

const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema({
    // Reference to movie
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
    },

    // Cinema/Location Info
    cinema: {
        name: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        address: String
    },

    // Hall/Screen Info
    hall: {
        name: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ['2D', '3D', 'IMAX', 'IMAX 3D', '4DX', 'Dolby Atmos', 'VIP'],
            default: '2D'
        },
        totalSeats: {
            type: Number,
            required: true
        },
        // Seat layout: rows x columns
        rows: {
            type: Number,
            default: 10
        },
        columns: {
            type: Number,
            default: 15
        }
    },

    // Date and Time
    date: {
        type: Date,
        required: true
    },

    startTime: {
        type: String, // "14:30" format
        required: true
    },

    endTime: {
        type: String
    },

    // Pricing (in cents to avoid floating point issues)
    pricing: {
        regular: {
            type: Number,
            required: true,
            default: 1000 // $10.00
        },
        premium: {
            type: Number,
            default: 1500 // $15.00 (middle rows)
        },
        vip: {
            type: Number,
            default: 2500 // $25.00 (back rows/recliners)
        }
    },

    // Booked seats array - stores seat IDs that are taken
    bookedSeats: [String],

    // Status
    status: {
        type: String,
        enum: ['scheduled', 'open', 'full', 'cancelled', 'completed'],
        default: 'scheduled'
    },

    // Auto-calculated available seats
    availableSeats: {
        type: Number,
        default: function () {
            return this.hall.totalSeats - this.bookedSeats.length;
        }
    }
}, {
    timestamps: true
});

// Indexes
showtimeSchema.index({ movie: 1, date: 1 });
showtimeSchema.index({ date: 1, startTime: 1 });
showtimeSchema.index({ 'cinema.name': 1 });
showtimeSchema.index({ status: 1 });

// Update available seats before saving
showtimeSchema.pre('save', async function () {
    this.availableSeats = this.hall.totalSeats - this.bookedSeats.length;

    // Update status if full
    if (this.availableSeats === 0) {
        this.status = 'full';
    }
});

// Method to check if seats are available
showtimeSchema.methods.checkSeatsAvailable = function (seatIds) {
    return seatIds.every(seat => !this.bookedSeats.includes(seat));
};

// Method to book seats
showtimeSchema.methods.bookSeats = function (seatIds) {
    if (!this.checkSeatsAvailable(seatIds)) {
        throw new Error('Some seats are already booked');
    }
    this.bookedSeats.push(...seatIds);
    return this.save();
};

// Method to release seats (for cancelled bookings)
showtimeSchema.methods.releaseSeats = function (seatIds) {
    this.bookedSeats = this.bookedSeats.filter(seat => !seatIds.includes(seat));
    this.status = 'open';
    return this.save();
};

// Generate seat layout with availability
showtimeSchema.methods.getSeatLayout = function () {
    const layout = [];
    const rowLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (let row = 0; row < this.hall.rows; row++) {
        const rowSeats = [];
        const rowLabel = rowLabels[row];

        for (let col = 1; col <= this.hall.columns; col++) {
            const seatId = `${rowLabel}${col}`;
            const isBooked = this.bookedSeats.includes(seatId);

            // Determine seat type based on row
            let seatType = 'regular';
            if (row >= this.hall.rows - 2) {
                seatType = 'vip'; // Last 2 rows are VIP
            } else if (row >= Math.floor(this.hall.rows / 2)) {
                seatType = 'premium'; // Middle rows are premium
            }

            rowSeats.push({
                id: seatId,
                row: rowLabel,
                number: col,
                type: seatType,
                price: this.pricing[seatType],
                isBooked
            });
        }

        layout.push({
            row: rowLabel,
            seats: rowSeats
        });
    }

    return layout;
};

module.exports = mongoose.model('Showtime', showtimeSchema);
