const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    adminEmail: {
        type: String,
        required: true
    },
    action: {
        type: String, // e.g., 'CREATE_MOVIE', 'DELETE_BOOKING'
        required: true
    },
    resourceType: {
        type: String, // e.g., 'Movie', 'Booking', 'User'
        required: true
    },
    resourceId: {
        type: String
    },
    details: {
        type: mongoose.Schema.Types.Mixed // JSON details about the change
    },
    ipAddress: String,
    userAgent: String
}, {
    timestamps: { createdAt: true, updatedAt: false }
});

module.exports = mongoose.model('Audit', auditSchema);
