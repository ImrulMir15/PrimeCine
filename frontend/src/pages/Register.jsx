/**
 * Register Page - User registration with Firebase
 */

import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiAlertCircle, FiCheck } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [formError, setFormError] = useState('');
    
    const { registerWithEmail, loginWithGoogle, loading, error, isAuthenticated, clearError } = useAuth();
    const navigate = useNavigate();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    // Clear errors on unmount
    useEffect(() => {
        return () => clearError();
    }, [clearError]);

    // Password validation
    const passwordChecks = {
        length: password.length >= 6,
        hasNumber: /\d/.test(password),
        hasLetter: /[a-zA-Z]/.test(password)
    };

    const isPasswordValid = passwordChecks.length && passwordChecks.hasNumber && passwordChecks.hasLetter;

    // Handle registration
    const handleRegister = async (e) => {
        e.preventDefault();
        setFormError('');

        if (!name || !email || !password) {
            setFormError('Please fill in all fields');
            return;
        }

        if (!isPasswordValid) {
            setFormError('Please meet all password requirements');
            return;
        }

        if (!agreedToTerms) {
            setFormError('Please agree to the Terms of Service');
            return;
        }

        const result = await registerWithEmail(email, password, name);
        if (result.user) {
            navigate('/');
        }
    };

    // Handle Google signup
    const handleGoogleSignup = async () => {
        const result = await loginWithGoogle();
        if (result.user) {
            navigate('/');
        }
    };

    return (
        <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full space-y-8"
            >
                <div className="text-center">
                    <h1 className="text-4xl font-display font-bold gradient-text mb-2">
                        Join PrimeCine
                    </h1>
                    <p className="text-gray-400">Create your account and start booking</p>
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

                    {/* Google Sign Up */}
                    <button 
                        onClick={handleGoogleSignup}
                        disabled={loading}
                        className="w-full flex items-center justify-center space-x-3 px-6 py-3 rounded-lg border border-white/10 hover:bg-white/5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FcGoogle className="text-2xl" />
                        <span className="font-medium">Sign up with Google</span>
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-gray-900/50 text-gray-400">Or sign up with email</span>
                        </div>
                    </div>

                    {/* Registration Form */}
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors duration-300"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

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
                            
                            {/* Password Requirements */}
                            {password && (
                                <div className="mt-2 space-y-1">
                                    <div className={`flex items-center space-x-2 text-xs ${passwordChecks.length ? 'text-green-400' : 'text-gray-500'}`}>
                                        <FiCheck className={passwordChecks.length ? 'opacity-100' : 'opacity-30'} />
                                        <span>At least 6 characters</span>
                                    </div>
                                    <div className={`flex items-center space-x-2 text-xs ${passwordChecks.hasLetter ? 'text-green-400' : 'text-gray-500'}`}>
                                        <FiCheck className={passwordChecks.hasLetter ? 'opacity-100' : 'opacity-30'} />
                                        <span>Contains a letter</span>
                                    </div>
                                    <div className={`flex items-center space-x-2 text-xs ${passwordChecks.hasNumber ? 'text-green-400' : 'text-gray-500'}`}>
                                        <FiCheck className={passwordChecks.hasNumber ? 'opacity-100' : 'opacity-30'} />
                                        <span>Contains a number</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex items-start space-x-2">
                            <input 
                                type="checkbox" 
                                checked={agreedToTerms}
                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                className="mt-1 w-4 h-4 rounded border-white/10 bg-white/5 text-purple-600 focus:ring-purple-500"
                            />
                            <span className="text-sm text-gray-400">
                                I agree to the{' '}
                                <Link to="/terms" className="text-purple-400 hover:text-purple-300">
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link to="/privacy" className="text-purple-400 hover:text-purple-300">
                                    Privacy Policy
                                </Link>
                            </span>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full btn-glow disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center space-x-2">
                                    <div className="loading-spinner w-5 h-5 border-2"></div>
                                    <span>Creating account...</span>
                                </span>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-300">
                            Sign in
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
