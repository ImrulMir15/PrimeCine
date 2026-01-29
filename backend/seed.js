/**
 * Database Seeder - Populate database with sample data
 * 
 * Run this script to add sample movies and showtimes:
 * node seed.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const Movie = require('./models/Movie');
const Showtime = require('./models/Showtime');

// Sample movies data
const sampleMovies = [
    {
        title: 'Cosmic Odyssey',
        tagline: 'Journey Beyond the Stars',
        description: 'An epic space adventure that takes you to the far reaches of the galaxy. Follow Captain Elena Nova as she leads a diverse crew on a mission to save humanity. Experience breathtaking visuals, heart-pounding action, and an unforgettable story about courage, sacrifice, and the unbreakable human spirit.',
        posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop',
        bannerUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&h=600&fit=crop',
        trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        genre: ['Sci-Fi', 'Adventure', 'Action'],
        duration: 165,
        language: 'English',
        director: 'Sarah Mitchell',
        cast: [
            { name: 'Emma Stone', role: 'Captain Elena Nova' },
            { name: 'Idris Elba', role: 'Commander Marcus Chen' },
            { name: 'Zendaya', role: 'Dr. Maya Patel' }
        ],
        rating: 8.5,
        ageRating: 'PG-13',
        releaseDate: new Date('2026-02-15'),
        status: 'now-showing',
        formats: ['2D', '3D', 'IMAX', 'Dolby Atmos'],
        isFeatured: true
    },
    {
        title: 'Neon Nights',
        tagline: 'The City Never Sleeps',
        description: 'A high-octane thriller set in a cyberpunk metropolis. Detective Jake Chen must navigate through neon-lit streets and corrupt corporations to solve a murder that could change everything. Fast-paced action meets stunning neon aesthetics in this genre-defining noir thriller.',
        posterUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop',
        bannerUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&h=600&fit=crop',
        genre: ['Action', 'Thriller', 'Sci-Fi'],
        duration: 135,
        language: 'English',
        director: 'Denis Villeneuve',
        cast: [
            { name: 'Ryan Gosling', role: 'Detective Jake Chen' },
            { name: 'Ana de Armas', role: 'Iris' },
            { name: 'Jared Leto', role: 'Victor Kane' }
        ],
        rating: 9.0,
        ageRating: 'R',
        releaseDate: new Date('2026-01-20'),
        status: 'now-showing',
        formats: ['2D', 'IMAX', 'VIP'],
        isFeatured: true
    },
    {
        title: 'Eternal Echo',
        tagline: 'Love Transcends Time',
        description: 'A timeless love story that spans across decades. When Sarah discovers her grandmother\'s old letters, she uncovers a forbidden romance from World War II. As she pieces together the past, she finds unexpected parallels to her own complicated love life.',
        posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop',
        bannerUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1200&h=600&fit=crop',
        genre: ['Romance', 'Drama', 'Historical'],
        duration: 150,
        language: 'English',
        director: 'Greta Gerwig',
        cast: [
            { name: 'Saoirse Ronan', role: 'Sarah/Eleanor' },
            { name: 'Timothée Chalamet', role: 'James' },
            { name: 'Florence Pugh', role: 'Margaret' }
        ],
        rating: 8.8,
        ageRating: 'PG-13',
        releaseDate: new Date('2026-02-14'),
        status: 'now-showing',
        formats: ['2D', 'VIP'],
        isFeatured: true
    },
    {
        title: 'Shadow Protocol',
        tagline: 'Trust No One',
        description: 'An elite special ops team discovers a conspiracy that reaches the highest levels of government. With time running out and enemies everywhere, they must go rogue to expose the truth and save millions of lives.',
        posterUrl: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop',
        bannerUrl: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=1200&h=600&fit=crop',
        genre: ['Action', 'Thriller'],
        duration: 128,
        language: 'English',
        director: 'Christopher Nolan',
        cast: [
            { name: 'John David Washington', role: 'Commander Kane' },
            { name: 'Rebecca Ferguson', role: 'Agent Cross' }
        ],
        rating: 8.2,
        ageRating: 'PG-13',
        releaseDate: new Date('2026-01-10'),
        status: 'now-showing',
        formats: ['2D', '3D', 'IMAX'],
        isFeatured: false
    },
    {
        title: 'Quantum Realm',
        tagline: 'Reality is Just the Beginning',
        description: 'When physicist Dr. Maya Chen accidentally opens a portal to parallel universes, she must navigate through multiple versions of reality to find her way home - and prevent a catastrophic collision of worlds.',
        posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop',
        bannerUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1200&h=600&fit=crop',
        genre: ['Sci-Fi', 'Adventure'],
        duration: 142,
        language: 'English',
        director: 'The Wachowskis',
        cast: [
            { name: 'Awkwafina', role: 'Dr. Maya Chen' },
            { name: 'Oscar Isaac', role: 'Dr. David Rhodes' }
        ],
        rating: 8.7,
        ageRating: 'PG-13',
        releaseDate: new Date('2026-01-25'),
        status: 'now-showing',
        formats: ['2D', '3D', 'IMAX 3D', 'Dolby Atmos'],
        isFeatured: false
    },
    {
        title: 'Midnight Tales',
        tagline: 'Some Stories Should Never Be Told',
        description: 'A horror anthology that weaves together three terrifying tales of the supernatural. From a haunted mansion to a cursed artifact, each story will leave you sleeping with the lights on.',
        posterUrl: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop',
        bannerUrl: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=1200&h=600&fit=crop',
        genre: ['Horror', 'Thriller'],
        duration: 118,
        language: 'English',
        director: 'Jordan Peele',
        cast: [
            { name: 'Lupita Nyong\'o', role: 'Dr. Evelyn Cross' },
            { name: 'Daniel Kaluuya', role: 'Marcus' }
        ],
        rating: 7.9,
        ageRating: 'R',
        releaseDate: new Date('2026-01-15'),
        status: 'now-showing',
        formats: ['2D', 'Dolby Atmos'],
        isFeatured: false
    },
    {
        title: 'Summer Dreams',
        tagline: 'Where Dreams Come True',
        description: 'A heartwarming comedy about a group of friends who reunite at their childhood summer camp, only to discover that growing up doesn\'t mean giving up on your dreams.',
        posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop',
        bannerUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&h=600&fit=crop',
        genre: ['Comedy', 'Romance'],
        duration: 108,
        language: 'English',
        director: 'Nancy Meyers',
        cast: [
            { name: 'Sydney Sweeney', role: 'Mia' },
            { name: 'Glen Powell', role: 'Jack' }
        ],
        rating: 8.4,
        ageRating: 'PG-13',
        releaseDate: new Date('2026-01-28'),
        status: 'now-showing',
        formats: ['2D'],
        isFeatured: false
    },
    {
        title: 'The Last Kingdom',
        tagline: 'A Legend Will Rise',
        description: 'An epic fantasy adventure following a young prince who must reclaim his throne from a dark sorcerer. With the help of unlikely allies, he embarks on a quest that will determine the fate of the realm.',
        posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop',
        bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&h=600&fit=crop',
        genre: ['Fantasy', 'Adventure', 'Action'],
        duration: 175,
        language: 'English',
        director: 'Peter Jackson',
        cast: [
            { name: 'Tom Holland', role: 'Prince Adrian' },
            { name: 'Cate Blanchett', role: 'Queen Seraphina' }
        ],
        rating: 8.9,
        ageRating: 'PG-13',
        releaseDate: new Date('2026-03-15'),
        status: 'coming-soon',
        formats: ['2D', '3D', 'IMAX', 'Dolby Atmos'],
        isFeatured: true
    },
    {
        title: 'Digital Dreams',
        tagline: 'Welcome to the Future',
        description: 'In a world where memories can be shared digitally, a memory architect discovers a conspiracy that threatens to rewrite history itself.',
        posterUrl: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=400&h=600&fit=crop',
        bannerUrl: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=1200&h=600&fit=crop',
        genre: ['Sci-Fi', 'Mystery'],
        duration: 138,
        language: 'English',
        director: 'Alex Garland',
        cast: [
            { name: 'Alicia Vikander', role: 'Kai' },
            { name: 'Rami Malek', role: 'Marcus' }
        ],
        rating: 0,
        ageRating: 'PG-13',
        releaseDate: new Date('2026-04-01'),
        status: 'coming-soon',
        formats: ['2D', 'IMAX'],
        isFeatured: false
    },
    {
        title: 'Ocean\'s Deep',
        tagline: 'The Heist of a Lifetime',
        description: 'A master thief assembles an elite team for the ultimate underwater heist - stealing a legendary treasure from a sunken ship guarded by the world\'s most advanced security system.',
        posterUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
        bannerUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop',
        genre: ['Action', 'Thriller', 'Adventure'],
        duration: 145,
        language: 'English',
        director: 'Steven Soderbergh',
        cast: [
            { name: 'Margot Robbie', role: 'Captain Elena' },
            { name: 'Michael B. Jordan', role: 'Marcus Cole' }
        ],
        rating: 0,
        ageRating: 'PG-13',
        releaseDate: new Date('2026-05-15'),
        status: 'coming-soon',
        formats: ['2D', '3D', 'IMAX'],
        isFeatured: false
    }
];

// Generate showtimes for movies
const generateShowtimes = (movieId, days = 7) => {
    const showtimes = [];
    const times = ['10:30', '13:00', '15:30', '18:00', '20:30', '23:00'];
    const hallTypes = ['2D', '3D', 'IMAX', 'VIP'];
    const cinemas = [
        { name: 'PrimeCine Downtown', location: 'Downtown', address: '123 Main Street' },
        { name: 'PrimeCine Westside', location: 'Westside Mall', address: '456 West Avenue' }
    ];
    
    for (let day = 0; day < days; day++) {
        const date = new Date();
        date.setDate(date.getDate() + day);
        date.setHours(0, 0, 0, 0);
        
        // Generate 2-4 showtimes per day
        const dailyTimes = times.slice(0, Math.floor(Math.random() * 3) + 2);
        
        dailyTimes.forEach((time, index) => {
            const cinema = cinemas[index % cinemas.length];
            const hallType = hallTypes[index % hallTypes.length];
            
            showtimes.push({
                movie: movieId,
                cinema,
                hall: {
                    name: `Hall ${index + 1}`,
                    type: hallType,
                    totalSeats: 150,
                    rows: 10,
                    columns: 15
                },
                date,
                startTime: time,
                pricing: {
                    regular: hallType === 'VIP' ? 2000 : hallType === 'IMAX' ? 1800 : 1200,
                    premium: hallType === 'VIP' ? 2500 : hallType === 'IMAX' ? 2200 : 1500,
                    vip: hallType === 'VIP' ? 3500 : hallType === 'IMAX' ? 2800 : 2000
                },
                bookedSeats: [],
                status: 'open'
            });
        });
    }
    
    return showtimes;
};

// Seed function
const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        if (!process.env.MONGODB_URI) {
            console.error('❌ MONGODB_URI not set in .env file');
            process.exit(1);
        }
        
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');
        
        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await Movie.deleteMany({});
        await Showtime.deleteMany({});
        
        // Insert movies
        console.log('🎬 Adding sample movies...');
        const insertedMovies = await Movie.insertMany(sampleMovies);
        console.log(`   ✅ Added ${insertedMovies.length} movies`);
        
        // Generate and insert showtimes for now-showing movies
        console.log('🕐 Generating showtimes...');
        let showtimeCount = 0;
        
        for (const movie of insertedMovies) {
            if (movie.status === 'now-showing') {
                const showtimes = generateShowtimes(movie._id, 7);
                await Showtime.insertMany(showtimes);
                showtimeCount += showtimes.length;
            }
        }
        console.log(`   ✅ Added ${showtimeCount} showtimes`);
        
        console.log('\n🎉 Database seeded successfully!\n');
        
        // Disconnect
        await mongoose.disconnect();
        console.log('👋 Disconnected from MongoDB');
        
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

// Run seeder
seedDatabase();
