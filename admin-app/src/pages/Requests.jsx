import { useEffect, useState } from 'react';
import api from '../utils/api';
import { Check, X } from 'lucide-react';

const RequestsPage = () => {
    const [purchases, setPurchases] = useState([]);
    const [mentorships, setMentorships] = useState([]);
    const [activeTab, setActiveTab] = useState('purchase');

    const fetchData = async () => {
        try {
            const [p, m] = await Promise.all([
                api.get('/requests/purchase'),
                api.get('/requests/mentorship')
            ]);
            setPurchases(p.data);
            setMentorships(m.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAction = async (type, id, status) => {
        try {
            await api.put(`/requests/${type}/${id}`, { status });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    // Helper for API URL
    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';
    const SERVER_URL = API_URL.replace('/api', '');

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Requests Panel</h2>
            <div className="flex space-x-4 mb-6">
                <button onClick={() => setActiveTab('purchase')} className={`px-4 py-2 rounded ${activeTab === 'purchase' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Purchase Requests</button>
                <button onClick={() => setActiveTab('mentorship')} className={`px-4 py-2 rounded ${activeTab === 'mentorship' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Mentorship Requests</button>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                {activeTab === 'purchase' ? (
                    <div className="space-y-4">
                        {purchases.map(req => (
                            <div key={req._id} className="border-b pb-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <p className="font-bold text-lg">{req.studentId?.name || 'Unknown'}</p>
                                        <p className="text-gray-600">Requested: {req.noteId?.title || 'Note'}</p>

                                        {/* Verification Badge */}
                                        <div className="mt-2 flex items-center space-x-2">
                                            <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : req.status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {req.status}
                                            </span>

                                            {req.paymentScreenshotUrl && (
                                                <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${req.aiVerificationStatus === 'verified' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-orange-100 text-orange-800 border border-orange-200'}`}>
                                                    AI: {req.aiVerificationStatus} ({(req.aiConfidence || 0)}%)
                                                </span>
                                            )}
                                        </div>

                                        {/* Payment Screenshot */}
                                        {req.paymentScreenshotUrl && (
                                            <div className="mt-3">
                                                <p className="text-xs text-gray-500 mb-1">Payment Proof:</p>
                                                <a href={`${SERVER_URL}${req.paymentScreenshotUrl}`} target="_blank" rel="noopener noreferrer">
                                                    <img
                                                        src={`${SERVER_URL}${req.paymentScreenshotUrl}`}
                                                        alt="Payment Proof"
                                                        className="h-32 rounded border hover:scale-105 transition cursor-pointer"
                                                    />
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    {req.status === 'pending' && (
                                        <div className="flex flex-col space-y-2">
                                            <button onClick={() => handleAction('purchase', req._id, 'accepted')} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded flex items-center space-x-1"><Check size={16} /> <span>Approve</span></button>
                                            <button onClick={() => handleAction('purchase', req._id, 'rejected')} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded flex items-center space-x-1"><X size={16} /> <span>Reject</span></button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {mentorships.map(req => (
                            <div key={req._id} className="border-b pb-4 flex justify-between">
                                <div>
                                    <p className="font-bold">{req.studentId?.name}</p>
                                    <p className="text-sm">Topic: {req.topic} | Time: {req.preferredTime}</p>
                                    <p className="text-gray-500 italic">"{req.message}"</p>
                                    <span className={`text-xs px-2 py-1 rounded ${req.status === 'pending' ? 'bg-yellow-100' : 'bg-gray-100'}`}>{req.status}</span>
                                </div>
                                {req.status === 'pending' && (
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleAction('mentorship', req._id, 'accepted')} className="p-2 bg-green-500 text-white rounded"><Check size={16} /></button>
                                        <button onClick={() => handleAction('mentorship', req._id, 'rejected')} className="p-2 bg-red-500 text-white rounded"><X size={16} /></button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RequestsPage;
