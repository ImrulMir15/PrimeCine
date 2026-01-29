/**
 * Payment Model - MongoDB Schema for Payment Records
 * 
 * Stores payment transaction history
 * separate from bookings for better tracking
 */

const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    // Reference to booking
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    
    bookingRef: {
        type: String,
        required: true
    },
    
    // User info
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    firebaseUid: {
        type: String,
        required: true
    },
    
    // Amount in cents
    amount: {
        type: Number,
        required: true
    },
    
    currency: {
        type: String,
        default: 'usd'
    },
    
    // Stripe specific
    stripePaymentIntentId: {
        type: String,
        unique: true,
        sparse: true // Allows null/undefined
    },
    
    stripeChargeId: String,
    
    // Payment method details (from Stripe)
    paymentMethod: {
        type: {
            type: String,
            enum: ['card', 'cash', 'free'],
            default: 'card'
        },
        last4: String,
        brand: String,
        expMonth: Number,
        expYear: Number
    },
    
    // Status
    status: {
        type: String,
        enum: ['pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded'],
        default: 'pending'
    },
    
    // Refund info
    refund: {
        refundId: String,
        amount: Number,
        reason: String,
        refundedAt: Date
    },
    
    // Error info (if failed)
    error: {
        code: String,
        message: String
    },
    
    // Metadata
    metadata: {
        type: Map,
        of: String
    }
}, {
    timestamps: true
});

// Indexes
paymentSchema.index({ booking: 1 });
paymentSchema.index({ user: 1 });
paymentSchema.index({ firebaseUid: 1 });
paymentSchema.index({ stripePaymentIntentId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });

// Virtual for formatted amount
paymentSchema.virtual('formattedAmount').get(function() {
    return `$${(this.amount / 100).toFixed(2)}`;
});

module.exports = mongoose.model('Payment', paymentSchema);
