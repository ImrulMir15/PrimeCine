/**
 * Movies Page - Browse all movies
 * Shows Now Showing and Coming Soon sections
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlay, FiClock, FiStar, FiSearch, FiFilter } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { movieService } from '../services/api';

const Movies = () => {
    const [activeTab, setActiveTab] = useState('now-showing');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('all');
    const [loading, setLoading] = useState(true);
    const [nowShowingMovies, setNowShowingMovies] = useState([]);
    const [comingSoonMovies, setComingSoonMovies] = useState([]);
    const [error, setError] = useState(null);

    const genres = ['all', 'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'Sci-Fi', 'Thriller'];

    // Fetch movies from API
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Fetch both categories in parallel
                const [nowShowing, comingSoon] = await Promise.all([
                    movieService.getNowShowing(),
                    movieService.getComingSoon()
                ]);

                setNowShowingMovies(nowShowing.data || nowShowing);
                setComingSoonMovies(comingSoon.data || comingSoon);
            } catch (err) {
                console.error('Error fetching movies:', err);
                setError('Failed to load movies. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    // Format duration
    const formatDuration = (minutes) => {
        if (!minutes) return 'N/A';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    // Get movies for current tab
    const currentMovies = activeTab === 'now-showing' ? nowShowingMovies : comingSoonMovies;

    // Filter movies
    const filteredMovies = currentMovies.filter(movie => {
        const title = movie.title || '';
        const genre = Array.isArray(movie.genre) ? movie.genre : [];
        const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGenre = selectedGenre === 'all' || genre.includes(selectedGenre);
        return matchesSearch && matchesGenre;
    });

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-12">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-display font-bold gradient-text mb-4">
                        Explore Movies
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Discover the latest blockbusters and upcoming releases
                    </p>
                </div>

                {/* Search & Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search movies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors duration-300"
                        />
                    </div>

                    {/* Genre Filter */}
                    <div className="relative">
                        <FiFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <select
                            value={selectedGenre}
                            onChange={(e) => setSelectedGenre(e.target.value)}
                            className="w-full md:w-48 pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500 transition-colors duration-300 appearance-none cursor-pointer"
                        >
                            {genres.map((genre) => (
                                <option key={genre} value={genre} className="bg-gray-900">
                                    {genre === 'all' ? 'All Genres' : genre}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-12">
                    <div className="inline-flex p-1 rounded-xl glass-card">
                        <button
                            onClick={() => setActiveTab('now-showing')}
                            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                                activeTab === 'now-showing'
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            Now Showing
                        </button>
                        <button
                            onClick={() => setActiveTab('coming-soon')}
                            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                                activeTab === 'coming-soon'
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            Coming Soon
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center py-20">
                        <div className="loading-spinner w-12 h-12 border-4"></div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">⚠️</div>
                        <h3 className="text-xl font-semibold text-white mb-2">Error Loading Movies</h3>
                        <p className="text-gray-400">{error}</p>
                    </div>
                )}

                {/* Movies Grid */}
                {!loading && !error && filteredMovies.length > 0 && (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                    >
                        {filteredMovies.map((movie) => (
                            <motion.div
                                key={movie._id}
                                variants={itemVariants}
                            >
                                <Link
                                    to={`/movie/${movie._id}`}
                                    className="group block"
                                >
                                    <div className="relative overflow-hidden rounded-xl aspect-[2/3] mb-4">
                                        {/* Poster Image */}
                                        <img
                                            src={movie.posterUrl}
                                            alt={movie.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />

                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                        {/* Rating Badge */}
                                        {movie.rating > 0 && (
                                            <div className="absolute top-3 right-3 px-2 py-1 rounded-lg glass-card flex items-center space-x-1">
                                                <FiStar className="text-yellow-500 text-sm" />
                                                <span className="text-sm font-semibold">{movie.rating}</span>
                                            </div>
                                        )}

                                        {/* Coming Soon Badge */}
                                        {activeTab === 'coming-soon' && (
                                            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-purple-600/90 text-xs font-medium">
                                                {new Date(movie.releaseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </div>
                                        )}

                                        {/* Play Button Overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="w-16 h-16 rounded-full glass-card flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300">
                                                <FiPlay className="text-2xl text-purple-400 ml-1" />
                                            </div>
                                        </div>

                                        {/* Info Overlay */}
                                        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                            <div className="flex items-center space-x-3 text-sm text-gray-300">
                                                <span className="flex items-center space-x-1">
                                                    <FiClock className="text-purple-400" />
                                                    <span>{formatDuration(movie.duration)}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Movie Info */}
                                    <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors duration-300 mb-1 line-clamp-1">
                                        {movie.title}
                                    </h3>
                                    <p className="text-sm text-gray-400">
                                        {Array.isArray(movie.genre) ? movie.genre.slice(0, 2).join(' • ') : movie.genre}
                                    </p>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* Empty State */}
                {!loading && !error && filteredMovies.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🎬</div>
                        <h3 className="text-xl font-semibold text-white mb-2">No movies found</h3>
                        <p className="text-gray-400">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Movies;

