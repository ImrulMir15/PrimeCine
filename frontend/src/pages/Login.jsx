/**
 * Login Page - User authentication with Firebase
 */

import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [formError, setFormError] = useState('');
    
    const { loginWithEmail, loginWithGoogle, loading, error, isAuthenticated, clearError } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get('redirect') || '/';

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate(redirect);
        }
    }, [isAuthenticated, navigate, redirect]);

    // Clear errors on unmount
    useEffect(() => {
        return () => clearError();
    }, [clearError]);

    // Handle email/password login
    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setFormError('');

        if (!email || !password) {
            setFormError('Please fill in all fields');
            return;
        }

        const result = await loginWithEmail(email, password);
        if (result.user) {
            navigate(redirect);
        }
    };

    // Handle Google login
    const handleGoogleLogin = async () => {
        const result = await loginWithGoogle();
        if (result.user) {
            navigate(redirect);
        }
    };

    return (
        <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full space-y-8"
            >
                <div className="text-center">
                    <h1 className="text-4xl font-display font-bold gradient-text mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-gray-400">Sign in to your account</p>
                </div>

                <div className="glass-card p-8 space-y-6">
                    {/* Error Message */}
                    {(error || formError) && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center space-x-2 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400"
                        >
                            <FiAlertCircle className="flex-shrink-0" />
                            <span className="text-sm">{error || formError}</span>
                        </motion.div>
                    )}

                    {/* Google Sign In */}
                    <button 
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center space-x-3 px-6 py-3 rounded-lg border border-white/10 hover:bg-white/5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FcGoogle className="text-2xl" />
                        <span className="font-medium">Continue with Google</span>
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-gray-900/50 text-gray-400">Or continue with email</span>
                        </div>
                    </div>

                    {/* Email/Password Form */}
                    <form onSubmit={handleEmailLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors duration-300"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-12 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors duration-300"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                                >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 rounded border-white/10 bg-white/5 text-purple-600 focus:ring-purple-500"
                                />
                                <span className="text-sm text-gray-400">Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="text-sm text-purple-400 hover:text-purple-300 transition-colors duration-300">
                                Forgot password?
                            </Link>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full btn-glow disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center space-x-2">
                                    <div className="loading-spinner w-5 h-5 border-2"></div>
                                    <span>Signing in...</span>
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-400">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-300">
                            Sign up
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
