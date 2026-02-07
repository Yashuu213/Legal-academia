import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, Lock } from 'lucide-react';
import UnlockModal from '../components/UnlockModal';

const NoteDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [note, setNote] = useState(null);
    const [requestStatus, setRequestStatus] = useState(null); // null, pending, accepted

    useEffect(() => {
        const fetchData = async () => {
            try {
                const noteRes = await api.get(`/notes`); // optimize to get single
                const found = noteRes.data.find(n => n._id === id);
                setNote(found);

                // Check request status if logged in
                if (user) {
                    // In a real app, have endpoint to check status
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [id, user]);

    const [showModal, setShowModal] = useState(false);

    const handleRequestClick = () => {
        if (!user) return navigate('/login');
        setShowModal(true);
    };

    if (!note) return <div className="p-20 text-white">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#0f172a] text-white p-8 pt-20 flex justify-center">
            <div className="max-w-4xl w-full bg-[#1e293b] rounded-2xl shadow-2xl overflow-hidden border border-[#C5A059]/20 flex flex-col md:flex-row">
                <div className="md:w-1/2 bg-black py-20 flex items-center justify-center">
                    <span className="text-9xl text-[#C5A059]">§</span>
                </div>
                <div className="p-8 md:w-1/2 flex flex-col justify-center">
                    <h1 className="text-4xl font-bold font-playfair mb-4 text-white">{note.title}</h1>
                    <p className="text-gray-400 mb-6 text-lg">{note.description}</p>
                    <div className="text-3xl font-bold text-[#C5A059] mb-8">₹{note.price}</div>

                    {requestStatus === 'pending' ? (
                        <button disabled className="w-full py-4 bg-gray-600 text-white rounded-lg flex items-center justify-center space-x-2">
                            <CheckCircle /> <span>Request Pending</span>
                        </button>
                    ) : (
                        <button
                            onClick={handleRequestClick}
                            className="w-full py-4 bg-[#C5A059] text-black font-bold text-lg rounded-lg hover:bg-[#b08d48] transition flex items-center justify-center space-x-2"
                        >
                            <Lock size={20} />
                            <span>Request to Unlock</span>
                        </button>
                    )}



                    {showModal && (
                        <UnlockModal
                            onClose={() => setShowModal(false)}
                            noteId={id}
                            userId={user?._id}
                        />
                    )}

                    <p className="mt-4 text-xs text-gray-500 text-center">Admin approval required for access.</p>
                </div>
            </div >
        </div >
    );
};

export default NoteDetails;
