import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Corrected import
import { useAuth } from '../context/AuthContext';
import { FiUsers, FiFilm, FiCalendar, FiLogOut, FiActivity } from 'react-icons/fi'; // Icons
import { motion } from 'framer-motion';
import MovieManager from '../components/MovieManager';
import UsersManager from '../components/UsersManager';
import BookingsManager from '../components/BookingsManager';
import DashboardOverview from '../components/DashboardOverview';

const AdminPanel = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const navigate = useNavigate();

    // Check admin status on mount
    useEffect(() => {
        if (user && user.role !== 'admin') {
            navigate('/');
        }
    }, [user, navigate]);

    if (!user || user.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                <p>Checking access privileges...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 flex bg-gray-950">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900/50 border-r border-white/10 hidden md:block fixed h-full">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                        <FiActivity className="text-purple-500" />
                        Admin Console
                    </h2>

                    <nav className="space-y-2">
                        {[
                            { id: 'dashboard', icon: FiActivity, label: 'Overview' },
                            { id: 'movies', icon: FiFilm, label: 'Movies' },
                            { id: 'users', icon: FiUsers, label: 'Users' },
                            { id: 'bookings', icon: FiCalendar, label: 'Bookings' },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === item.id
                                    ? 'bg-purple-600/20 text-purple-400 border border-purple-500/20'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <item.icon />
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </nav>

                    <div className="absolute bottom-8 left-6 right-6">
                        <button
                            onClick={() => logout()}
                            className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                            <FiLogOut />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8">
                <div className="max-w-6xl mx-auto">
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                        </h1>
                        <p className="text-gray-400">Welcome back, {user.displayName}</p>
                    </header>

                    {/* Dashboard Content */}
                    {activeTab === 'dashboard' && <DashboardOverview />}

                    {/* Movie Management */}
                    {activeTab === 'movies' && <MovieManager />}

                    {/* User Management */}
                    {activeTab === 'users' && <UsersManager />}

                    {/* Booking Management */}
                    {activeTab === 'bookings' && <BookingsManager />}

                </div>
            </main>
        </div>
    );
};

export default AdminPanel;
