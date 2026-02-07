import { useEffect, useState } from 'react';
import api from '../utils/api';
import { Users, FileText, ListChecks } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({
        students: 0,
        notes: 0,
        pendingRequests: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // In a real app we'd have a specific stats endpoint, 
                // but we can fetch lists here for MVP simple stats
                const [users, notes, pReqs, mReqs] = await Promise.all([
                    api.get('/users'),
                    api.get('/notes'),
                    api.get('/requests/purchase'),
                    api.get('/requests/mentorship')
                ]);

                const pendingP = pReqs.data.filter(r => r.status === 'pending').length;
                const pendingM = mReqs.data.filter(r => r.status === 'pending').length;

                setStats({
                    students: users.data.length,
                    notes: notes.data.length,
                    pendingRequests: pendingP + pendingM
                });
            } catch (err) {
                console.error(err);
            }
        };
        fetchStats();
    }, []);

    const cards = [
        { label: 'Total Students', value: stats.students, icon: Users, color: 'bg-blue-600' },
        { label: 'Total Notes', value: stats.notes, icon: FileText, color: 'bg-green-600' },
        { label: 'Pending Requests', value: stats.pendingRequests, icon: ListChecks, color: 'bg-yellow-600' },
    ];

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card, idx) => {
                    const Icon = card.icon;
                    return (
                        <div key={idx} className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4">
                            <div className={`p-4 rounded-full ${card.color} text-white`}>
                                <Icon size={32} />
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">{card.label}</p>
                                <p className="text-2xl font-bold">{card.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Dashboard;
