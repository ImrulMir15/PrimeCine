/**
 * Home Page - Landing page with hero carousel and movie listings
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlay, FiClock, FiStar, FiCalendar } from 'react-icons/fi';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { motion } from 'framer-motion';
import { movieService } from '../services/api';

const Home = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [featuredMovies, setFeaturedMovies] = useState([]);
    const [nowShowingMovies, setNowShowingMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch movies from API
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const [nowShowing] = await Promise.all([
                    movieService.getNowShowing()
                ]);

                const movies = nowShowing.data || nowShowing;
                
                // Set now showing movies (limit to 4)
                setNowShowingMovies(movies.slice(0, 4));
                
                // Set featured movies for hero slider
                const featured = movies.filter(m => m.isFeatured).slice(0, 3);
                if (featured.length > 0) {
                    setFeaturedMovies(featured);
                } else {
                    setFeaturedMovies(movies.slice(0, 3));
                }
            } catch (error) {
                console.error('Error fetching movies:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    // Fallback hero data if API hasn't loaded yet
    const heroMovies = featuredMovies.length > 0 ? featuredMovies.map(movie => ({
        id: movie._id,
        title: movie.title,
        tagline: movie.tagline || '',
        genre: Array.isArray(movie.genre) ? movie.genre.join(' • ') : movie.genre,
        rating: movie.rating || 0,
        duration: movie.duration ? `${Math.floor(movie.duration / 60)}h ${movie.duration % 60}m` : 'N/A',
        releaseDate: movie.releaseDate,
        description: movie.description,
        image: movie.bannerUrl || movie.posterUrl
    })) : [
        {
            id: '1',
            title: 'Cosmic Odyssey',
            tagline: 'Journey Beyond the Stars',
            genre: 'Sci-Fi • Adventure',
            rating: 8.5,
            duration: '2h 45m',
            releaseDate: '2026-02-15',
            description: 'An epic space adventure that takes you to the far reaches of the galaxy.',
            image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&h=600&fit=crop',
        },
        {
            id: '2',
            title: 'Neon Nights',
            tagline: 'The City Never Sleeps',
            genre: 'Action • Thriller',
            rating: 9.0,
            duration: '2h 15m',
            releaseDate: '2026-03-01',
            description: 'A high-octane thriller set in a cyberpunk metropolis.',
            image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&h=600&fit=crop',
        },
        {
            id: '3',
            title: 'Eternal Echo',
            tagline: 'Love Transcends Time',
            genre: 'Romance • Drama',
            rating: 8.8,
            duration: '2h 30m',
            releaseDate: '2026-02-28',
            description: 'A timeless love story that spans across decades.',
            image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&h=600&fit=crop',
        },
    ];

    // Auto-slide effect
    useEffect(() => {
        if (heroMovies.length <= 1) return;
        
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroMovies.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [heroMovies.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % heroMovies.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + heroMovies.length) % heroMovies.length);
    };

    const currentMovie = heroMovies[currentSlide];

    // Format duration helper
    const formatDuration = (minutes) => {
        if (!minutes) return 'N/A';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative h-screen overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                    <img
                        src={currentMovie.image}
                        alt={currentMovie.title}
                        className="w-full h-full object-cover transition-opacity duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/80 to-gray-950/40" />
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-transparent to-gray-950/60" />
                </div>

                {/* Hero Content */}
                <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
                    <div className="max-w-2xl space-y-6 animate-slide-up">
                        <div className="inline-block px-4 py-2 glass-card rounded-full">
                            <span className="text-sm font-medium gradient-text">
                                {currentMovie.genre}
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-display font-bold text-white leading-tight">
                            {currentMovie.title}
                        </h1>

                        <p className="text-xl md:text-2xl text-purple-300 font-medium">
                            {currentMovie.tagline}
                        </p>

                        <p className="text-lg text-gray-300 leading-relaxed">
                            {currentMovie.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
                            <div className="flex items-center space-x-2">
                                <FiStar className="text-yellow-500" />
                                <span className="font-semibold">{currentMovie.rating}/10</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <FiClock className="text-purple-400" />
                                <span>{currentMovie.duration}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <FiCalendar className="text-purple-400" />
                                <span>{new Date(currentMovie.releaseDate).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link
                                to={`/booking/${currentMovie.id}`}
                                className="btn-glow flex items-center space-x-2"
                            >
                                <FiPlay className="text-xl" />
                                <span>Book Tickets</span>
                            </Link>
                            <Link
                                to={`/movie/${currentMovie.id}`}
                                className="px-6 py-3 rounded-lg font-semibold glass-card hover:bg-white/10 transition-all duration-300"
                            >
                                More Info
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Slider Controls */}
                {heroMovies.length > 1 && (
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
                        <button
                            onClick={prevSlide}
                            className="w-12 h-12 rounded-full glass-card hover:bg-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110"
                        >
                            <MdChevronLeft className="text-2xl" />
                        </button>

                        <div className="flex space-x-2">
                            {heroMovies.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`h-1 rounded-full transition-all duration-300 ${index === currentSlide
                                            ? 'w-8 bg-purple-500'
                                            : 'w-4 bg-gray-600 hover:bg-gray-500'
                                        }`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={nextSlide}
                            className="w-12 h-12 rounded-full glass-card hover:bg-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110"
                        >
                            <MdChevronRight className="text-2xl" />
                        </button>
                    </div>
                )}
            </section>

            {/* Now Showing Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-4xl font-display font-bold gradient-text mb-2">
                                Now Showing
                            </h2>
                            <p className="text-gray-400">
                                Catch the latest blockbusters in theaters now
                            </p>
                        </div>
                        <Link
                            to="/movies"
                            className="px-6 py-3 rounded-lg glass-card hover:bg-white/10 transition-all duration-300 font-medium"
                        >
                            View All
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="aspect-[2/3] bg-white/5 animate-pulse rounded-xl" />
                            ))}
                        </div>
                    ) : nowShowingMovies.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {nowShowingMovies.map((movie) => (
                                <Link
                                    key={movie._id}
                                    to={`/movie/${movie._id}`}
                                    className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:scale-105"
                                >
                                    <div className="aspect-[2/3] overflow-hidden">
                                        <img
                                            src={movie.posterUrl}
                                            alt={movie.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                        <h3 className="text-lg font-bold text-white mb-1">
                                            {movie.title}
                                        </h3>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-300">
                                                {Array.isArray(movie.genre) ? movie.genre[0] : movie.genre}
                                            </span>
                                            <div className="flex items-center space-x-1">
                                                <FiStar className="text-yellow-500" />
                                                <span className="text-white font-semibold">{movie.rating || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="w-12 h-12 rounded-full glass-card flex items-center justify-center">
                                            <FiPlay className="text-xl text-purple-400" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-400">No movies currently showing</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Coming Soon Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-purple-950/10">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-4xl font-display font-bold gradient-text mb-4">
                        Coming Soon
                    </h2>
                    <p className="text-gray-400 mb-12">
                        Get ready for these upcoming blockbusters
                    </p>
                    <Link
                        to="/movies"
                        className="btn-glow inline-block"
                    >
                        Explore Upcoming Movies
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;

