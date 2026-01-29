/**
 * Profile Page - User dashboard with booking history
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiCalendar, FiClock, FiMapPin, FiEdit2, FiLogOut, FiChevronRight } from 'react-icons/fi';
import { MdConfirmationNumber } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/api';

const Profile = () => {
    const { user, isAuthenticated, logout, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming');

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, authLoading, navigate]);

    // Fetch user's bookings
    useEffect(() => {
        const fetchBookings = async () => {
            if (!user) return;

            try {
                setLoading(true);
                console.log('Fetching bookings for user:', user.uid);

                const response = await fetch(`http://localhost:5000/api/bookings/user?firebaseUid=${user.uid}`);
                const data = await response.json();

                console.log('Bookings response:', data);

                if (data.success && data.data) {
                    setBookings(data.data);
                } else {
                    console.warn('No bookings found or error:', data.message);
                    setBookings([]);
                }
            } catch (error) {
                console.error('Failed to fetch bookings:', error);
                setBookings([]);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated && user) {
            fetchBookings();
        }
    }, [user, isAuthenticated]);

    // Mock bookings for demo
    const getMockBookings = () => [
        {
            _id: '1',
            confirmationCode: 'PC-ABC123',
            movie: { title: 'Dune: Part Two', posterUrl: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg' },
            showtime: { date: '2025-01-20', time: '7:30 PM', screen: 'IMAX Screen 1' },
            theater: { name: 'PrimeCine Downtown', location: 'New York, NY' },
            seats: ['F5', 'F6'],
            totalAmount: 35.99,
            status: 'confirmed',
            createdAt: new Date().toISOString()
        },
        {
            _id: '2',
            confirmationCode: 'PC-XYZ789',
            movie: { title: 'Avatar 3', posterUrl: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg' },
            showtime: { date: '2025-01-15', time: '3:00 PM', screen: 'Screen 4' },
            theater: { name: 'PrimeCine Mall', location: 'Los Angeles, CA' },
            seats: ['D10', 'D11', 'D12'],
            totalAmount: 47.99,
            status: 'completed',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        }
    ];

    // Filter bookings by status
    const upcomingBookings = bookings.filter(b =>
        b.status === 'confirmed' && new Date(b.showtime?.date) >= new Date()
    );
    const pastBookings = bookings.filter(b =>
        b.status === 'completed' || new Date(b.showtime?.date) < new Date()
    );

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    if (authLoading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <div className="loading-spinner w-12 h-12 border-4"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-12">
            <div className="max-w-6xl mx-auto">
                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-8 mb-8"
                >
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center space-x-6">
                            {/* Avatar */}
                            <div className="relative">
                                {user?.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt={user.displayName}
                                        className="w-20 h-20 rounded-full border-2 border-purple-500"
                                    />
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                                        <span className="text-2xl font-bold text-white">
                                            {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                                        </span>
                                    </div>
                                )}
                                <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors">
                                    <FiEdit2 className="w-3 h-3" />
                                </button>
                            </div>

                            {/* User Info */}
                            <div>
                                <h1 className="text-2xl font-display font-bold text-white mb-1">
                                    {user?.displayName || 'Movie Enthusiast'}
                                </h1>
                                <p className="text-gray-400 flex items-center space-x-2">
                                    <FiMail className="w-4 h-4" />
                                    <span>{user?.email}</span>
                                </p>
                                <p className="text-sm text-purple-400 mt-1">
                                    Member since {new Date(user?.metadata?.creationTime || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
                            >
                                <FiLogOut />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
                >
                    <div className="glass-card p-6 text-center">
                        <div className="text-3xl font-bold gradient-text mb-1">{bookings.length}</div>
                        <div className="text-gray-400 text-sm">Total Bookings</div>
                    </div>
                    <div className="glass-card p-6 text-center">
                        <div className="text-3xl font-bold gradient-text mb-1">{upcomingBookings.length}</div>
                        <div className="text-gray-400 text-sm">Upcoming Shows</div>
                    </div>
                    <div className="glass-card p-6 text-center">
                        <div className="text-3xl font-bold gradient-text mb-1">
                            ${(bookings.reduce((sum, b) => sum + ((b.pricing?.total || 0) / 100), 0)).toFixed(0)}
                        </div>
                        <div className="text-gray-400 text-sm">Total Spent</div>
                    </div>
                </motion.div>

                {/* Bookings Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-display font-bold text-white">My Bookings</h2>

                        {/* Tabs */}
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setActiveTab('upcoming')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'upcoming'
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-white/5 text-gray-400 hover:text-white'
                                    }`}
                            >
                                Upcoming ({upcomingBookings.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('past')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'past'
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-white/5 text-gray-400 hover:text-white'
                                    }`}
                            >
                                Past ({pastBookings.length})
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="loading-spinner w-8 h-8 border-2"></div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {(activeTab === 'upcoming' ? upcomingBookings : pastBookings).length === 0 ? (
                                <div className="glass-card p-12 text-center">
                                    <MdConfirmationNumber className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-white mb-2">
                                        No {activeTab} bookings
                                    </h3>
                                    <p className="text-gray-400 mb-6">
                                        {activeTab === 'upcoming'
                                            ? "You don't have any upcoming shows. Browse movies and book your next experience!"
                                            : "You haven't watched any movies with us yet."}
                                    </p>
                                    <Link to="/movies" className="btn-glow inline-block">
                                        Browse Movies
                                    </Link>
                                </div>
                            ) : (
                                (activeTab === 'upcoming' ? upcomingBookings : pastBookings).map((booking) => (
                                    <BookingCard key={booking._id} booking={booking} />
                                ))
                            )}
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

// Booking Card Component
const BookingCard = ({ booking }) => {
    const isPast = booking.status === 'completed' || new Date(booking.showtime?.date) < new Date();

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`glass-card overflow-hidden ${isPast ? 'opacity-75' : ''}`}
        >
            <div className="flex flex-col sm:flex-row">
                {/* Movie Poster */}
                <div className="sm:w-32 h-48 sm:h-auto flex-shrink-0">
                    <img
                        src={booking.movie?.posterUrl || 'https://via.placeholder.com/128x192?text=Movie'}
                        alt={booking.movie?.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Booking Details */}
                <div className="flex-1 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-white mb-2">
                                {booking.movie?.title}
                            </h3>

                            <div className="space-y-2 text-sm text-gray-400">
                                <div className="flex items-center space-x-2">
                                    <FiCalendar className="w-4 h-4" />
                                    <span>
                                        {new Date(booking.showtime?.date).toLocaleDateString('en-US', {
                                            weekday: 'short',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <FiClock className="w-4 h-4" />
                                    <span>{booking.showtime?.startTime} • {booking.showtime?.hallType || booking.showtime?.hall}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <FiMapPin className="w-4 h-4" />
                                    <span>{booking.showtime?.cinema}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <MdConfirmationNumber className="w-4 h-4" />
                                    <span>Seats: {booking.seats?.map(s => s.id).join(', ')}</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${booking.status === 'confirmed'
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-gray-500/20 text-gray-400'
                                }`}>
                                {booking.status === 'confirmed' ? 'Confirmed' : 'Completed'}
                            </div>
                            <div className="text-lg font-bold text-white">
                                ${((booking.pricing?.total || 0) / 100).toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-500 font-mono mt-1">
                                {booking.bookingRef}
                            </div>
                        </div>
                    </div>

                    {/* View Ticket Button */}
                    {booking.status === 'confirmed' && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                            <button className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors">
                                <span>View E-Ticket</span>
                                <FiChevronRight />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default Profile;
