import { Link } from 'react-router-dom';
import { Scale, Instagram, Mail, Youtube } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#0f172a] text-gray-300 border-t border-[#C5A059]/20 pt-12 pb-6">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Scale className="text-[#C5A059]" size={28} />
                            <span className="text-2xl font-bold font-playfair text-white">Legal <span className="text-[#C5A059]">Academia</span></span>
                        </div>
                        <p className="text-sm text-gray-400">
                            Empowering law students with premium notes, expert mentorship, and real-time updates.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold mb-4 border-b border-[#C5A059]/30 inline-block pb-1">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/" className="hover:text-[#C5A059] transition">Marketplace</Link></li>
                            <li><Link to="/updates" className="hover:text-[#C5A059] transition">Updates & Opportunities</Link></li>
                            <li><Link to="/mentorship" className="hover:text-[#C5A059] transition">Mentorship Program</Link></li>
                            <li><Link to="/register" className="hover:text-[#C5A059] transition">Join Community</Link></li>
                        </ul>
                    </div>

                    {/* Legal & Support */}
                    <div>
                        <h3 className="text-white font-bold mb-4 border-b border-[#C5A059]/30 inline-block pb-1">Support</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-[#C5A059] transition">Help Center</a></li>
                            <li><a href="#" className="hover:text-[#C5A059] transition">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-[#C5A059] transition">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-[#C5A059] transition">Content Guidelines</a></li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h3 className="text-white font-bold mb-4 border-b border-[#C5A059]/30 inline-block pb-1">Connect</h3>
                        <div className="flex space-x-4">
                            <a href="https://instagram.com/legal_academia" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-2 rounded-full hover:bg-[#C5A059] hover:text-black transition">
                                <Instagram size={18} />
                            </a>
                            <a href="https://www.youtube.com/@LegalAcademiaa" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-2 rounded-full hover:bg-[#C5A059] hover:text-black transition">
                                <Youtube size={18} />
                            </a>
                            <a href="mailto:legalacademiaa@gmail.com" className="bg-gray-800 p-2 rounded-full hover:bg-[#C5A059] hover:text-black transition">
                                <Mail size={18} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Legal Academia. All rights reserved.</p>
                    <p>Designed for Future Lawyers.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
