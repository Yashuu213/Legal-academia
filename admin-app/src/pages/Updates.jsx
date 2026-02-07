import { useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Trash2, Plus, ExternalLink, Briefcase, FileText, Bell } from 'lucide-react';

const Updates = () => {
    const { user } = useContext(AuthContext);
    const [updates, setUpdates] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [link, setLink] = useState('');
    const [type, setType] = useState('update'); // 'update', 'internship', 'news'

    useEffect(() => {
        fetchUpdates();
    }, []);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !description) return alert("Title and Description are required");

        try {
            const { data } = await api.post('/updates', { title, description, link, type });
            setUpdates([data, ...updates]);
            setTitle('');
            setDescription('');
            setLink('');
            setType('update');
            alert("Update Posted Successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to post update");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await api.delete(`/updates/${id}`);
            setUpdates(updates.filter(u => u._id !== id));
        } catch (err) {
            alert("Failed to delete");
        }
    };

    const getTypeIcon = (type) => {
        if (type === 'internship') return <Briefcase size={20} className="text-blue-500" />;
        if (type === 'news') return <FileText size={20} className="text-green-500" />;
        return <Bell size={20} className="text-yellow-500" />;
    };

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Updates & Opportunities</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Post Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 sticky top-8">
                        <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                            <Plus size={20} />
                            <span>Post New Update</span>
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. Summer Internship at Supreme Court"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="w-full p-2 border rounded-lg outline-none cursor-pointer"
                                >
                                    <option value="update">General Update</option>
                                    <option value="internship">Internship Opportunity</option>
                                    <option value="news">Legal News</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows="4"
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Details about the opportunity..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Link (Optional)</label>
                                <input
                                    type="text"
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                    className="w-full p-2 border rounded-lg outline-none"
                                    placeholder="https://apply-here.com"
                                />
                            </div>

                            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold transition">
                                Post Update
                            </button>
                        </form>
                    </div>
                </div>

                {/* List of Updates */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-bold text-gray-700">Live Updates</h2>
                    {loading ? <p>Loading...</p> : updates.length === 0 ? <p className="text-gray-500">No updates posted yet.</p> : (
                        updates.map(update => (
                            <div key={update._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                        {getTypeIcon(update.type)}
                                        <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${update.type === 'internship' ? 'bg-blue-100 text-blue-700' :
                                                update.type === 'news' ? 'bg-green-100 text-green-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {update.type}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {new Date(update.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{update.title}</h3>
                                    <p className="text-gray-600 text-sm whitespace-pre-wrap mb-4">{update.description}</p>
                                    {update.link && (
                                        <a href={update.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium">
                                            Visit Link <ExternalLink size={14} className="ml-1" />
                                        </a>
                                    )}
                                </div>
                                <button onClick={() => handleDelete(update._id)} className="text-red-400 hover:text-red-600 p-2">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Updates;
