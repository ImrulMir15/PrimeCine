import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiFilm, FiUser, FiDollarSign, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';
import { bookingService } from '../services/api';

const BookingsManager = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 1
    });

    useEffect(() => {
        fetchBookings();
    }, [pagination.page]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await bookingService.getAll({
                page: pagination.page,
                limit: pagination.limit
            });
            setBookings(response.data || response);
            if (response.pagination) {
                setPagination(prev => ({ ...prev, ...response.pagination }));
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.pages) {
            setPagination(prev => ({ ...prev, page: newPage }));
        }
    };

    const filteredBookings = bookings.filter(booking =>
        booking.movie?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.contactEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.bookingRef?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusStyle = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-green-500/20 text-green-400 border-green-500/20';
            case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/20';
            case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/20';
        }
    };

    if (loading && bookings.length === 0) return (
        <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="relative w-full max-w-md">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by Movie, Email or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-all"
                    />
                </div>
                <div className="text-gray-400 text-sm">
                    Total Bookings: <span className="text-white font-bold">{pagination.total}</span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-gray-400 border-b border-white/10">
                            <th className="p-4">Booking Details</th>
                            <th className="p-4">Customer</th>
                            <th className="p-4">Showtime</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {filteredBookings.map((booking) => (
                            <motion.tr
                                key={booking._id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-gray-300 hover:bg-white/5 transition-colors text-sm"
                            >
                                <td className="p-4">
                                    <div className="flex items-start space-x-3">
                                        <div className="mt-1">
                                            <FiFilm className="text-purple-400" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-white text-base">{booking.movie?.title}</div>
                                            <div className="text-[10px] text-gray-500 font-mono">ID: {booking.bookingRef}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center space-x-2 text-gray-400">
                                        <FiUser className="scale-75" />
                                        <div>
                                            <div className="text-white">{booking.user?.displayName || 'Guest'}</div>
                                            <div className="text-xs text-gray-500">{booking.contactEmail}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-col">
                                        <span className="text-white font-medium">{new Date(booking.showtime?.date).toLocaleDateString()}</span>
                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                            <FiClock className="scale-75" /> {booking.showtime?.startTime}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-4 font-bold text-purple-400">
                                    <div className="flex items-center">
                                        <FiDollarSign className="scale-75" />
                                        {((booking.pricing?.total || 0) / 100).toFixed(2)}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusStyle(booking.status)}`}>
                                        {booking.status === 'confirmed' && <FiCheckCircle className="inline mr-1" />}
                                        {booking.status === 'cancelled' && <FiXCircle className="inline mr-1" />}
                                        {booking.status}
                                    </span>
                                </td>

                                <td className="p-4 text-right">
                                    <button className="text-purple-400 hover:text-purple-300 transition-colors">
                                        Manage
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
                {filteredBookings.length === 0 && !loading && (
                    <div className="py-12 text-center text-gray-500">
                        No bookings found matching your search.
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {
                pagination.pages > 1 && (
                    <div className="flex justify-center items-center space-x-4 pt-6">
                        <button
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={pagination.page === 1}
                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
                        >
                            Previous
                        </button>
                        <span className="text-gray-400 text-sm">
                            Page <span className="text-white font-bold">{pagination.page}</span> of {pagination.pages}
                        </span>
                        <button
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={pagination.page === pagination.pages}
                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
                        >
                            Next
                        </button>
                    </div>
                )
            }
        </div >
    );
};

export default BookingsManager;
