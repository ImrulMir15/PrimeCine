/**
 * Movie Model - MongoDB Schema for Movies
 * 
 * Stores all movie information including
 * details, cast, ratings, and status
 */

const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    // Basic Info
    title: {
        type: String,
        required: true,
        trim: true
    },
    
    tagline: {
        type: String,
        trim: true
    },
    
    description: {
        type: String,
        required: true
    },
    
    // Media
    posterUrl: {
        type: String,
        required: true
    },
    
    bannerUrl: {
        type: String
    },
    
    trailerUrl: {
        type: String
    },
    
    // Movie Details
    genre: [{
        type: String,
        required: true
    }],
    
    duration: {
        type: Number, // in minutes
        required: true
    },
    
    language: {
        type: String,
        default: 'English'
    },
    
    subtitles: [{
        type: String
    }],
    
    // Cast & Crew
    director: {
        type: String,
        required: true
    },
    
    cast: [{
        name: String,
        role: String,
        photoUrl: String
    }],
    
    // Ratings
    rating: {
        type: Number,
        min: 0,
        max: 10,
        default: 0
    },
    
    ageRating: {
        type: String,
        enum: ['G', 'PG', 'PG-13', 'R', 'NC-17', 'U', 'UA', 'A'],
        default: 'PG-13'
    },
    
    // Release Info
    releaseDate: {
        type: Date,
        required: true
    },
    
    endDate: {
        type: Date
    },
    
    // Status
    status: {
        type: String,
        enum: ['coming-soon', 'now-showing', 'ended'],
        default: 'coming-soon'
    },
    
    // Formats available
    formats: [{
        type: String,
        enum: ['2D', '3D', 'IMAX', 'IMAX 3D', '4DX', 'Dolby Atmos', 'VIP'],
        default: ['2D']
    }],
    
    // Featured on homepage
    isFeatured: {
        type: Boolean,
        default: false
    },
    
    // View count for popularity
    viewCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Indexes for faster queries
movieSchema.index({ status: 1 });
movieSchema.index({ releaseDate: -1 });
movieSchema.index({ genre: 1 });
movieSchema.index({ title: 'text', description: 'text' }); // Text search

// Virtual for formatted duration
movieSchema.virtual('formattedDuration').get(function() {
    const hours = Math.floor(this.duration / 60);
    const minutes = this.duration % 60;
    return `${hours}h ${minutes}m`;
});

// Update status based on dates
movieSchema.methods.updateStatus = function() {
    const now = new Date();
    if (this.releaseDate > now) {
        this.status = 'coming-soon';
    } else if (this.endDate && this.endDate < now) {
        this.status = 'ended';
    } else {
        this.status = 'now-showing';
    }
    return this.save();
};

module.exports = mongoose.model('Movie', movieSchema);
