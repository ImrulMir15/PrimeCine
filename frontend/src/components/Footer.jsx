import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import { MdLocalMovies, MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { name: 'Home', path: '/' },
        { name: 'Movies', path: '/movies' },
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    const socialLinks = [
        { icon: FaFacebook, url: '#', label: 'Facebook' },
        { icon: FaTwitter, url: '#', label: 'Twitter' },
        { icon: FaInstagram, url: '#', label: 'Instagram' },
        { icon: FaYoutube, url: '#', label: 'YouTube' },
    ];

    return (
        <footer className="relative mt-20 bg-gradient-to-b from-gray-950 to-black border-t border-white/5">
            {/* Decorative gradient */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center space-x-2 group">
                            <MdLocalMovies className="text-3xl text-purple-500 group-hover:text-purple-400 transition-colors duration-300" />
                            <div className="flex flex-col">
                                <span className="text-xl font-display font-bold gradient-text">
                                    PrimeCine
                                </span>
                                <span className="text-[9px] text-gray-400 -mt-1 tracking-wider">
                                    Premium Seats. Prime Moments
                                </span>
                            </div>
                        </Link>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Experience cinema like never before. Book your premium seats and create unforgettable moments.
                        </p>
                        <div className="flex space-x-3">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.url}
                                    aria-label={social.label}
                                    className="w-10 h-10 rounded-lg glass-card flex items-center justify-center text-gray-400 hover:text-purple-400 hover:scale-110 transition-all duration-300 group"
                                >
                                    <social.icon className="text-lg group-hover:animate-pulse" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-sm text-gray-400 hover:text-purple-400 transition-colors duration-300 flex items-center group"
                                    >
                                        <span className="w-0 group-hover:w-2 h-px bg-purple-500 transition-all duration-300 mr-0 group-hover:mr-2" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start space-x-3 text-sm text-gray-400">
                                <MdLocationOn className="text-purple-500 text-xl flex-shrink-0 mt-0.5" />
                                <span>123 Cinema Street, Movie City, MC 12345</span>
                            </li>
                            <li className="flex items-center space-x-3 text-sm text-gray-400">
                                <MdPhone className="text-purple-500 text-xl flex-shrink-0" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center space-x-3 text-sm text-gray-400">
                                <MdEmail className="text-purple-500 text-xl flex-shrink-0" />
                                <span>info@primecine.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Stay Updated</h3>
                        <p className="text-sm text-gray-400 mb-4">
                            Subscribe to get updates on new releases and exclusive offers.
                        </p>
                        <form className="space-y-2">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors duration-300"
                            />
                            <button
                                type="submit"
                                className="w-full btn-glow text-sm"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-sm text-gray-400">
                            © {currentYear} PrimeCine. All rights reserved.
                        </p>
                        <div className="flex space-x-6 text-sm text-gray-400">
                            <Link to="/privacy" className="hover:text-purple-400 transition-colors duration-300">
                                Privacy Policy
                            </Link>
                            <Link to="/terms" className="hover:text-purple-400 transition-colors duration-300">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative bottom gradient */}
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
        </footer>
    );
};

export default Footer;
