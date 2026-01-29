/**
 * Models Index - Export all models from one place
 */

const User = require('./User');
const Movie = require('./Movie');
const Showtime = require('./Showtime');
const Booking = require('./Booking');
const Payment = require('./Payment');
const Audit = require('./Audit');

module.exports = {
    User,
    Movie,
    Showtime,
    Booking,
    Payment,
    Audit
};
