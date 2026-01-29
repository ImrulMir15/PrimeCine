/**
 * Movie Routes - Handle movie CRUD operations
 */

const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const isAdmin = require('../middleware/isAdmin');
const { upload } = require('../middleware/cloudinary');
const { logAdminAction } = require('../utils/auditLogger');

/**
 * GET /api/movies
 * Get all movies with optional filters
 */
router.get('/', async (req, res) => {
    try {
        const { status, genre, page = 1, limit = 10 } = req.query;

        const filter = {};
        if (status) filter.status = status;
        if (genre) filter.genre = { $in: [genre] };

        const movies = await Movie.find(filter)
            .sort({ releaseDate: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Movie.countDocuments(filter);

        res.json({
            success: true,
            data: movies,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Get movies error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch movies',
            error: error.message
        });
    }
});

/**
 * GET /api/movies/now-showing
 * Get movies currently in theaters
 */
router.get('/now-showing', async (req, res) => {
    try {
        const movies = await Movie.find({ status: 'now-showing' })
            .sort({ releaseDate: -1 });

        res.json({
            success: true,
            data: movies
        });
    } catch (error) {
        console.error('Get now showing error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch now showing movies',
            error: error.message
        });
    }
});

/**
 * GET /api/movies/coming-soon
 * Get upcoming movies
 */
router.get('/coming-soon', async (req, res) => {
    try {
        const movies = await Movie.find({ status: 'coming-soon' })
            .sort({ releaseDate: 1 });

        res.json({
            success: true,
            data: movies
        });
    } catch (error) {
        console.error('Get coming soon error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch coming soon movies',
            error: error.message
        });
    }
});

/**
 * GET /api/movies/featured
 * Get featured movies for homepage
 */
router.get('/featured', async (req, res) => {
    try {
        const movies = await Movie.find({
            isFeatured: true,
            status: { $in: ['now-showing', 'coming-soon'] }
        }).limit(5);

        res.json({
            success: true,
            data: movies
        });
    } catch (error) {
        console.error('Get featured error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch featured movies',
            error: error.message
        });
    }
});

/**
 * GET /api/movies/search
 * Search movies by title
 */
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const movies = await Movie.find({
            $text: { $search: q }
        }).limit(20);

        // If text search returns nothing, try regex
        if (movies.length === 0) {
            const regexMovies = await Movie.find({
                title: { $regex: q, $options: 'i' }
            }).limit(20);

            return res.json({
                success: true,
                data: regexMovies
            });
        }

        res.json({
            success: true,
            data: movies
        });
    } catch (error) {
        console.error('Search movies error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search movies',
            error: error.message
        });
    }
});

/**
 * GET /api/movies/:id
 * Get single movie by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);

        if (!movie) {
            return res.status(404).json({
                success: false,
                message: 'Movie not found'
            });
        }

        // Increment view count
        movie.viewCount += 1;
        await movie.save();

        res.json({
            success: true,
            data: movie
        });
    } catch (error) {
        console.error('Get movie error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch movie',
            error: error.message
        });
    }
});

/**
 * POST /api/movies
 * Create a new movie with poster upload (Admin only)
 */
router.post('/', isAdmin, upload.single('poster'), async (req, res) => {
    try {
        const movieData = { ...req.body };

        // Handle file upload
        if (req.file) {
            movieData.posterUrl = req.file.path;
        }

        // Parse genres and formats if sent as strings (important when using multipart/form-data)
        if (typeof movieData.genre === 'string') {
            try {
                movieData.genre = JSON.parse(movieData.genre);
            } catch (e) {
                movieData.genre = movieData.genre.split(',').map(g => g.trim());
            }
        }

        if (typeof movieData.formats === 'string') {
            try {
                movieData.formats = JSON.parse(movieData.formats);
            } catch (e) {
                movieData.formats = movieData.formats.split(',').map(f => f.trim());
            }
        }

        // Parse cast if sent as string
        if (typeof movieData.cast === 'string') {
            try {
                movieData.cast = JSON.parse(movieData.cast);
            } catch (e) {
                // Keep as is or handle error
            }
        }

        const movie = await Movie.create(movieData);

        // Audit Log
        await logAdminAction(req, {
            action: 'CREATE_MOVIE',
            resourceType: 'Movie',
            resourceId: movie._id,
            details: { title: movie.title }
        });

        res.status(201).json({
            success: true,
            message: 'Movie created successfully',
            data: movie
        });
    } catch (error) {
        console.error('Create movie error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create movie',
            error: error.message
        });
    }
});

/**
 * PUT /api/movies/:id
 * Update a movie with optional poster upload (Admin only)
 */
router.put('/:id', isAdmin, upload.single('poster'), async (req, res) => {
    try {
        const updateData = { ...req.body };

        // Handle file upload if present
        if (req.file) {
            updateData.posterUrl = req.file.path;
        }

        // Parse genres and formats if sent as strings
        if (typeof updateData.genre === 'string') {
            try {
                updateData.genre = JSON.parse(updateData.genre);
            } catch (e) {
                updateData.genre = updateData.genre.split(',').map(g => g.trim());
            }
        }

        if (typeof updateData.formats === 'string') {
            try {
                updateData.formats = JSON.parse(updateData.formats);
            } catch (e) {
                updateData.formats = updateData.formats.split(',').map(f => f.trim());
            }
        }

        // Parse cast if sent as string
        if (typeof updateData.cast === 'string') {
            try {
                updateData.cast = JSON.parse(updateData.cast);
            } catch (e) {
                // Keep as is or handle error
            }
        }

        const movie = await Movie.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!movie) {
            return res.status(404).json({
                success: false,
                message: 'Movie not found'
            });
        }

        // Audit Log
        await logAdminAction(req, {
            action: 'UPDATE_MOVIE',
            resourceType: 'Movie',
            resourceId: movie._id,
            details: { title: movie.title, changedFields: Object.keys(updateData) }
        });

        res.json({
            success: true,
            message: 'Movie updated successfully',
            data: movie
        });
    } catch (error) {
        console.error('Update movie error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update movie',
            error: error.message
        });
    }
});

/**
 * DELETE /api/movies/:id
 * Delete a movie (Admin only)
 */
router.delete('/:id', isAdmin, async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);

        if (!movie) {
            return res.status(404).json({
                success: false,
                message: 'Movie not found'
            });
        }

        // Audit Log
        await logAdminAction(req, {
            action: 'DELETE_MOVIE',
            resourceType: 'Movie',
            resourceId: movie._id,
            details: { title: movie.title }
        });

        res.json({
            success: true,
            message: 'Movie deleted successfully'
        });
    } catch (error) {
        console.error('Delete movie error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete movie',
            error: error.message
        });
    }
});

module.exports = router;
