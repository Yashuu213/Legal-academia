import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Scale, LogOut, User, Bell } from 'lucide-react';
import api from '../utils/api';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (user) {
            fetchUnreadCount();
            // Poll every 30 seconds for new notifications
            const interval = setInterval(fetchUnreadCount, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchUnreadCount = async () => {
        try {
            const { data } = await api.get('/notifications');
            const unread = data.filter(n => !n.isRead).length;
            setUnreadCount(unread);
        } catch (err) {
            console.error("Failed to fetch notification count", err);
        }
    };

    return (
        <nav className="fixed w-full z-50 bg-[#0f172a]/90 backdrop-blur border-b border-[#C5A059]/30">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2">
                    <Scale className="text-[#C5A059]" />
                    <span className="text-xl font-bold font-playfair text-white">Legal <span className="text-[#C5A059]">Academia</span></span>
                </Link>
                <div className="flex items-center space-x-6">
                    <Link to="/" className="text-gray-300 hover:text-[#C5A059]">Marketplace</Link>
                    <Link to="/updates" className="text-gray-300 hover:text-[#C5A059]">Updates & Opps</Link>
                    {user ? (
                        <>
                            <Link to="/unlocked" className="text-gray-300 hover:text-[#C5A059]">My Notes</Link>
                            <Link to="/mentorship" className="text-gray-300 hover:text-[#C5A059]">Mentorship</Link>
                            <Link to="/chat" className="text-gray-300 hover:text-[#C5A059]">Chat</Link>
                            <Link to="/notifications" className="relative text-gray-300 hover:text-[#C5A059]">
                                <Bell size={20} />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                        {unreadCount}
                                    </span>
                                )}
                            </Link>
                            <div className="flex items-center space-x-2 text-[#C5A059] border border-[#C5A059] px-3 py-1 rounded-full bg-[#1e293b]">
                                <User size={16} />
                                <span className="text-sm font-bold">{user.name}</span>
                            </div>
                            <button onClick={logout} className="text-red-500 hover:text-red-400">
                                <LogOut size={20} />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-300 hover:text-white">Login</Link>
                            <Link to="/register" className="px-4 py-2 bg-[#C5A059] text-black rounded hover:bg-[#b08d48] font-bold">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
