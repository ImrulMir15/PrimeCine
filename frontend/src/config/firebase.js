/**
 * Firebase Configuration
 * 
 * SETUP INSTRUCTIONS FOR BEGINNERS:
 * 1. Go to https://console.firebase.google.com/
 * 2. Click "Create a project" (or select existing)
 * 3. Name it "PrimeCine" and continue
 * 4. Disable Google Analytics (optional) and create project
 * 5. Click the web icon (</>) to add a web app
 * 6. Register app with name "primecine-web"
 * 7. Copy the config values below
 * 8. Go to Authentication > Sign-in method
 * 9. Enable "Email/Password" and "Google" providers
 */

import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth';

// Firebase configuration - Replace with your own values!
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "your-api-key",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "your-project-id",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "your-sender-id",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

// Auth Functions
export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return { user: result.user, error: null };
    } catch (error) {
        console.error('Google Sign In Error:', error);
        return { user: null, error: error.message };
    }
};

export const signInWithEmail = async (email, password) => {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return { user: result.user, error: null };
    } catch (error) {
        console.error('Email Sign In Error:', error);
        return { user: null, error: getErrorMessage(error.code) };
    }
};

export const signUpWithEmail = async (email, password, displayName) => {
    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        // Update display name
        await updateProfile(result.user, { displayName });
        return { user: result.user, error: null };
    } catch (error) {
        console.error('Sign Up Error:', error);
        return { user: null, error: getErrorMessage(error.code) };
    }
};

export const logOut = async () => {
    try {
        await signOut(auth);
        return { error: null };
    } catch (error) {
        console.error('Sign Out Error:', error);
        return { error: error.message };
    }
};

// Helper function to get user-friendly error messages
const getErrorMessage = (errorCode) => {
    switch (errorCode) {
        case 'auth/email-already-in-use':
            return 'This email is already registered. Please login instead.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters.';
        case 'auth/user-not-found':
            return 'No account found with this email.';
        case 'auth/wrong-password':
            return 'Incorrect password. Please try again.';
        case 'auth/too-many-requests':
            return 'Too many failed attempts. Please try again later.';
        case 'auth/invalid-credential':
            return 'Invalid email or password.';
        default:
            return 'An error occurred. Please try again.';
    }
};

export { auth, onAuthStateChanged };
