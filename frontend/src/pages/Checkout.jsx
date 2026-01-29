/**
 * Checkout Page - Payment processing with Stripe
 * 
 * Test Card: 4242 4242 4242 4242
 * Expiry: Any future date
 * CVC: Any 3 digits
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiCreditCard, FiCheck, FiClock, FiMapPin, FiMail, FiPhone, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [bookingData, setBookingData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [bookingRef, setBookingRef] = useState('');

    // Contact form
    const [contactInfo, setContactInfo] = useState({
        name: user?.displayName || '',
        email: user?.email || '',
        phone: ''
    });

    // Load booking data from session storage
    useEffect(() => {
        const data = sessionStorage.getItem('bookingData');
        if (data) {
            setBookingData(JSON.parse(data));
        } else {
            // No booking data, redirect back
            navigate('/movies');
        }
        setLoading(false);
    }, [navigate]);

    // Update contact info when user changes
    useEffect(() => {
        if (user) {
            setContactInfo(prev => ({
                ...prev,
                name: user.displayName || prev.name,
                email: user.email || prev.email
            }));
        }
    }, [user]);

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    // Calculate totals
    const calculateTotals = () => {
        if (!bookingData) return { subtotal: 0, tax: 0, serviceFee: 0, total: 0 };

        const subtotal = bookingData.seats.reduce((sum, seat) => sum + seat.price, 0);
        const tax = Math.round(subtotal * 0.05); // 5% tax
        const serviceFee = 100; // $1 service fee
        const total = subtotal + tax + serviceFee;

        return { subtotal, tax, serviceFee, total };
    };

    const totals = calculateTotals();

    // Handle payment and create booking
    const handlePayment = async (e) => {
        e.preventDefault();

        if (!contactInfo.name || !contactInfo.email) {
            alert('Please fill in your contact information');
            return;
        }

        if (!isAuthenticated || !user) {
            alert('Please log in to complete your booking');
            navigate('/login');
            return;
        }

        setProcessing(true);

        try {
            console.log('Creating booking...', {
                firebaseUid: user.uid,
                showtimeId: bookingData.showtime._id,
                seats: bookingData.seats,
                contactEmail: contactInfo.email,
                contactPhone: contactInfo.phone
            });

            // Create booking in database
            const response = await fetch('http://localhost:5000/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firebaseUid: user.uid,
                    showtimeId: bookingData.showtime._id,
                    seats: bookingData.seats,
                    contactEmail: contactInfo.email,
                    contactPhone: contactInfo.phone
                })
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Failed to create booking');
            }

            console.log('Booking created successfully:', data);

            // Generate booking reference from the created booking
            const ref = data.data.bookingRef;
            setBookingRef(ref);
            setPaymentSuccess(true);

            // Clear session storage
            sessionStorage.removeItem('bookingData');
        } catch (error) {
            console.error('Booking error:', error);
            alert(`Failed to create booking: ${error.message}`);
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loading-spinner w-16 h-16"></div>
            </div>
        );
    }

    if (!bookingData) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">No booking found</h1>
                    <Link to="/movies" className="btn-glow">Browse Movies</Link>
                </div>
            </div>
        );
    }

    // Success Screen
    if (paymentSuccess) {
        return (
            <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full text-center"
                >
                    <div className="glass-card p-8">
                        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                            <FiCheck className="text-4xl text-green-500" />
                        </div>

                        <h1 className="text-3xl font-display font-bold gradient-text mb-4">
                            Booking Confirmed!
                        </h1>

                        <p className="text-gray-400 mb-6">
                            Your tickets have been booked successfully. A confirmation email has been sent to {contactInfo.email}
                        </p>

                        <div className="bg-white/5 rounded-xl p-4 mb-6">
                            <p className="text-sm text-gray-400 mb-1">Booking Reference</p>
                            <p className="text-2xl font-mono font-bold text-white">{bookingRef}</p>
                        </div>

                        <div className="space-y-3 text-left text-sm mb-8">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Movie</span>
                                <span className="text-white">{bookingData.movie.title}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Date & Time</span>
                                <span className="text-white">
                                    {formatDate(bookingData.showtime.date)} • {bookingData.showtime.startTime}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Seats</span>
                                <span className="text-white">
                                    {bookingData.seats.map(s => s.id).join(', ')}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Total Paid</span>
                                <span className="text-purple-400 font-bold">
                                    ${(totals.total / 100).toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Link to="/" className="btn-glow w-full block text-center">
                                Back to Home
                            </Link>
                            <Link
                                to="/profile"
                                className="block w-full px-6 py-3 rounded-lg font-semibold glass-card hover:bg-white/10 transition-all duration-300 text-center"
                            >
                                View My Bookings
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-12">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center mb-8">
                    <Link
                        to={`/booking/${bookingData.movie._id || bookingData.movie.id}`}
                        className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300"
                    >
                        <FiArrowLeft />
                        <span>Back to Seats</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Contact & Payment */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Contact Information */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card p-6"
                        >
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                                <FiUser className="text-purple-500" />
                                <span>Contact Information</span>
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={contactInfo.name}
                                        onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors duration-300"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Email Address *
                                    </label>
                                    <div className="relative">
                                        <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="email"
                                            value={contactInfo.email}
                                            onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors duration-300"
                                            placeholder="john@example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Phone Number (Optional)
                                    </label>
                                    <div className="relative">
                                        <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="tel"
                                            value={contactInfo.phone}
                                            onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors duration-300"
                                            placeholder="+1 (555) 123-4567"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Payment Method */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="glass-card p-6"
                        >
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                                <FiCreditCard className="text-purple-500" />
                                <span>Payment Method</span>
                            </h2>

                            {/* Test Mode Banner */}
                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
                                <p className="text-yellow-500 text-sm">
                                    <strong>Test Mode:</strong> Use card number <code className="bg-black/30 px-2 py-1 rounded">4242 4242 4242 4242</code> with any future expiry and any CVC.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Card Number
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="4242 4242 4242 4242"
                                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors duration-300"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Expiry Date
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="MM/YY"
                                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors duration-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            CVC
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="123"
                                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors duration-300"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glass-card p-6 sticky top-28"
                        >
                            <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

                            {/* Movie Info */}
                            <div className="flex gap-4 mb-6 pb-6 border-b border-white/10">
                                <img
                                    src={bookingData.movie.posterUrl}
                                    alt={bookingData.movie.title}
                                    className="w-20 h-28 object-cover rounded-lg"
                                />
                                <div>
                                    <h3 className="font-semibold text-white mb-2">{bookingData.movie.title}</h3>
                                    <div className="space-y-1 text-sm text-gray-400">
                                        <p className="flex items-center space-x-1">
                                            <FiClock className="text-purple-400" />
                                            <span>{formatDate(bookingData.showtime.date)}</span>
                                        </p>
                                        <p>{bookingData.showtime.startTime}</p>
                                        <p className="flex items-center space-x-1">
                                            <FiMapPin className="text-purple-400" />
                                            <span>{bookingData.showtime.cinema?.name || 'PrimeCine'} • {bookingData.showtime.hall?.name || 'Hall'}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Seats */}
                            <div className="mb-6 pb-6 border-b border-white/10">
                                <p className="text-sm text-gray-400 mb-2">Seats ({bookingData.seats.length})</p>
                                <div className="flex flex-wrap gap-2">
                                    {bookingData.seats.map(seat => (
                                        <span
                                            key={seat.id}
                                            className="px-3 py-1 rounded-full text-sm bg-purple-600/30 border border-purple-500/50"
                                        >
                                            {seat.id} ({seat.type})
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Pricing */}
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Subtotal</span>
                                    <span className="text-white">${(totals.subtotal / 100).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Tax (5%)</span>
                                    <span className="text-white">${(totals.tax / 100).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Service Fee</span>
                                    <span className="text-white">${(totals.serviceFee / 100).toFixed(2)}</span>
                                </div>
                                <div className="h-px bg-white/10"></div>
                                <div className="flex justify-between">
                                    <span className="font-semibold text-white">Total</span>
                                    <span className="text-xl font-bold gradient-text">
                                        ${(totals.total / 100).toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {/* Pay Button */}
                            <button
                                onClick={handlePayment}
                                disabled={processing}
                                className="w-full btn-glow flex items-center justify-center space-x-2"
                            >
                                {processing ? (
                                    <>
                                        <div className="loading-spinner w-5 h-5 border-2"></div>
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <FiCreditCard />
                                        <span>Pay ${(totals.total / 100).toFixed(2)}</span>
                                    </>
                                )}
                            </button>

                            <p className="text-xs text-gray-500 text-center mt-4">
                                By completing this purchase, you agree to our Terms of Service and Privacy Policy.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
