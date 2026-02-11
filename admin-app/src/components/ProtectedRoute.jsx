import { useContext, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

const ProtectedRoute = () => {
    const { user, loading } = useContext(AuthContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (loading) return <div className="flex items-center justify-center h-screen bg-gray-900 text-white">Loading...</div>;
    if (!user) return <Navigate to="/login" />;

    return (
        <div className="flex bg-gray-100 h-screen overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 h-full overflow-y-auto flex flex-col">
                {/* Mobile Header */}
                <div className="md:hidden bg-white p-4 shadow-sm flex items-center border-b">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="text-gray-600 hover:text-gray-900 p-1 rounded-md hover:bg-gray-100"
                    >
                        <Menu size={24} />
                    </button>
                    <span className="ml-4 font-bold text-gray-700 text-lg">Menu</span>
                </div>

                <div className="flex-1 p-0">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default ProtectedRoute;
