import { useState, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { Send } from 'lucide-react';

const Mentorship = () => {
    const { user } = useContext(AuthContext);
    const [formData, setFormData] = useState({ topic: '', subject: '', reason: '', preferredTime: '', message: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/requests/mentorship', formData);
            alert('Mentorship Request Sent!');
            setFormData({ topic: '', subject: '', reason: '', preferredTime: '', message: '' });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] p-8 pt-20 flex justify-center">
            <div className="bg-[#1e293b] p-8 rounded-xl shadow-xl w-full max-w-2xl border-t-4 border-[#C5A059]">
                <h2 className="text-3xl font-bold text-white mb-6 font-playfair">Request Mentorship</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Topic" value={formData.topic} onChange={e => setFormData({ ...formData, topic: e.target.value })} required
                            className="bg-gray-800 text-white p-3 rounded focus:ring-1 focus:ring-[#C5A059] outline-none" />
                        <input type="text" placeholder="Subject" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} required
                            className="bg-gray-800 text-white p-3 rounded focus:ring-1 focus:ring-[#C5A059] outline-none" />
                    </div>
                    <input type="text" placeholder="Reason for mentorship" value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })} required
                        className="w-full bg-gray-800 text-white p-3 rounded focus:ring-1 focus:ring-[#C5A059] outline-none" />
                    <input type="text" placeholder="Preferred Time (e.g. Weekends 5PM)" value={formData.preferredTime} onChange={e => setFormData({ ...formData, preferredTime: e.target.value })} required
                        className="w-full bg-gray-800 text-white p-3 rounded focus:ring-1 focus:ring-[#C5A059] outline-none" />
                    <textarea placeholder="Additional Message" rows="4" value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-gray-800 text-white p-3 rounded focus:ring-1 focus:ring-[#C5A059] outline-none"></textarea>

                    <button type="submit" className="w-full bg-[#C5A059] text-black font-bold py-3 rounded hover:bg-[#b08d48] transition flex justify-center items-center space-x-2">
                        <span>Send Request</span> <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Mentorship;
