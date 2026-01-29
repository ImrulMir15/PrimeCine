/**
 * Navbar Component - Navigation with auth state
 */

import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { MdLocalMovies } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Get auth state
    const { user, isAuthenticated, logout } = useAuth();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menus on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsProfileDropdownOpen(false);
    }, [location]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.profile-dropdown')) {
                setIsProfileDropdownOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Movies', path: '/movies' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    const isActive = (path) => location.pathname === path;

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'glass-card shadow-lg shadow-purple-500/10'
                : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="relative">
                            <MdLocalMovies className="text-4xl text-purple-500 group-hover:text-purple-400 transition-colors duration-300" />
                            <div className="absolute inset-0 blur-xl bg-purple-500/30 group-hover:bg-purple-400/40 transition-all duration-300" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-display font-bold gradient-text">
                                PrimeCine
                            </span>
                            <span className="text-[10px] text-gray-400 -mt-1 tracking-wider">
                                Premium Seats. Prime Moments
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`relative text-sm font-medium transition-colors duration-300 ${isActive(link.path)
                                    ? 'text-purple-400'
                                    : 'text-gray-300 hover:text-white'
                                    }`}
                            >
                                {link.name}
                                {isActive(link.path) && (
                                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Auth Section */}
                    <div className="hidden md:flex items-center space-x-4">
                        {isAuthenticated ? (
                            /* Logged In State */
                            <div className="relative profile-dropdown">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsProfileDropdownOpen(!isProfileDropdownOpen);
                                    }}
                                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors duration-300"
                                >
                                    {user?.photoURL ? (
                                        <img
                                            src={user.photoURL}
                                            alt={user.displayName}
                                            className="w-8 h-8 rounded-full border border-purple-500"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                                            <span className="text-sm font-medium text-white">
                                                {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                                            </span>
                                        </div>
                                    )}
                                    <span className="text-sm font-medium text-gray-300 max-w-[100px] truncate">
                                        {user?.displayName || 'User'}
                                    </span>
                                    <FiChevronDown className={`text-gray-400 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {isProfileDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 glass-card py-2 shadow-xl">
                                        <Link
                                            to="/profile"
                                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                                        >
                                            <FiUser />
                                            <span>My Profile</span>
                                        </Link>
                                        {user?.role === 'admin' && (
                                            <Link
                                                to="/admin"
                                                className="flex items-center space-x-2 px-4 py-2 text-sm text-purple-400 hover:bg-white/5 hover:text-purple-300 transition-colors"
                                            >
                                                <FiUser />
                                                <span>Admin Dashboard</span>
                                            </Link>
                                        )}
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-red-400 transition-colors"
                                        >
                                            <FiLogOut />
                                            <span>Sign Out</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Logged Out State */
                            <>
                                <Link
                                    to="/login"
                                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300"
                                >
                                    <FiUser className="text-lg" />
                                    <span>Login</span>
                                </Link>
                                <Link
                                    to="/register"
                                    className="btn-glow text-sm"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300"
                    >
                        {isMobileMenuOpen ? (
                            <FiX className="text-2xl" />
                        ) : (
                            <FiMenu className="text-2xl" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="glass-card mx-4 mb-4 p-4 space-y-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${isActive(link.path)
                                ? 'bg-purple-600/20 text-purple-400 neon-border'
                                : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}

                    <div className="pt-4 border-t border-white/10 space-y-2">
                        {isAuthenticated ? (
                            /* Mobile Logged In State */
                            <>
                                <div className="flex items-center space-x-3 px-4 py-3">
                                    {user?.photoURL ? (
                                        <img
                                            src={user.photoURL}
                                            alt={user.displayName}
                                            className="w-10 h-10 rounded-full border border-purple-500"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                                            <span className="text-lg font-medium text-white">
                                                {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                                            </span>
                                        </div>
                                    )}
                                    <div>
                                        <div className="text-sm font-medium text-white">{user?.displayName || 'User'}</div>
                                        <div className="text-xs text-gray-400 truncate max-w-[180px]">{user?.email}</div>
                                    </div>
                                </div>
                                <Link
                                    to="/profile"
                                    className="flex items-center space-x-2 w-full px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-all duration-300"
                                >
                                    <FiUser className="text-lg" />
                                    <span>My Profile</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2 w-full px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all duration-300"
                                >
                                    <FiLogOut className="text-lg" />
                                    <span>Sign Out</span>
                                </button>
                            </>
                        ) : (
                            /* Mobile Logged Out State */
                            <>
                                <Link
                                    to="/login"
                                    className="flex items-center justify-center space-x-2 w-full px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-all duration-300"
                                >
                                    <FiUser className="text-lg" />
                                    <span>Login</span>
                                </Link>
                                <Link
                                    to="/register"
                                    className="btn-glow w-full text-center text-sm"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
