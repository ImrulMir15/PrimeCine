/**
 * Booking Page - Seat selection for movie tickets
 */

import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight, FiClock, FiCalendar, FiMapPin } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { movieService, showtimeService } from '../services/api';

const Booking = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [movie, setMovie] = useState(null);
    const [showtime, setShowtime] = useState(null);
    const [seatLayout, setSeatLayout] = useState(null);
    const [error, setError] = useState(null);

    // Seat layout configuration (fallback values)
    const rows = showtime?.hall?.rows || 10;
    const cols = showtime?.hall?.columns || 15;
    const rowLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    // Get booked seats from showtime data
    const bookedSeats = showtime?.bookedSeats || [];

    // Pricing from showtime data
    const pricing = showtime?.pricing || {
        regular: 1200,  // $12.00
        premium: 1500,  // $15.00
        vip: 2000       // $20.00
    };

    // Get seat type based on row
    const getSeatType = (rowIndex) => {
        if (rowIndex >= rows - 2) return 'vip';
        if (rowIndex >= Math.floor(rows / 2)) return 'premium';
        return 'regular';
    };

    // Get seat price based on type
    const getSeatPrice = (rowIndex) => {
        const type = getSeatType(rowIndex);
        return pricing[type];
    };

    // Toggle seat selection
    const toggleSeat = (seatId, rowIndex) => {
        if (bookedSeats.includes(seatId)) return;

        setSelectedSeats(prev => {
            if (prev.find(s => s.id === seatId)) {
                return prev.filter(s => s.id !== seatId);
            } else {
                if (prev.length >= 10) {
                    alert('Maximum 10 seats per booking');
                    return prev;
                }
                return [...prev, {
                    id: seatId,
                    row: rowLabels[rowIndex],
                    number: parseInt(seatId.slice(1)),
                    type: getSeatType(rowIndex),
                    price: getSeatPrice(rowIndex)
                }];
            }
        });
    };

    // Calculate total
    const total = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Proceed to checkout
    const handleContinue = () => {
        if (!isAuthenticated) {
            // Redirect to login with return URL
            navigate(`/login?redirect=/booking/${id}?date=${searchParams.get('date')}&time=${searchParams.get('time')}`);
            return;
        }

        if (selectedSeats.length === 0) {
            alert('Please select at least one seat');
            return;
        }

        // Store booking data in session storage
        sessionStorage.setItem('bookingData', JSON.stringify({
            movie,
            showtime,
            seats: selectedSeats,
            total
        }));

        navigate('/checkout');
    };


    useEffect(() => {
        const fetchBookingData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch movie details
                console.log('Fetching movie details for ID:', id);
                const movieResponse = await movieService.getById(id);
                const movieData = movieResponse.data || movieResponse;
                console.log('Movie data received:', movieData);
                setMovie(movieData);

                // Get showtime ID from search params or find matching showtime
                const showtimeId = searchParams.get('showtimeId');
                const date = searchParams.get('date');
                const time = searchParams.get('time');
                console.log('Showtime params:', { showtimeId, date, time });

                if (showtimeId) {
                    // If we have a showtime ID, fetch it directly
                    console.log('Fetching showtime by ID:', showtimeId);
                    const showtimeResponse = await showtimeService.getById(showtimeId);
                    const showtimeData = showtimeResponse.data || showtimeResponse;
                    console.log('Showtime data received:', showtimeData);
                    setShowtime(showtimeData);

                    // Fetch seat layout
                    console.log('Fetching seat layout for showtime:', showtimeId);
                    const seatsResponse = await showtimeService.getSeats(showtimeId);
                    const seatsData = seatsResponse.data || seatsResponse;
                    console.log('Seat layout received:', seatsData);
                    setSeatLayout(seatsData);
                } else if (date && time) {
                    // Otherwise, find the showtime by movie, date, and time
                    console.log('Fetching showtimes for movie:', id, 'date:', date);
                    const showtimesResponse = await showtimeService.getByMovie(id, date);
                    const showtimesData = showtimesResponse.data || showtimesResponse;
                    console.log('Showtimes received:', showtimesData);

                    // Find the matching showtime by time
                    const matchingShowtime = Array.isArray(showtimesData)
                        ? showtimesData.find(st => st.startTime === time)
                        : null;

                    if (matchingShowtime) {
                        console.log('Matching showtime found:', matchingShowtime);
                        setShowtime(matchingShowtime);

                        // Fetch seat layout
                        const seatsResponse = await showtimeService.getSeats(matchingShowtime._id);
                        const seatsData = seatsResponse.data || seatsResponse;
                        console.log('Seat layout received:', seatsData);
                        setSeatLayout(seatsData);
                    } else {
                        console.error('No matching showtime found for time:', time);
                        setError('Showtime not found');
                    }
                }
            } catch (err) {
                console.error('Error fetching booking data:', err);
                setError('Failed to load booking information');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchBookingData();
        }
    }, [id, searchParams]);



    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loading-spinner w-16 h-16"></div>
            </div>
        );
    }

    if (error || !movie || !showtime) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4 text-white">{error || 'Booking information not found'}</h1>
                    <Link to={`/movie/${id}`} className="btn-glow">Back to Movie</Link>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-32">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <Link
                        to={`/movie/${id}`}
                        className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300"
                    >
                        <FiArrowLeft />
                        <span>Back to Movie</span>
                    </Link>
                    <h1 className="text-2xl font-display font-bold gradient-text">
                        Select Your Seats
                    </h1>
                    <div className="w-32"></div>
                </div>

                {/* Movie & Showtime Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6 mb-8"
                >
                    <div className="flex flex-col md:flex-row gap-6">
                        <img
                            src={movie.posterUrl}
                            alt={movie.title}
                            className="w-24 h-36 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-white mb-2">{movie.title}</h2>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                                <div className="flex items-center space-x-2">
                                    <FiCalendar className="text-purple-400" />
                                    <span>{formatDate(showtime.date)}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <FiClock className="text-purple-400" />
                                    <span>{showtime.startTime}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <FiMapPin className="text-purple-400" />
                                    <span>{showtime.cinema?.name || 'PrimeCine'} • {showtime.hall?.name || 'Hall'}</span>
                                </div>
                            </div>
                            <div className="mt-3">
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-600/30 border border-purple-500/50">
                                    {showtime.hall?.type || '2D'}
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Screen */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center mb-8"
                >
                    <div className="relative w-full max-w-3xl mx-auto">
                        <div className="h-2 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full mb-2 shadow-lg shadow-purple-500/50"></div>
                        <div className="h-8 bg-gradient-to-b from-purple-500/20 to-transparent rounded-b-3xl"></div>
                        <p className="text-gray-400 text-sm mt-2">SCREEN</p>
                    </div>
                </motion.div>

                {/* Seat Map */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="overflow-x-auto custom-scrollbar pb-4 mb-8"
                >
                    <div className="min-w-max flex flex-col items-center gap-2">
                        {Array.from({ length: rows }, (_, rowIndex) => (
                            <div key={rowIndex} className="flex items-center gap-2">
                                {/* Row Label */}
                                <span className="w-6 text-center text-gray-400 text-sm font-medium">
                                    {rowLabels[rowIndex]}
                                </span>

                                {/* Seats */}
                                <div className="flex gap-1">
                                    {Array.from({ length: cols }, (_, colIndex) => {
                                        const seatId = `${rowLabels[rowIndex]}${colIndex + 1}`;
                                        const isBooked = bookedSeats.includes(seatId);
                                        const isSelected = selectedSeats.find(s => s.id === seatId);
                                        const seatType = getSeatType(rowIndex);

                                        // Add aisle gap
                                        const hasGap = colIndex === 2 || colIndex === cols - 3;

                                        return (
                                            <button
                                                key={seatId}
                                                onClick={() => toggleSeat(seatId, rowIndex)}
                                                disabled={isBooked}
                                                className={`
                                                    seat
                                                    ${hasGap ? 'mr-4' : ''}
                                                    ${isBooked
                                                        ? 'seat-booked'
                                                        : isSelected
                                                            ? 'seat-selected'
                                                            : 'seat-available'
                                                    }
                                                    ${seatType === 'vip' ? 'border-yellow-500/50' : ''}
                                                    ${seatType === 'premium' ? 'border-blue-500/50' : ''}
                                                `}
                                                title={`${seatId} - ${seatType} - $${(getSeatPrice(rowIndex) / 100).toFixed(2)}`}
                                            />
                                        );
                                    })}
                                </div>

                                {/* Row Label (right) */}
                                <span className="w-6 text-center text-gray-400 text-sm font-medium">
                                    {rowLabels[rowIndex]}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-6 mb-8">
                    <div className="flex items-center space-x-2">
                        <div className="seat seat-available !cursor-default"></div>
                        <span className="text-sm text-gray-400">Available</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="seat seat-selected !cursor-default"></div>
                        <span className="text-sm text-gray-400">Selected</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="seat seat-booked !cursor-default"></div>
                        <span className="text-sm text-gray-400">Booked</span>
                    </div>
                    <div className="h-6 w-px bg-gray-700"></div>
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded bg-gray-600 border-2 border-gray-500"></div>
                        <span className="text-sm text-gray-400">Regular - ${(pricing.regular / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded bg-gray-600 border-2 border-blue-500/50"></div>
                        <span className="text-sm text-gray-400">Premium - ${(pricing.premium / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded bg-gray-600 border-2 border-yellow-500/50"></div>
                        <span className="text-sm text-gray-400">VIP - ${(pricing.vip / 100).toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Bottom Bar - Fixed */}
            <div className="fixed bottom-0 left-0 right-0 bg-gray-950/95 backdrop-blur-lg border-t border-white/10 p-4">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Selected Seats Info */}
                    <div className="flex-1">
                        {selectedSeats.length > 0 ? (
                            <div>
                                <p className="text-sm text-gray-400 mb-1">Selected Seats</p>
                                <div className="flex flex-wrap gap-2">
                                    {selectedSeats.map(seat => (
                                        <span
                                            key={seat.id}
                                            className="px-3 py-1 rounded-full text-sm bg-purple-600/30 border border-purple-500/50"
                                        >
                                            {seat.id}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-400">Select seats to continue</p>
                        )}
                    </div>

                    {/* Total & Continue */}
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-sm text-gray-400">Total Amount</p>
                            <p className="text-2xl font-bold gradient-text">
                                ${(total / 100).toFixed(2)}
                            </p>
                        </div>
                        <button
                            onClick={handleContinue}
                            disabled={selectedSeats.length === 0}
                            className={`btn-glow flex items-center space-x-2 ${selectedSeats.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            <span>Continue</span>
                            <FiArrowRight />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Booking;
