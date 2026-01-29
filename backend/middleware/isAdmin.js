const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to check if user is authenticated and is an admin
 */
const isAdmin = async (req, res, next) => {
    try {
        // 1. Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No token provided, authorization denied'
            });
        }

        const token = authHeader.split(' ')[1];

        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Check if user exists and is admin
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
        }

        // 4. Attach user to request object
        req.user = user;
        next();

    } catch (error) {
        console.error('Admin auth error:', error.message);
        return res.status(401).json({
            success: false,
            message: 'Token is not valid'
        });
    }
};

module.exports = isAdmin;
