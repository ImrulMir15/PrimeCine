const Audit = require('../models/Audit');

/**
 * Log an admin action to the database
 * 
 * @param {Object} req - Express request object
 * @param {Object} options - Log details
 * @param {string} options.action - Action name (e.g. 'CREATE_MOVIE')
 * @param {string} options.resourceType - Resource type (e.g. 'Movie')
 * @param {string} options.resourceId - ID of the resource (optional)
 * @param {Object} options.details - Additional details (optional)
 */
const logAdminAction = async (req, options) => {
    try {
        // req.user should be populated by isAdmin or auth middleware
        // Our isAdmin middleware currently uses decoded user info from JWT
        const adminId = req.user?.id || req.user?._id;
        const adminEmail = req.user?.email;

        if (!adminId) {
            console.warn('⚠️ Attempted to log admin action without user context');
            return;
        }

        await Audit.create({
            adminId,
            adminEmail,
            action: options.action,
            resourceType: options.resourceType,
            resourceId: options.resourceId,
            details: options.details,
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.headers['user-agent']
        });
    } catch (error) {
        console.error('❌ Failed to log admin action:', error.message);
    }
};

module.exports = { logAdminAction };
