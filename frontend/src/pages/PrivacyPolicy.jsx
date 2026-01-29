import { motion } from 'framer-motion';
import { MdSecurity, MdLock, MdDataUsage, MdCookie } from 'react-icons/md';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-12"
                >
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <MdSecurity className="text-6xl text-purple-500 mx-auto" />
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
                            Privacy Policy
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>

                    {/* Content */}
                    <div className="glass-card p-8 md:p-12 space-y-8 text-gray-300 leading-relaxed">
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <MdLock className="text-purple-400" />
                                1. Information We Collect
                            </h2>
                            <p>
                                At PrimeCine, we aim to provide you with the best movie-going experience. To do this, we collect:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong>Personal Information:</strong> Name, email address, phone number, and payment details when you book tickets.</li>
                                <li><strong>Usage Data:</strong> Information on how you interact with our website, including device type and browser version.</li>
                                <li><strong>Location Data:</strong> Approximate location to show relevant showtimes and theaters near you.</li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <MdDataUsage className="text-purple-400" />
                                2. How We Use Your Data
                            </h2>
                            <p>
                                Your information helps us deliver a premium service. Specifically, we use it to:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Process your ticket bookings and send confirmation details.</li>
                                <li>Provide customer support and resolve any issues.</li>
                                <li>Send you updates on upcoming movies, exclusive offers, and events (only if you subscribe).</li>
                                <li>Improve our website functionality and security.</li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <MdCookie className="text-purple-400" />
                                3. Cookies and Tracking
                            </h2>
                            <p>
                                We use cookies to enhance your browsing experience. Cookies help us remember your preferences, keep you logged in, and analyze site traffic. You can control cookie usage through your browser settings, but some features of the site may not function properly without them.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">4. Data Security</h2>
                            <p>
                                Security is our top priority. We implement bank-level encryption (SSL) and follow strict security protocols to protect your personal and payment information from unauthorized access, alteration, or disclosure.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">5. Third-Party Sharing</h2>
                            <p>
                                We do not sell your personal data. We may share information with trusted third-party service providers (such as payment processors like Stripe) solely for the purpose of operating our business and serving you.
                            </p>
                        </div>

                        <div className="pt-8 border-t border-white/10">
                            <p className="text-sm text-gray-400">
                                If you have any questions about this policy, please contact us at <span className="text-purple-400">privacy@primecine.com</span>.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
