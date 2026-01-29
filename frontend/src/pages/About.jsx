/**
 * About Page - Company information and features
 */

import { motion } from 'framer-motion';
import { FiFilm, FiUsers, FiAward, FiHeart, FiZap, FiShield, FiSmartphone, FiGlobe } from 'react-icons/fi';
import { MdLocalMovies, MdEventSeat, MdFastfood, MdTheaters } from 'react-icons/md';
import { Link } from 'react-router-dom';

const About = () => {
    // Stats data
    const stats = [
        { value: '50+', label: 'Theaters Nationwide' },
        { value: '1M+', label: 'Happy Customers' },
        { value: '500+', label: 'Movies Screened' },
        { value: '4.9', label: 'Customer Rating' }
    ];

    // Features
    const features = [
        {
            icon: MdEventSeat,
            title: 'Premium Seating',
            description: 'Luxurious reclining seats with extra legroom. Choose from Regular, Premium, or VIP sections for the ultimate comfort.'
        },
        {
            icon: MdTheaters,
            title: 'State-of-the-Art Screens',
            description: 'Crystal-clear 4K laser projection and Dolby Atmos sound systems that put you right in the middle of the action.'
        },
        {
            icon: MdFastfood,
            title: 'Gourmet Concessions',
            description: 'Skip the basic popcorn. Enjoy artisanal snacks, craft beverages, and a full menu delivered right to your seat.'
        },
        {
            icon: FiSmartphone,
            title: 'Seamless Booking',
            description: 'Book tickets in seconds with our intuitive app. Skip the lines with mobile tickets and in-seat ordering.'
        },
        {
            icon: FiShield,
            title: 'Secure Payments',
            description: 'Your transactions are protected with bank-level encryption. We never store your full payment details.'
        },
        {
            icon: FiZap,
            title: 'Instant Confirmation',
            description: 'Get your e-tickets instantly via email and app. No printing needed - just show your phone at the door.'
        }
    ];

    // Team members
    const team = [
        {
            name: 'MD: Imrul Kowsar Mir',
            role: 'CEO Of PrimeCine | Tech Lead',
            image: '/images/team/kowsar_mir.jpg', // Placeholder for user's image
            bio: 'Leading PrimeCine with a vision for the future of cinema technology and premium experiences.'
        }
    ];

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-gray-950 to-gray-950 pointer-events-none" />

                <div className="relative max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center justify-center space-x-2 mb-6">
                            <MdLocalMovies className="text-4xl text-purple-500" />
                            <span className="text-sm font-medium text-purple-400 uppercase tracking-widest">
                                About PrimeCine
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
                            <span className="gradient-text">Premium Seats.</span>
                            <br />
                            <span className="text-white">Prime Moments.</span>
                        </h1>

                        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                            We're not just a cinema – we're a destination. Born from a love of film and
                            a desire to create unforgettable experiences, PrimeCine is where movie magic
                            meets modern luxury.
                        </p>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
                    >
                        {stats.map((stat, index) => (
                            <div key={index} className="glass-card p-6">
                                <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-gray-400">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
                                Our Story
                            </h2>
                            <div className="space-y-4 text-gray-400 leading-relaxed">
                                <p>
                                    PrimeCine was founded in 2020 with a simple mission: to bring back the
                                    magic of going to the movies. In an age of streaming, we believed there
                                    was still something irreplaceable about the shared experience of watching
                                    a film on the big screen.
                                </p>
                                <p>
                                    But we didn't want to create just another theater chain. We wanted to
                                    reimagine what a cinema could be – combining cutting-edge technology,
                                    unparalleled comfort, and exceptional service to create moments that
                                    matter.
                                </p>
                                <p>
                                    Today, PrimeCine operates 50+ locations across the country, each one
                                    designed to deliver the ultimate movie experience. From our signature
                                    reclining seats to our curated concession menus, every detail is crafted
                                    with our guests in mind.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="aspect-video rounded-2xl overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1517604931442-710536443883?w=800&q=80"
                                    alt="Our Story"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>

            </section>

            {/* Team Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                            Meet the Team
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            The visionary leadership behind PrimeCine.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="flex justify-center"
                    >
                        {team.map((member, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="glass-card overflow-hidden group max-w-sm w-full"
                            >
                                <div className="aspect-square overflow-hidden bg-gray-800">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://ui-avatars.com/api/?name=MD+Imrul+Kowsar+Mir&background=7c3aed&color=fff&size=512';
                                        }}
                                    />
                                </div>
                                <div className="p-6 text-center">
                                    <h3 className="font-bold text-white mb-1 text-xl">{member.name}</h3>
                                    <p className="text-purple-400 font-medium mb-3">{member.role}</p>
                                    <p className="text-gray-500 text-sm leading-relaxed">{member.bio}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Values Section */}
            < section className="py-20 px-4 sm:px-6 lg:px-8" >
                <div className="max-w-7xl mx-auto">
                    <div className="glass-card p-8 md:p-12">
                        <div className="grid md:grid-cols-3 gap-8 text-center">
                            <div>
                                <FiFilm className="w-10 h-10 text-purple-400 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">Film First</h3>
                                <p className="text-gray-400 text-sm">
                                    Every decision we make starts with one question: does this enhance
                                    the movie experience?
                                </p>
                            </div>
                            <div>
                                <FiUsers className="w-10 h-10 text-purple-400 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">Community Focused</h3>
                                <p className="text-gray-400 text-sm">
                                    Movies bring people together. We create spaces where communities
                                    can share in the magic.
                                </p>
                            </div>
                            <div>
                                <FiHeart className="w-10 h-10 text-purple-400 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">Passion Driven</h3>
                                <p className="text-gray-400 text-sm">
                                    We're movie lovers building for movie lovers. That passion shows
                                    in everything we do.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section >

            {/* CTA Section */}
            < section className="py-20 px-4 sm:px-6 lg:px-8" >
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                            Ready for Your Next Prime Moment?
                        </h2>
                        <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                            Browse our current lineup and book your tickets today.
                            Your premium cinema experience awaits.
                        </p>
                        <Link to="/movies" className="btn-glow inline-block text-lg px-8 py-4">
                            Explore Movies
                        </Link>
                    </motion.div>
                </div>
            </section >
        </div >
    );
};

export default About;
