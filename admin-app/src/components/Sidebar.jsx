import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, MessageSquare, ListChecks, LogOut, Bell, X, Settings as SettingsIcon } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
    const { logout } = useContext(AuthContext);
    const location = useLocation();

    const links = [
        { path: '/', label: 'Overview', icon: LayoutDashboard },
        { path: '/notifications', label: 'Notifications', icon: Bell },
        { path: '/users', label: 'Users', icon: Users },
        { path: '/notes', label: 'Notes Manager', icon: FileText },
        { path: '/requests', label: 'Requests', icon: ListChecks },
        { path: '/updates', label: 'Updates & Opps', icon: FileText },
        { path: '/chat', label: 'Chat', icon: MessageSquare },
        { path: '/settings', label: 'Settings', icon: SettingsIcon },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={onClose}
                />
            )}

            <div className={`
                fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 text-gray-100 flex flex-col transition-transform duration-300 ease-in-out transform
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                md:relative md:translate-x-0
            `}>
                <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-blue-500">Legal Academia</h1>
                    <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.path;
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => onClose && window.innerWidth < 768 && onClose()}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-400'
                                    }`}
                            >
                                <Icon size={20} />
                                <span>{link.label}</span>
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={logout}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-red-500 hover:bg-gray-800 rounded-lg transition"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
