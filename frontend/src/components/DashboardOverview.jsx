import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiFilm, FiCalendar, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import { userService, movieService, bookingService } from '../services/api';

const DashboardOverview = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeMovies: 0,
        totalBookings: 0,
        totalRevenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [users, movies, bookings] = await Promise.all([
                    userService.getAllUsers(),
                    movieService.getAll({ limit: 100 }),
                    bookingService.getAll()
                ]);

                const usersData = users.data || users;
                const moviesData = movies.data || movies;
                const bookingsData = bookings.data || bookings;

                const revenue = bookingsData.reduce((acc, b) => b.status === 'confirmed' ? acc + ((b.pricing?.total || 0) / 100) : acc, 0);

                setStats({
                    totalUsers: usersData.length,
                    activeMovies: moviesData.length,
                    totalBookings: bookingsData.length,
                    totalRevenue: revenue
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        { label: 'Total Users', value: stats.totalUsers, icon: FiUsers, color: 'from-blue-500 to-indigo-600' },
        { label: 'Active Movies', value: stats.activeMovies, icon: FiFilm, color: 'from-purple-500 to-pink-600' },
        { label: 'Total Bookings', value: stats.totalBookings, icon: FiCalendar, color: 'from-amber-500 to-orange-600' },
        { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: FiDollarSign, color: 'from-emerald-500 to-teal-600' }
    ];

    if (loading) return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-white/5 animate-pulse rounded-2xl border border-white/10" />
            ))}
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-6 relative overflow-hidden group border border-white/10 rounded-2xl"
                    >
                        <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 group-hover:opacity-20 transition-all rounded-full blur-2xl`} />
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white">
                                <stat.icon className="text-xl" />
                            </div>
                            <div className="flex items-center text-xs text-green-400 font-medium">
                                <FiTrendingUp className="mr-1" />
                                +12%
                            </div>
                        </div>
                        <h3 className="text-gray-400 text-sm font-medium mb-1">{stat.label}</h3>
                        <p className="text-3xl font-bold text-white">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-6 border border-white/10 rounded-2xl h-80 flex items-center justify-center">
                    <p className="text-gray-500">Revenue Analytics Chart Placeholder</p>
                </div>
                <div className="glass-card p-6 border border-white/10 rounded-2xl h-80 flex items-center justify-center">
                    <p className="text-gray-500">Booking Activity Graph Placeholder</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
