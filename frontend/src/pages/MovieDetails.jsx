/**
 * MovieDetails Page - Show movie information and showtimes
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiPlay, FiClock, FiStar, FiCalendar, FiUsers, FiFilm, FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { movieService, showtimeService } from '../services/api';

const MovieDetails = () => {
    const { id } = useParams();
    const [selectedDate, setSelectedDate] = useState(0);
    const [movie, setMovie] = useState(null);
    const [showtimes, setShowtimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return date;
    });

    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch movie details
                const movieResponse = await movieService.getById(id);
                const movieData = movieResponse.data || movieResponse;
                setMovie(movieData);

                // Fetch showtimes for selected date
                const dateParam = dates[selectedDate].toISOString();
                console.log('Fetching showtimes for movie:', id, 'date:', dateParam);
                const showtimeResponse = await showtimeService.getByMovie(id, dateParam);
                const showtimeData = showtimeResponse.data || showtimeResponse;
                console.log('Showtimes received:', showtimeData);
                setShowtimes(Array.isArray(showtimeData) ? showtimeData : []);
            } catch (err) {
                console.error('Error fetching movie data:', err);
                setError('Failed to load movie details');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchMovieData();
        }
    }, [id, selectedDate]);


    const formatDuration = (minutes) => {
        if (!minutes) return 'N/A';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <div className="loading-spinner w-16 h-16"></div>
            </div>
        );
    }

    if (error || !movie) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4 text-white">{error || 'Movie not found'}</h1>
                    <Link to="/movies" className="btn-glow">Back to Movies</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <section className="relative h-[70vh] overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={movie.bannerUrl || movie.posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-gray-950/40" />
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-transparent to-gray-950/60" />
                </div>

                <div className="absolute top-24 left-4 sm:left-8 z-10">
                    <Link
                        to="/movies"
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg glass-card hover:bg-white/10 transition-all duration-300"
                    >
                        <FiArrowLeft />
                        <span>Back to Movies</span>
                    </Link>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="hidden md:block w-64 flex-shrink-0"
                        >
                            <img
                                src={movie.posterUrl}
                                alt={movie.title}
                                className="w-full rounded-xl shadow-2xl shadow-purple-500/20"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex-1"
                        >
                            <div className="flex flex-wrap gap-2 mb-4">
                                {Array.isArray(movie.formats) && movie.formats.map((format) => (
                                    <span
                                        key={format}
                                        className="px-3 py-1 rounded-full text-xs font-medium bg-purple-600/30 border border-purple-500/50"
                                    >
                                        {format}
                                    </span>
                                ))}
                            </div>

                            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">
                                {movie.title}
                            </h1>

                            <p className="text-xl text-purple-300 mb-4">{movie.tagline}</p>

                            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300 mb-6">
                                <div className="flex items-center space-x-2">
                                    <FiStar className="text-yellow-500" />
                                    <span className="font-semibold">{movie.rating || 'N/A'}/10</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <FiClock className="text-purple-400" />
                                    <span>{formatDuration(movie.duration)}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <FiCalendar className="text-purple-400" />
                                    <span>{new Date(movie.releaseDate).toLocaleDateString()}</span>
                                </div>
                                <span className="px-2 py-1 rounded bg-gray-700 text-xs font-medium">
                                    {movie.ageRating || 'PG-13'}
                                </span>
                            </div>

                            <p className="text-gray-300 leading-relaxed max-w-2xl">
                                {movie.description}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1 space-y-6">
                            <div className="glass-card p-6">
                                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                                    <FiFilm className="text-purple-500" />
                                    <span>Genre</span>
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {Array.isArray(movie.genre) && movie.genre.map((g) => (
                                        <span key={g} className="px-3 py-1 rounded-full bg-white/5 text-sm">
                                            {g}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="glass-card p-6">
                                <h3 className="text-lg font-semibold mb-4">Director</h3>
                                <p className="text-gray-300">{movie.director || 'N/A'}</p>
                            </div>

                            {Array.isArray(movie.cast) && movie.cast.length > 0 && (
                                <div className="glass-card p-6">
                                    <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                                        <FiUsers className="text-purple-500" />
                                        <span>Cast</span>
                                    </h3>
                                    <div className="space-y-3">
                                        {movie.cast.map((actor, index) => (
                                            <div key={index} className="flex justify-between">
                                                <span className="text-white">{actor.name}</span>
                                                <span className="text-gray-400 text-sm">{actor.role}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="lg:col-span-2">
                            <div className="glass-card p-6">
                                <h2 className="text-2xl font-display font-bold gradient-text mb-6">
                                    Select Showtime
                                </h2>

                                <div className="flex overflow-x-auto space-x-3 pb-4 mb-6 custom-scrollbar">
                                    {dates.map((date, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedDate(index)}
                                            className={`flex-shrink-0 px-4 py-3 rounded-xl text-center transition-all duration-300 ${selectedDate === index
                                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                                : 'bg-white/5 hover:bg-white/10 text-gray-300'
                                                }`}
                                        >
                                            <div className="text-xs uppercase tracking-wider mb-1">
                                                {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                            </div>
                                            <div className="text-lg font-bold">
                                                {date.getDate()}
                                            </div>
                                            <div className="text-xs">
                                                {date.toLocaleDateString('en-US', { month: 'short' })}
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {showtimes.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {showtimes.map((showtime) => (
                                            <Link
                                                key={showtime._id}
                                                to={`/booking/${movie._id}?showtimeId=${showtime._id}&date=${showtime.date}&time=${showtime.startTime}`}
                                                className="group p-4 rounded-xl bg-white/5 hover:bg-purple-600/20 border border-white/10 hover:border-purple-500/50 transition-all duration-300"
                                            >
                                                <div className="text-xl font-bold text-white mb-1 group-hover:text-purple-300">
                                                    {showtime.startTime}
                                                </div>
                                                <div className="text-sm text-gray-400 mb-2">
                                                    {showtime.hall?.name || 'Hall'} • {showtime.hall?.type || '2D'}
                                                </div>
                                                <div className="text-sm font-semibold text-purple-400 mb-1">
                                                    ${((showtime.pricing?.regular || 1200) / 100).toFixed(2)}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {showtime.availableSeats || 0} seats available
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-400">
                                        No showtimes available for this date
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-white/10 text-sm text-gray-400">
                                    <div className="flex items-center space-x-2">
                                        <span className="w-3 h-3 rounded-full bg-green-500"></span>
                                        <span>Available</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                                        <span>Filling Fast</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="w-3 h-3 rounded-full bg-red-500"></span>
                                        <span>Almost Full</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default MovieDetails;

