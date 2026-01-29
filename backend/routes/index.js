/**
 * Routes Index - Export all routes from one place
 */

const authRoutes = require('./auth');
const movieRoutes = require('./movies');
const showtimeRoutes = require('./showtimes');
const bookingRoutes = require('./bookings');
const paymentRoutes = require('./payments');
const userRoutes = require('./users');

module.exports = {
    authRoutes,
    movieRoutes,
    showtimeRoutes,
    bookingRoutes,
    paymentRoutes,
    userRoutes
};
