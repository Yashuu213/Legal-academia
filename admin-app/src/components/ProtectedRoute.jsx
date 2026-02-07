import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Sidebar from './Sidebar';

const ProtectedRoute = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div className="flex items-center justify-center h-screen bg-gray-900 text-white">Loading...</div>;
    if (!user) return <Navigate to="/login" />;

    return (
        <div className="flex bg-gray-100 h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 h-full overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
};

export default ProtectedRoute;
