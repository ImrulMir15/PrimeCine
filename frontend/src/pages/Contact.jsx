/**
 * Contact Page - Contact form with EmailJS integration
 * 
 * To set up EmailJS (Free tier: 200 emails/month):
 * 1. Go to https://www.emailjs.com/ and create a free account
 * 2. Add an email service (Gmail, Outlook, etc.)
 * 3. Create an email template with variables: {{from_name}}, {{from_email}}, {{subject}}, {{message}}
 * 4. Copy your Service ID, Template ID, and Public Key to your .env file
 */

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheck, FiAlertCircle, FiClock, FiMessageSquare } from 'react-icons/fi';
import { FaTwitter, FaInstagram, FaFacebookF, FaTiktok } from 'react-icons/fa';
import emailjs from '@emailjs/browser';

const Contact = () => {
    const formRef = useRef();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState('idle'); // idle, sending, success, error
    const [errorMessage, setErrorMessage] = useState('');

    // Handle form input changes
    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        setErrorMessage('');

        // Validate form
        if (!formData.name || !formData.email || !formData.message) {
            setStatus('error');
            setErrorMessage('Please fill in all required fields');
            return;
        }

        try {
            // Send email using EmailJS
            // Replace these with your actual EmailJS credentials from .env
            await emailjs.sendForm(
                import.meta.env.VITE_EMAILJS_SERVICE_ID || 'demo_service',
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'demo_template',
                formRef.current,
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'demo_key'
            );

            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
            
            // Reset after 5 seconds
            setTimeout(() => setStatus('idle'), 5000);
        } catch (error) {
            console.error('EmailJS Error:', error);
            setStatus('error');
            setErrorMessage('Failed to send message. Please try again or email us directly.');
        }
    };

    // Contact info cards
    const contactInfo = [
        {
            icon: FiMail,
            title: 'Email Us',
            details: 'support@primecine.com',
            subtext: 'We reply within 24 hours'
        },
        {
            icon: FiPhone,
            title: 'Call Us',
            details: '+1 (555) 123-4567',
            subtext: 'Mon-Fri 9am-6pm EST'
        },
        {
            icon: FiMapPin,
            title: 'Visit Us',
            details: '123 Cinema Street',
            subtext: 'New York, NY 10001'
        },
        {
            icon: FiClock,
            title: 'Hours',
            details: 'Open Daily',
            subtext: '10am - 11pm'
        }
    ];

    // Social links
    const socialLinks = [
        { icon: FaTwitter, href: '#', label: 'Twitter' },
        { icon: FaInstagram, href: '#', label: 'Instagram' },
        { icon: FaFacebookF, href: '#', label: 'Facebook' },
        { icon: FaTiktok, href: '#', label: 'TikTok' }
    ];

    return (
        <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-12">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-display font-bold gradient-text mb-4">
                        Get in Touch
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Have a question, feedback, or just want to say hi? We'd love to hear from you!
                    </p>
                </motion.div>

                {/* Contact Info Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
                >
                    {contactInfo.map((info, index) => (
                        <div key={index} className="glass-card p-6 text-center hover:bg-white/5 transition-colors">
                            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-purple-600/20 flex items-center justify-center">
                                <info.icon className="w-6 h-6 text-purple-400" />
                            </div>
                            <h3 className="font-medium text-white mb-1">{info.title}</h3>
                            <p className="text-purple-400 font-medium">{info.details}</p>
                            <p className="text-sm text-gray-500">{info.subtext}</p>
                        </div>
                    ))}
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card p-8"
                    >
                        <div className="flex items-center space-x-3 mb-6">
                            <FiMessageSquare className="w-6 h-6 text-purple-400" />
                            <h2 className="text-2xl font-display font-bold text-white">
                                Send us a Message
                            </h2>
                        </div>

                        {/* Success Message */}
                        {status === 'success' && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center space-x-3 p-4 mb-6 rounded-lg bg-green-500/10 border border-green-500/30"
                            >
                                <FiCheck className="w-5 h-5 text-green-400" />
                                <span className="text-green-400">Message sent successfully! We'll get back to you soon.</span>
                            </motion.div>
                        )}

                        {/* Error Message */}
                        {status === 'error' && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center space-x-3 p-4 mb-6 rounded-lg bg-red-500/10 border border-red-500/30"
                            >
                                <FiAlertCircle className="w-5 h-5 text-red-400" />
                                <span className="text-red-400">{errorMessage}</span>
                            </motion.div>
                        )}

                        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Your Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                                    placeholder="How can we help?"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Message *
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={5}
                                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                                    placeholder="Tell us what's on your mind..."
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'sending'}
                                className="w-full btn-glow flex items-center justify-center space-x-2 disabled:opacity-50"
                            >
                                {status === 'sending' ? (
                                    <>
                                        <div className="loading-spinner w-5 h-5 border-2"></div>
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    <>
                                        <FiSend />
                                        <span>Send Message</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>

                    {/* FAQ & Social */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-8"
                    >
                        {/* FAQ Section */}
                        <div className="glass-card p-8">
                            <h2 className="text-2xl font-display font-bold text-white mb-6">
                                Frequently Asked Questions
                            </h2>
                            <div className="space-y-4">
                                <FAQItem 
                                    question="How do I cancel or modify my booking?"
                                    answer="You can cancel or modify your booking up to 2 hours before the showtime through your Profile page. Simply find the booking and click 'Modify' or 'Cancel'."
                                />
                                <FAQItem 
                                    question="What payment methods do you accept?"
                                    answer="We accept all major credit/debit cards, Apple Pay, Google Pay, and PayPal. All payments are securely processed through Stripe."
                                />
                                <FAQItem 
                                    question="Can I get a refund?"
                                    answer="Yes! Cancellations made more than 2 hours before showtime receive a full refund. Late cancellations may be eligible for credit towards future bookings."
                                />
                                <FAQItem 
                                    question="Do you offer group discounts?"
                                    answer="Yes, we offer special rates for groups of 10 or more. Contact us directly for corporate events and private screenings."
                                />
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="glass-card p-8">
                            <h2 className="text-2xl font-display font-bold text-white mb-4">
                                Follow Us
                            </h2>
                            <p className="text-gray-400 mb-6">
                                Stay updated with the latest movies, exclusive deals, and behind-the-scenes content!
                            </p>
                            <div className="flex space-x-4">
                                {socialLinks.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.href}
                                        aria-label={social.label}
                                        className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-purple-400 hover:border-purple-500 hover:bg-purple-500/10 transition-all duration-300"
                                    >
                                        <social.icon className="w-5 h-5" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

// FAQ Item Component
const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-white/10 pb-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left flex items-center justify-between"
            >
                <span className="font-medium text-white">{question}</span>
                <span className={`text-purple-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    ▼
                </span>
            </button>
            {isOpen && (
                <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-gray-400 text-sm mt-2"
                >
                    {answer}
                </motion.p>
            )}
        </div>
    );
};

export default Contact;
