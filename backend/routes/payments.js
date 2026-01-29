/**
 * Payment Routes - Handle Stripe payments
 * 
 * IMPORTANT: This uses Stripe TEST MODE only
 * Test card: 4242 4242 4242 4242
 */

const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

// Initialize Stripe with secret key (handle missing key gracefully)
const stripe = process.env.STRIPE_SECRET_KEY 
    ? require('stripe')(process.env.STRIPE_SECRET_KEY)
    : null;

/**
 * POST /api/payments/create-intent
 * Create a Stripe Payment Intent
 */
router.post('/create-intent', async (req, res) => {
    try {
        // Check if Stripe is configured
        if (!stripe) {
            return res.status(503).json({
                success: false,
                message: 'Payment service not configured. Please add STRIPE_SECRET_KEY to .env'
            });
        }

        const { bookingId, amount } = req.body;
        
        if (!bookingId || !amount) {
            return res.status(400).json({
                success: false,
                message: 'Booking ID and amount are required'
            });
        }
        
        // Verify booking exists
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }
        
        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, // Amount in cents
            currency: 'usd',
            metadata: {
                bookingId: bookingId,
                bookingRef: booking.bookingRef
            }
        });
        
        // Create payment record
        await Payment.create({
            booking: booking._id,
            bookingRef: booking.bookingRef,
            user: booking.user,
            firebaseUid: booking.firebaseUid,
            amount,
            stripePaymentIntentId: paymentIntent.id,
            status: 'pending'
        });
        
        res.json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });
    } catch (error) {
        console.error('Create payment intent error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create payment intent',
            error: error.message
        });
    }
});

/**
 * POST /api/payments/confirm
 * Confirm payment and update booking
 */
router.post('/confirm', async (req, res) => {
    try {
        const { paymentIntentId, bookingId } = req.body;
        
        if (!paymentIntentId || !bookingId) {
            return res.status(400).json({
                success: false,
                message: 'Payment intent ID and booking ID are required'
            });
        }
        
        // Verify payment with Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        
        if (paymentIntent.status !== 'succeeded') {
            return res.status(400).json({
                success: false,
                message: 'Payment not successful'
            });
        }
        
        // Update booking
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }
        
        await booking.confirmBooking(paymentIntentId);
        
        // Update payment record
        await Payment.findOneAndUpdate(
            { stripePaymentIntentId: paymentIntentId },
            {
                status: 'succeeded',
                paymentMethod: {
                    type: 'card',
                    last4: paymentIntent.payment_method_types?.[0] || 'card',
                    brand: 'card'
                }
            }
        );
        
        res.json({
            success: true,
            message: 'Payment confirmed successfully',
            data: {
                bookingRef: booking.bookingRef,
                status: booking.status
            }
        });
    } catch (error) {
        console.error('Confirm payment error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to confirm payment',
            error: error.message
        });
    }
});

/**
 * GET /api/payments/history
 * Get payment history for user
 */
router.get('/history', async (req, res) => {
    try {
        const { firebaseUid } = req.query;
        
        if (!firebaseUid) {
            return res.status(400).json({
                success: false,
                message: 'Firebase UID is required'
            });
        }
        
        const payments = await Payment.find({ firebaseUid })
            .populate('booking', 'bookingRef movie showtime')
            .sort({ createdAt: -1 });
        
        res.json({
            success: true,
            data: payments
        });
    } catch (error) {
        console.error('Get payment history error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch payment history',
            error: error.message
        });
    }
});

/**
 * POST /api/payments/webhook
 * Stripe webhook for handling events
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    let event;
    
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (error) {
        console.error('Webhook signature verification failed:', error.message);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }
    
    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log('Payment succeeded:', paymentIntent.id);
            // Update payment status (already handled in confirm endpoint)
            break;
            
        case 'payment_intent.payment_failed':
            const failedPayment = event.data.object;
            console.log('Payment failed:', failedPayment.id);
            await Payment.findOneAndUpdate(
                { stripePaymentIntentId: failedPayment.id },
                { 
                    status: 'failed',
                    error: {
                        code: failedPayment.last_payment_error?.code,
                        message: failedPayment.last_payment_error?.message
                    }
                }
            );
            break;
            
        default:
            console.log(`Unhandled event type: ${event.type}`);
    }
    
    res.json({ received: true });
});

module.exports = router;
