import { useEffect, useState, useContext } from 'react';
import api from '../utils/api';
import NoteCard from '../components/NoteCard';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const UnlockedNotes = () => {
    const { user, loading } = useContext(AuthContext);
    const [unlocked, setUnlocked] = useState([]);

    useEffect(() => {
        if (user) {
            const fetchUnlocked = async () => {
                try {
                    const { data } = await api.get('/notes/unlocked');
                    setUnlocked(data); // data is array of { noteId: { ... } }
                } catch (err) {
                    console.error(err);
                }
            };
            fetchUnlocked();
        }
    }, [user]);

    if (!loading && !user) return <Navigate to="/login" />;

    return (
        <div className="min-h-screen bg-[#0f172a] text-white p-8 pt-24">
            <h2 className="text-3xl font-bold font-playfair mb-8 text-[#C5A059] text-center">My Library</h2>
            {unlocked.length === 0 ? (
                <p className="text-center text-gray-500">You haven't purchased any notes yet.</p>
            ) : (
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {unlocked.map(item => (
                        <NoteCard key={item._id} note={item.noteId} unlocked={true} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default UnlockedNotes;
