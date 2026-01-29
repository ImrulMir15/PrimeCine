import { motion } from 'framer-motion';
import { MdGavel, MdMovie, MdCancel, MdCopyright } from 'react-icons/md';

const TermsOfService = () => {
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
                        <MdGavel className="text-6xl text-purple-500 mx-auto" />
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
                            Terms of Service
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>

                    {/* Content */}
                    <div className="glass-card p-8 md:p-12 space-y-8 text-gray-300 leading-relaxed">
                        <div className="p-4 bg-purple-900/20 border border-purple-500/20 rounded-lg">
                            <p className="text-sm">
                                <strong>Welcome to PrimeCine!</strong> By accessing or using our website and services, you agree to be bound by these Terms of Service. Please read them carefully.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <MdMovie className="text-purple-400" />
                                1. Ticket Booking and Usage
                            </h2>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>All ticket sales are final once confirmed. Please verify your movie, showtime, and seat selection before making a payment.</li>
                                <li>Tickets are valid only for the specific showtime and seat printed on the ticket.</li>
                                <li>PrimeCine reserves the right to refuse adimssion to anyone who violates our cinema code of conduct.</li>
                                <li>Please arrive at least 15 minutes before the showtime. Late entry may be restricted to minimize disruption.</li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <MdCancel className="text-purple-400" />
                                2. Cancellations and Refunds
                            </h2>
                            <p>
                                While we strive to be flexible, our standard policy is:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Tickets generally cannot be refunded or exchanged, except in cases of technical cancellations by the theater.</li>
                                <li>In the event of a show cancellation, a full refund will be processed to the original payment method within 5-7 business days.</li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-white font-display">3. Pricing and Payments</h2>
                            <p>
                                All prices are in US Dollars currently. Prices include applicable taxes unless otherwise stated. We use Stripe for secure payment processing and do not store sensitive card details on our servers.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <MdCopyright className="text-purple-400" />
                                4. Intellectual Property
                            </h2>
                            <p>
                                The content on this website, including logos, text, graphics, and software, is the property of PrimeCine or its content suppliers and is protected by international copyright laws. Unauthorized use of any materials is strictly prohibited.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">5. Limitation of Liability</h2>
                            <p>
                                PrimeCine shall not be liable for any indirect, incidental, or consequential damages arising out of the use or inability to use our services. Our total liability for any claim arising from the use of the services is limited to the amount you paid for the ticket.
                            </p>
                        </div>

                        <div className="pt-8 border-t border-white/10">
                            <p className="text-sm text-gray-400">
                                Contact us at <span className="text-purple-400">legal@primecine.com</span> if you have specific legal inquiries.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default TermsOfService;
