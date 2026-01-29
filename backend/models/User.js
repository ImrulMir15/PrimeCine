/**
 * User Model - MongoDB Schema for Users
 * 
 * Stores user information synced from Firebase Auth
 * plus additional profile data
 */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // Firebase UID for linking
    firebaseUid: {
        type: String,
        required: true,
        unique: true
    },
    
    // Basic Info
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    
    displayName: {
        type: String,
        required: true,
        trim: true
    },
    
    photoURL: {
        type: String,
        default: null
    },
    
    phone: {
        type: String,
        default: null
    },
    
    // Role for admin access
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    
    // Preferences
    preferences: {
        favoriteGenres: [String],
        preferredCinema: String,
        emailNotifications: {
            type: Boolean,
            default: true
        }
    },
    
    // Account status
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ firebaseUid: 1 });

module.exports = mongoose.model('User', userSchema);
