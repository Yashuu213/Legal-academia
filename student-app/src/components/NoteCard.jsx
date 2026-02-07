import { Lock, Unlock } from 'lucide-react';
import { Link } from 'react-router-dom';

const NoteCard = ({ note, unlocked }) => {
    return (
        <div className="bg-[#1e293b] border border-[#C5A059]/30 rounded-xl overflow-hidden hover:border-[#C5A059] transition shadow-lg flex flex-col h-full">
            <div className="h-40 bg-gray-800 flex items-center justify-center relative">
                {/* Placeholder for Note Preview Image */}
                <span className="text-[#C5A059] text-5xl font-serif">§</span>
                <div className="absolute top-2 right-2 bg-black/50 p-1 rounded">
                    {unlocked ? <Unlock size={20} className="text-green-500" /> : <Lock size={20} className="text-red-500" />}
                </div>
            </div>
            <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-white mb-2 font-playfair">{note.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{note.description}</p>
                <div className="mt-auto flex justify-between items-center">
                    <span className="text-2xl font-bold text-[#C5A059]">₹{note.price}</span>
                    {unlocked ? (
                        <button
                            onClick={() => window.open(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}${note.fileUrl}`, '_blank')}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition flex items-center gap-2"
                        >
                            <Unlock size={16} /> Download
                        </button>
                    ) : (
                        <Link to={`/note/${note._id}`} className="px-4 py-2 bg-transparent border border-[#C5A059] text-[#C5A059] rounded hover:bg-[#C5A059] hover:text-black transition">
                            View Details
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NoteCard;
