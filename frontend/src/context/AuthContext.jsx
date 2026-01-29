/**
 * AuthContext - Manages authentication state across the app
 * 
 * This context provides:
 * - Current user state
 * - Login/logout functions
 * - Loading state for auth operations
 */

import { createContext, useContext, useState, useEffect } from 'react';
import {
    auth,
    onAuthStateChanged,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    logOut
} from '../config/firebase';
import api from '../services/api';

// Create the context
const AuthContext = createContext(null);

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Listen to Firebase auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Initial basic user data
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName || 'User',
                    photoURL: firebaseUser.photoURL
                });

                // Sync with backend to get full profile (role) and JWT token
                try {
                    const response = await api.post('/auth/sync', {
                        firebaseUid: firebaseUser.uid,
                        email: firebaseUser.email,
                        displayName: firebaseUser.displayName,
                        photoURL: firebaseUser.photoURL
                    });

                    if (response.success) {
                        const backendUser = response.user;
                        const token = response.token;

                        // Store token for API interceptor
                        localStorage.setItem('authToken', token);

                        // Update user state with backend data (includes role)
                        setUser({
                            uid: firebaseUser.uid,
                            email: backendUser.email,
                            displayName: backendUser.displayName,
                            photoURL: backendUser.photoURL,
                            role: backendUser.role,
                            id: backendUser.id
                        });
                    }
                } catch (err) {
                    console.error('Backend sync failed:', err.message);
                }
            } else {
                // User is signed out
                setUser(null);
                localStorage.removeItem('authToken');
            }
            setLoading(false);
        });

        // Cleanup subscription
        return () => unsubscribe();
    }, []);

    // Google Sign In
    const loginWithGoogle = async () => {
        setError(null);
        setLoading(true);
        const result = await signInWithGoogle();
        if (result.error) {
            setError(result.error);
        }
        setLoading(false);
        return result;
    };

    // Email/Password Sign In
    const loginWithEmail = async (email, password) => {
        setError(null);
        setLoading(true);
        const result = await signInWithEmail(email, password);
        if (result.error) {
            setError(result.error);
        }
        setLoading(false);
        return result;
    };

    // Email/Password Sign Up
    const registerWithEmail = async (email, password, displayName) => {
        setError(null);
        setLoading(true);
        const result = await signUpWithEmail(email, password, displayName);
        if (result.error) {
            setError(result.error);
        }
        setLoading(false);
        return result;
    };

    // Sign Out
    const logout = async () => {
        setError(null);
        const result = await logOut();
        if (result.error) {
            setError(result.error);
        }
        return result;
    };

    // Clear error
    const clearError = () => setError(null);

    // Context value
    const value = {
        user,
        loading,
        error,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        logout,
        clearError,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
