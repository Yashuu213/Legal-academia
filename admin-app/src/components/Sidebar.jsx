import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, MessageSquare, ListChecks, LogOut } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
    const { logout } = useContext(AuthContext);
    const location = useLocation();

    const links = [
        { path: '/', label: 'Overview', icon: LayoutDashboard },
        { path: '/users', label: 'Users', icon: Users },
        { path: '/notes', label: 'Notes Manager', icon: FileText },
        { path: '/requests', label: 'Requests', icon: ListChecks },
        { path: '/chat', label: 'Chat', icon: MessageSquare },
    ];

    return (
        <div className="w-64 h-screen bg-gray-900 text-gray-100 flex flex-col">
            <div className="p-6 border-b border-gray-800">
                <h1 className="text-2xl font-bold text-blue-500">Law Admin</h1>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.path;
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
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
    );
};

export default Sidebar;
