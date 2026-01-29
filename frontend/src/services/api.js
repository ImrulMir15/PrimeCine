/**
 * API Service - Handles all HTTP requests to the backend
 * 
 * This service provides a centralized way to make API calls
 * with automatic error handling and base URL configuration.
 */

import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
    (config) => {
        // You can add auth token here if needed
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const message = error.response?.data?.message || error.message || 'Something went wrong';
        console.error('API Error:', message);
        return Promise.reject({ message, status: error.response?.status });
    }
);

// ============================================
// MOVIE ENDPOINTS
// ============================================

export const movieService = {
    // Get all movies (with optional filters)
    getAll: (params = {}) => api.get('/movies', { params }),

    // Get single movie by ID
    getById: (id) => api.get(`/movies/${id}`),

    // Get now showing movies
    getNowShowing: () => api.get('/movies/now-showing'),

    // Get coming soon movies
    getComingSoon: () => api.get('/movies/coming-soon'),

    // Search movies
    search: (query) => api.get('/movies/search', { params: { q: query } }),

    // Create movie (Admin)
    create: (data) => api.post('/movies', data),

    // Update movie (Admin)
    update: (id, data) => api.put(`/movies/${id}`, data),

    // Delete movie (Admin)
    delete: (id) => api.delete(`/movies/${id}`)
};

// ============================================
// SHOWTIME ENDPOINTS
// ============================================

export const showtimeService = {
    // Get all showtimes for a movie
    getByMovie: (movieId, date) => api.get(`/showtimes/movie/${movieId}`, { params: { date } }),

    // Get showtime by ID
    getById: (id) => api.get(`/showtimes/${id}`),

    // Get all showtimes by date
    getByDate: (date) => api.get('/showtimes', { params: { date } }),

    // Get available seats for a showtime
    getSeats: (showtimeId) => api.get(`/showtimes/${showtimeId}/seats`)
};

// ============================================
// BOOKING ENDPOINTS
// ============================================

export const bookingService = {
    // Create a new booking
    create: (bookingData) => api.post('/bookings', bookingData),

    // Get booking by ID
    getById: (id) => api.get(`/bookings/${id}`),

    // Get user's bookings
    getUserBookings: () => api.get('/bookings/user'),

    // Cancel a booking
    cancel: (id) => api.put(`/bookings/${id}/cancel`),

    // Get all bookings (Admin)
    getAll: (params = {}) => api.get('/bookings/all', { params })
};

// ============================================
// PAYMENT ENDPOINTS
// ============================================

export const paymentService = {
    // Create payment intent (Stripe)
    createIntent: (amount, bookingId) => api.post('/payments/create-intent', { amount, bookingId }),

    // Confirm payment
    confirm: (paymentIntentId, bookingId) => api.post('/payments/confirm', { paymentIntentId, bookingId }),

    // Get payment history
    getHistory: () => api.get('/payments/history')
};

// ============================================
// USER ENDPOINTS
// ============================================

export const userService = {
    // Get user profile
    getProfile: () => api.get('/users/profile'),

    // Update profile
    updateProfile: (data) => api.put('/users/profile', data),

    // Get booking history
    getBookingHistory: () => api.get('/users/bookings'),

    // Get all users (Admin)
    getAllUsers: (params = {}) => api.get('/users', { params })
};

// ============================================
// AUTH ENDPOINTS
// ============================================

export const authService = {
    // Sync Firebase user with backend
    sync: (userData) => api.post('/auth/sync', userData),

    // Register user in backend
    register: (userData) => api.post('/auth/register', userData)
};

export default api;
