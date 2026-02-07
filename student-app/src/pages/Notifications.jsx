import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Bell, CheckCircle, MessageSquare, Briefcase, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const { data } = await api.get('/notifications');
            setNotifications(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRead = async (id, link) => {
        try {
            await api.put(`/notifications/${id}/read`);
            navigate(link);
        } catch (err) {
            console.error(err);
        }
    };

    const markAllRead = async () => {
        try {
            await api.put('/notifications/read-all');
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        } catch (err) {
            console.error(err);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'request': return <CheckCircle className="text-green-500" />;
            case 'chat': return <MessageSquare className="text-blue-500" />;
            case 'update': return <Briefcase className="text-yellow-500" />;
            default: return <Bell className="text-gray-500" />;
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white pt-24 px-4 pb-12">
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-playfair font-bold text-[#C5A059]">Notifications</h1>
                    <button onClick={markAllRead} className="text-sm text-gray-400 hover:text-white underline">
                        Mark all read
                    </button>
                </div>

                {loading ? <p>Loading...</p> : notifications.length === 0 ? (
                    <p className="text-center text-gray-500 mt-10">No notifications yet.</p>
                ) : (
                    <div className="space-y-4">
                        {notifications.map(notif => (
                            <div
                                key={notif._id}
                                onClick={() => handleRead(notif._id, notif.link)}
                                className={`p-4 rounded-xl border cursor-pointer hover:bg-[#1e293b] transition flex items-start space-x-4 ${notif.isRead ? 'bg-[#0f172a] border-gray-800 opacity-60' : 'bg-[#1e293b] border-gray-700'
                                    }`}
                            >
                                <div className="mt-1">{getIcon(notif.type)}</div>
                                <div>
                                    <p className="font-semibold text-sm md:text-base">{notif.message}</p>
                                    <span className="text-xs text-gray-500 block mt-1">
                                        {new Date(notif.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                {!notif.isRead && <div className="w-2 h-2 bg-red-500 rounded-full ml-auto mt-2"></div>}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
