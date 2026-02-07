import { useEffect, useState } from 'react';
import api from '../utils/api';
import { Users, FileText, ListChecks, DollarSign } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({
        students: 0,
        notes: 0,
        pendingRequests: 0,
        revenue: 0
    });
    const [recentUsers, setRecentUsers] = useState([]);
    const [recentRequests, setRecentRequests] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [users, notes, pReqs, mReqs] = await Promise.all([
                    api.get('/users'),
                    api.get('/notes'),
                    api.get('/requests/purchase'),
                    api.get('/requests/mentorship')
                ]);

                const pendingP = pReqs.data.filter(r => r.status === 'pending').length;
                const pendingM = mReqs.data.filter(r => r.status === 'pending').length;

                // Calculate Revenue (Verified Purchases * Price)
                // Assuming price is in Note, or use static 500 if not available easily without population
                // For MVP, let's assume average 500 for verified
                const verifiedCount = pReqs.data.filter(r => r.status === 'accepted').length;
                const revenue = verifiedCount * 500;

                setStats({
                    students: users.data.length,
                    notes: notes.data.length,
                    pendingRequests: pendingP + pendingM,
                    revenue: revenue
                });

                setRecentUsers(users.data.slice(-5).reverse());
                setRecentRequests(pReqs.data.slice(-5).reverse());

            } catch (err) {
                console.error(err);
            }
        };
        fetchStats();
    }, []);

    const cards = [
        { label: 'Total Revenue', value: `₹${stats.revenue}`, icon: DollarSign, color: 'bg-gradient-to-r from-green-400 to-green-600' },
        { label: 'Total Students', value: stats.students, icon: Users, color: 'bg-gradient-to-r from-blue-400 to-blue-600' },
        { label: 'Total Notes', value: stats.notes, icon: FileText, color: 'bg-gradient-to-r from-purple-400 to-purple-600' },
        { label: 'Pending Actions', value: stats.pendingRequests, icon: ListChecks, color: 'bg-gradient-to-r from-orange-400 to-orange-600' },
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 font-playfair">Dashboard Overview</h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {cards.map((card, idx) => {
                    const Icon = card.icon;
                    return (
                        <div key={idx} className={`${card.color} p-6 rounded-2xl shadow-lg text-white transform hover:scale-105 transition duration-300`}>
                            <div className="flex justify-between items-center mb-4">
                                <Icon size={32} className="opacity-80" />
                                <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded">Update</span>
                            </div>
                            <div>
                                <p className="text-white/80 text-sm font-medium">{card.label}</p>
                                <p className="text-3xl font-bold mt-1">{card.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Recent Users Table */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-700">Recent Students</h3>
                        <button className="text-[#C5A059] font-semibold hover:underline text-sm">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-gray-500 text-sm border-b">
                                    <th className="pb-3">Name</th>
                                    <th className="pb-3">Email</th>
                                    <th className="pb-3">Joined</th>
                                    <th className="pb-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {recentUsers.map(u => (
                                    <tr key={u._id} className="text-sm">
                                        <td className="py-4 font-medium flex items-center space-x-2">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                                {u.name[0]}
                                            </div>
                                            <span>{u.name}</span>
                                        </td>
                                        <td className="py-4 text-gray-500">{u.email}</td>
                                        <td className="py-4 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                                        <td className="py-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Active</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {recentUsers.length === 0 && <p className="text-center py-4 text-gray-400">No users found.</p>}
                    </div>
                </div>

                {/* Quick Actions / Recent Requests */}
                <div className="space-y-8">
                    {/* Quick Actions */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-xl font-bold text-gray-700 mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <button className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 border border-gray-200 transition text-center group">
                                <FileText className="mx-auto text-blue-500 mb-2 group-hover:scale-110 transition" />
                                <span className="text-sm font-semibold text-gray-600">Add Note</span>
                            </button>
                            <button className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 border border-gray-200 transition text-center group">
                                <ListChecks className="mx-auto text-yellow-500 mb-2 group-hover:scale-110 transition" />
                                <span className="text-sm font-semibold text-gray-600">Review Requests</span>
                            </button>
                        </div>
                    </div>

                    {/* Recent Requests Mini List */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-xl font-bold text-gray-700 mb-4">Recent Activity</h3>
                        <div className="space-y-4">
                            {recentRequests.slice(0, 4).map(r => (
                                <div key={r._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <div className={`w-2 h-2 rounded-full ${r.status === 'pending' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-800">Purchase Request</p>
                                        <p className="text-xs text-gray-500">{r.status.toUpperCase()} • ₹500</p>
                                    </div>
                                    <span className="text-[10px] text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                                </div>
                            ))}
                            {recentRequests.length === 0 && <p className="text-gray-400 text-sm">No recent activity.</p>}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
