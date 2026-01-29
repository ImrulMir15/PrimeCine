import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiX, FiCheck } from 'react-icons/fi';
import { movieService } from '../services/api';
import ImageUpload from './ImageUpload';

const MovieManager = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentMovie, setCurrentMovie] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        tagline: '',
        genre: '',
        duration: '',
        status: 'now-showing',
        description: '',
        posterUrl: '',
        releaseDate: '',
        director: '',
        ageRating: 'PG-13',
        formats: '2D',
        cast: []
    });

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            const response = await movieService.getAll({ limit: 100 });
            setMovies(response.data || response);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching movies:', error);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (url) => {
        setFormData(prev => ({ ...prev, posterUrl: url }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Processing data for backend
            const dataToSubmit = {
                ...formData,
                genre: typeof formData.genre === 'string'
                    ? formData.genre.split(',').map(g => g.trim())
                    : formData.genre,
                formats: typeof formData.formats === 'string'
                    ? formData.formats.split(',').map(f => f.trim())
                    : formData.formats,
                duration: parseInt(formData.duration)
            };

            if (currentMovie) {
                await movieService.update(currentMovie._id, dataToSubmit);
            } else {
                await movieService.create(dataToSubmit);
            }

            fetchMovies();
            closeModal();
            // In a real app, use a toast here
        } catch (error) {
            console.error('Error saving movie:', error);
            alert('Failed to save movie: ' + (error.message || 'Unknown error'));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this movie? This action cannot be undone.')) {
            try {
                await movieService.delete(id);
                fetchMovies();
            } catch (error) {
                console.error('Error deleting movie:', error);
            }
        }
    };

    const openModal = (movie = null) => {
        if (movie) {
            setCurrentMovie(movie);
            setFormData({
                title: movie.title || '',
                tagline: movie.tagline || '',
                genre: Array.isArray(movie.genre) ? movie.genre.join(', ') : (movie.genre || ''),
                duration: movie.duration || '',
                status: movie.status || 'now-showing',
                description: movie.description || '',
                posterUrl: movie.posterUrl || '',
                releaseDate: movie.releaseDate ? new Date(movie.releaseDate).toISOString().split('T')[0] : '',
                director: movie.director || '',
                ageRating: movie.ageRating || 'PG-13',
                formats: Array.isArray(movie.formats) ? movie.formats.join(', ') : (movie.formats || '2D'),
                cast: movie.cast || []
            });
        } else {
            setCurrentMovie(null);
            setFormData({
                title: '',
                tagline: '',
                genre: '',
                duration: '',
                status: 'now-showing',
                description: '',
                posterUrl: '',
                releaseDate: '',
                director: '',
                ageRating: 'PG-13',
                formats: '2D',
                cast: []
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentMovie(null);
    };

    const filteredMovies = movies.filter(movie =>
        movie.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return (
        <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="relative w-full max-w-md">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search movies..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-all"
                    />
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-all font-bold shadow-lg shadow-purple-600/20 active:scale-95"
                >
                    <FiPlus />
                    <span>Add Movie</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMovies.map(movie => (
                    <motion.div
                        key={movie._id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card group relative flex flex-col bg-gray-900 border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all"
                    >
                        <div className="aspect-[2/3] relative overflow-hidden">
                            <img
                                src={movie.posterUrl}
                                alt={movie.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60" />

                            <div className="absolute top-4 left-4">
                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${movie.status === 'now-showing' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                                    } shadow-lg`}>
                                    {movie.status.replace('-', ' ')}
                                </span>
                            </div>

                            <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                                <button
                                    onClick={() => openModal(movie)}
                                    className="p-2 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-purple-600 transition-colors"
                                    title="Edit Movie"
                                >
                                    <FiEdit />
                                </button>
                                <button
                                    onClick={() => handleDelete(movie._id)}
                                    className="p-2 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-red-600 transition-colors"
                                    title="Delete Movie"
                                >
                                    <FiTrash2 />
                                </button>
                            </div>
                        </div>

                        <div className="p-4 flex-1">
                            <h3 className="font-bold text-white text-lg mb-1 line-clamp-1">{movie.title}</h3>
                            <div className="flex items-center text-xs text-gray-400 gap-2 mb-3">
                                <span>{movie.duration}m</span>
                                <span>•</span>
                                <span className="line-clamp-1">{Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}</span>
                            </div>
                            <div className="text-xs text-gray-500 line-clamp-2 italic">
                                {movie.tagline || 'No tagline provided'}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="bg-gray-900 border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl shadow-black/50"
                    >
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gray-950/50">
                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    {currentMovie ? 'Edit Movie' : 'Create New Movie'}
                                </h2>
                                <p className="text-sm text-gray-500">Fill in the details for catalog entry</p>
                            </div>
                            <button onClick={closeModal} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                                <FiX className="text-xl" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left: Poster Upload */}
                                <div className="space-y-4">
                                    <ImageUpload onUpload={handleImageUpload} label="Movie Poster" />
                                    <div className="p-4 bg-purple-500/5 border border-purple-500/10 rounded-xl">
                                        <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2">Poster Guidelines</h4>
                                        <ul className="text-[10px] text-gray-400 space-y-1">
                                            <li className="flex items-center gap-1"><FiCheck className="text-purple-500" /> Max size: 5MB</li>
                                            <li className="flex items-center gap-1"><FiCheck className="text-purple-500" /> Aspect ratio: 2:3</li>
                                            <li className="flex items-center gap-1"><FiCheck className="text-purple-500" /> Format: JPG, PNG, WEBP</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Right: All other fields */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Title</label>
                                            <input
                                                type="text"
                                                name="title"
                                                required
                                                value={formData.title}
                                                onChange={handleInputChange}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all"
                                                placeholder="e.g. Interstellar"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Tagline</label>
                                            <input
                                                type="text"
                                                name="tagline"
                                                value={formData.tagline}
                                                onChange={handleInputChange}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all"
                                                placeholder="The end of Earth is not the end of us"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Status</label>
                                            <select
                                                name="status"
                                                value={formData.status}
                                                onChange={handleInputChange}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all appearance-none"
                                            >
                                                <option value="now-showing">Now Showing</option>
                                                <option value="coming-soon">Coming Soon</option>
                                                <option value="ended">Ended</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Age Rating</label>
                                            <select
                                                name="ageRating"
                                                value={formData.ageRating}
                                                onChange={handleInputChange}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all appearance-none"
                                            >
                                                <option value="U">U (Universal)</option>
                                                <option value="UA">UA</option>
                                                <option value="A">A (Adult)</option>
                                                <option value="PG">PG</option>
                                                <option value="PG-13">PG-13</option>
                                                <option value="R">R</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Duration</label>
                                            <input
                                                type="number"
                                                name="duration"
                                                required
                                                value={formData.duration}
                                                onChange={handleInputChange}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all"
                                                placeholder="Minutes"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Release</label>
                                            <input
                                                type="date"
                                                name="releaseDate"
                                                required
                                                value={formData.releaseDate}
                                                onChange={handleInputChange}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Genre</label>
                                            <input
                                                type="text"
                                                name="genre"
                                                required
                                                placeholder="Action, Sci-Fi, etc."
                                                value={formData.genre}
                                                onChange={handleInputChange}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase ml-1">Director</label>
                                            <input
                                                type="text"
                                                name="director"
                                                required
                                                placeholder="Christopher Nolan"
                                                value={formData.director}
                                                onChange={handleInputChange}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Formats</label>
                                        <input
                                            type="text"
                                            name="formats"
                                            placeholder="2D, 3D, IMAX, 4DX"
                                            value={formData.formats}
                                            onChange={handleInputChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Description</label>
                                        <textarea
                                            name="description"
                                            rows="4"
                                            required
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all resize-none"
                                            placeholder="Write a brief synopsis of the movie..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4 pt-6 border-t border-white/5">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-8 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-12 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold shadow-xl shadow-purple-600/20 active:scale-95 transition-all"
                                >
                                    {currentMovie ? 'Save Changes' : 'Publish Movie'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default MovieManager;
