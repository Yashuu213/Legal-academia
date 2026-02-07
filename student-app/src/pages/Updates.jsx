import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Briefcase, FileText, Bell, ExternalLink } from 'lucide-react';

const Updates = () => {
    const [updates, setUpdates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUpdates = async () => {
            try {
                const { data } = await api.get('/updates');
                setUpdates(data);
            } catch (err) {
                console.error("Failed to fetch updates", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUpdates();
    }, []);

    const getTypeStyles = (type) => {
        if (type === 'internship') return { icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Internship' };
        if (type === 'news') return { icon: FileText, color: 'text-green-600', bg: 'bg-green-100', label: 'Legal News' };
        return { icon: Bell, color: 'text-[#C5A059]', bg: 'bg-yellow-100', label: 'Update' };
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white pt-24 px-4 pb-12">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-playfair font-bold text-[#C5A059] mb-8 text-center">Legal Updates & Opportunities</h1>

                {loading ? (
                    <p className="text-center text-gray-400">Loading latest updates...</p>
                ) : updates.length === 0 ? (
                    <div className="text-center p-12 bg-[#1e293b] rounded-xl border border-gray-700">
                        <Bell size={48} className="mx-auto text-gray-600 mb-4" />
                        <p className="text-gray-400">No updates available at the moment.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {updates.map(update => {
                            const style = getTypeStyles(update.type);
                            const Icon = style.icon;

                            return (
                                <div key={update._id} className="bg-[#1e293b] p-6 rounded-xl border border-gray-700 hover:border-[#C5A059] transition duration-300">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <div className={`p-2 rounded-lg ${style.bg}`}>
                                                <Icon size={20} className={style.color} />
                                            </div>
                                            <span className={`text-xs font-bold uppercase tracking-wider ${style.color}`}>
                                                {style.label}
                                            </span>
                                            <span className="text-gray-500 text-xs">
                                                • {new Date(update.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    <h2 className="text-xl font-bold mb-3 text-white">{update.title}</h2>
                                    <p className="text-gray-300 mb-4 whitespace-pre-wrap leading-relaxed">
                                        {update.description}
                                    </p>

                                    {update.link && (
                                        <a
                                            href={update.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center space-x-2 text-[#C5A059] hover:text-[#d4b06a] font-semibold transition"
                                        >
                                            <span>Read More / Apply</span>
                                            <ExternalLink size={16} />
                                        </a>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Updates;
