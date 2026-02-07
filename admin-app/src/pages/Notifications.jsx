import { useEffect, useState } from 'react';
import api from '../utils/api';
import { Bell, UserPlus, ShoppingCart, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
    const [data, setData] = useState({ users: [], purchases: [], mentorships: [] });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/admin/notifications');
            setData(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleAction = (type, id) => {
        navigate(`/${type}?highlight=${id}`); // Or just navigate to list page
    };

    if (loading) return <div className="p-8 text-white">Loading Notifications...</div>;

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex items-center space-x-3 mb-8">
                <Bell className="text-[#C5A059]" size={32} />
                <h2 className="text-3xl font-bold text-gray-800">Notifications & Recent Activity</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* 1. Pending Purchase Requests */}
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold flex items-center space-x-2">
                            <ShoppingCart size={20} className="text-yellow-600" />
                            <span>Pending Purchases ({data.purchases.length})</span>
                        </h3>
                        {data.purchases.length > 0 && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full animate-pulse">Action Required</span>}
                    </div>

                    {data.purchases.length === 0 ? <p className="text-gray-400">No pending purchases.</p> : (
                        <ul className="space-y-3 max-h-60 overflow-y-auto">
                            {data.purchases.map(req => (
                                <li key={req._id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center hover:bg-gray-100 cursor-pointer" onClick={() => navigate('/requests')}>
                                    <div>
                                        <p className="font-semibold text-sm">{req.studentId?.name || 'Unknown User'}</p>
                                        <p className="text-xs text-gray-500">Requested: {req.noteId?.title || 'Note'}</p>
                                        <p className="text-[10px] text-gray-400">{new Date(req.createdAt).toLocaleString()}</p>
                                    </div>
                                    <span className="text-xs font-bold text-yellow-600">Review →</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* 2. Pending Mentorship Requests */}
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold flex items-center space-x-2">
                            <MessageSquare size={20} className="text-blue-600" />
                            <span>Mentorship Requests ({data.mentorships.length})</span>
                        </h3>
                        {data.mentorships.length > 0 && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full animate-pulse">Review</span>}
                    </div>

                    {data.mentorships.length === 0 ? <p className="text-gray-400">No pending mentorships.</p> : (
                        <ul className="space-y-3 max-h-60 overflow-y-auto">
                            {data.mentorships.map(req => (
                                <li key={req._id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center hover:bg-gray-100 cursor-pointer" onClick={() => navigate('/requests')}>
                                    <div>
                                        <p className="font-semibold text-sm">{req.studentId?.name || 'Unknown Student'}</p>
                                        <p className="text-xs text-gray-500">{req.topic}</p>
                                        <p className="text-[10px] text-gray-400">{new Date(req.createdAt).toLocaleString()}</p>
                                    </div>
                                    <span className="text-xs font-bold text-blue-600">Chat →</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* 3. New Users */}
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500 col-span-1 lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold flex items-center space-x-2">
                            <UserPlus size={20} className="text-green-600" />
                            <span>New Users (Recently Joined)</span>
                        </h3>
                        <button onClick={() => navigate('/users')} className="text-sm text-blue-500 hover:underline">View All Users</button>
                    </div>

                    {data.users.length === 0 ? <p className="text-gray-400">No users yet.</p> : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {data.users.map(u => (
                                <div key={u._id} className="p-3 border border-gray-100 rounded-lg flex items-center space-x-3 bg-gray-50">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600 uppercase">
                                        {u.name?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">{u.name}</p>
                                        <p className="text-xs text-gray-500">{u.email}</p>
                                        <p className="text-[10px] text-gray-400">Joined: {new Date(u.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Notifications;
