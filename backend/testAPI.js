/**
 * API Test Script - Test backend endpoints
 * Run with: node testAPI.js
 */

const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testAPI() {
    console.log('🧪 Testing PrimeCine API Endpoints\n');

    try {
        // Test 1: Get all movies
        console.log('1️⃣ Testing GET /api/movies');
        const moviesResponse = await axios.get(`${API_URL}/movies`);
        const movies = moviesResponse.data.data || moviesResponse.data;
        console.log(`   ✅ Found ${movies.length} movies`);

        if (movies.length > 0) {
            const firstMovie = movies[0];
            console.log(`   📽️  First movie: ${firstMovie.title} (ID: ${firstMovie._id})\n`);

            // Test 2: Get movie by ID
            console.log(`2️⃣ Testing GET /api/movies/${firstMovie._id}`);
            const movieResponse = await axios.get(`${API_URL}/movies/${firstMovie._id}`);
            const movie = movieResponse.data.data || movieResponse.data;
            console.log(`   ✅ Movie details: ${movie.title}`);
            console.log(`   - Genre: ${movie.genre.join(', ')}`);
            console.log(`   - Duration: ${movie.duration} minutes`);
            console.log(`   - Status: ${movie.status}\n`);

            // Test 3: Get showtimes for this movie
            console.log(`3️⃣ Testing GET /api/showtimes/movie/${firstMovie._id}`);
            const showtimesResponse = await axios.get(`${API_URL}/showtimes/movie/${firstMovie._id}`);
            const showtimes = showtimesResponse.data.data || showtimesResponse.data;
            console.log(`   ✅ Found ${showtimes.length} showtimes`);

            if (showtimes.length > 0) {
                const firstShowtime = showtimes[0];
                console.log(`   🎬 First showtime:`);
                console.log(`      - ID: ${firstShowtime._id}`);
                console.log(`      - Date: ${new Date(firstShowtime.date).toLocaleDateString()}`);
                console.log(`      - Time: ${firstShowtime.startTime}`);
                console.log(`      - Hall: ${firstShowtime.hall.name} (${firstShowtime.hall.type})`);
                console.log(`      - Cinema: ${firstShowtime.cinema.name}`);
                console.log(`      - Available Seats: ${firstShowtime.availableSeats}/${firstShowtime.hall.totalSeats}`);
                console.log(`      - Price (Regular): $${(firstShowtime.pricing.regular / 100).toFixed(2)}\n`);

                // Test 4: Get seat layout for this showtime
                console.log(`4️⃣ Testing GET /api/showtimes/${firstShowtime._id}/seats`);
                const seatsResponse = await axios.get(`${API_URL}/showtimes/${firstShowtime._id}/seats`);
                const seatsData = seatsResponse.data.data || seatsResponse.data;
                console.log(`   ✅ Seat layout retrieved`);
                console.log(`      - Total seats: ${seatsData.layout.length} rows`);
                console.log(`      - Booked seats: ${seatsData.bookedSeats.length}`);
                console.log(`      - Available seats: ${seatsData.availableSeats}\n`);
            } else {
                console.log(`   ⚠️  No showtimes found for this movie\n`);
            }
        }

        console.log('✅ All API tests passed!\n');

    } catch (error) {
        console.error('❌ API Test Failed:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', error.response.data);
        }
        process.exit(1);
    }
}

testAPI();
