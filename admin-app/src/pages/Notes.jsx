import { useEffect, useState } from 'react';
import api from '../utils/api';
import { Plus, Unlock, Lock } from 'lucide-react';

const NotesPage = () => {
    const [notes, setNotes] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', price: '', file: null, poster: null });

    const fetchNotes = async () => {
        try {
            const { data } = await api.get('/notes');
            setNotes(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('file', formData.file);
        if (formData.poster) {
            data.append('poster', formData.poster);
        }

        try {
            await api.post('/notes', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setShowForm(false);
            fetchNotes();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Notes Manager</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    <Plus size={20} />
                    <span>Upload Note</span>
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text" placeholder="Title" required
                            className="p-2 border rounded"
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                        <input
                            type="number" placeholder="Price" required
                            className="p-2 border rounded"
                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                        />
                        <textarea
                            placeholder="Description" required
                            className="col-span-2 p-2 border rounded"
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                        <div className="col-span-2 space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Upload PDF Note *</label>
                            <input
                                type="file" accept="application/pdf" required
                                className="w-full p-2 border rounded"
                                onChange={e => setFormData({ ...formData, file: e.target.files[0] })}
                            />
                        </div>
                        <div className="col-span-2 space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Upload Poster/Thumbnail (Optional)</label>
                            <input
                                type="file" accept="image/*"
                                className="w-full p-2 border rounded"
                                onChange={e => setFormData({ ...formData, poster: e.target.files[0] })}
                            />
                        </div>
                        <button type="submit" className="col-span-2 bg-green-600 text-white py-2 rounded">
                            Submit Note
                        </button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {notes.map((note) => (
                    <div key={note._id} className="bg-white p-6 rounded-lg shadow border border-gray-200">
                        <h3 className="text-xl font-bold mb-2">{note.title}</h3>
                        <p className="text-gray-600 mb-4">{note.description}</p>
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-bold text-green-600">₹{note.price}</span>
                            <span className="text-blue-500 underline cursor-pointer">Unlocks: Managed via Requests</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotesPage;
