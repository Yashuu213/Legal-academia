import { useEffect, useState } from 'react';
import api from '../utils/api';
import NoteCard from '../components/NoteCard';
import { Scale, BookOpen, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const { data } = await api.get('/notes');
                setNotes(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchNotes();
    }, []);

    return (
        <div className="bg-[#0f172a] min-h-screen text-white font-sans">
            {/* Hero Section */}
            <div className="relative h-[600px] flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80')] bg-cover bg-center">
                <div className="absolute inset-0 bg-black/70"></div>
                <div className="relative z-10 text-center px-4">
                    <Scale className="w-20 h-20 text-[#C5A059] mx-auto mb-6" />
                    <h1 className="text-5xl md:text-7xl font-bold font-playfair mb-4 text-white">
                        Master the <span className="text-[#C5A059]">Law</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Premium notes, expert mentorship, and a community of elite law students.
                    </p>
                    <Link to="/register" className="px-8 py-4 bg-[#C5A059] text-black text-lg font-bold rounded-full hover:bg-[#b08d48] transition">
                        Start Learning
                    </Link>
                </div>
            </div>

            {/* Stats / Features */}
            <div className="py-20 bg-[#1e293b]">
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="p-6">
                        <BookOpen className="w-12 h-12 text-[#C5A059] mx-auto mb-4" />
                        <h3 className="text-2xl font-bold mb-2">Premium Notes</h3>
                        <p className="text-gray-400">Curated, high-quality legal resources.</p>
                    </div>
                    <div className="p-6">
                        <Users className="w-12 h-12 text-[#C5A059] mx-auto mb-4" />
                        <h3 className="text-2xl font-bold mb-2">Expert Mentorship</h3>
                        <p className="text-gray-400">Direct guidance from top legal experts.</p>
                    </div>
                    <div className="p-6">
                        <Scale className="w-12 h-12 text-[#C5A059] mx-auto mb-4" />
                        <h3 className="text-2xl font-bold mb-2">Legal Excellence</h3>
                        <p className="text-gray-400">Tools designed for your success.</p>
                    </div>
                </div>
            </div>

            {/* Notes Marketplace */}
            <div className="py-20 container mx-auto px-4">
                <h2 className="text-4xl font-bold font-playfair text-center mb-12 text-[#C5A059]">Latest Notes</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {notes.map(note => <NoteCard key={note._id} note={note} unlocked={false} />)}
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
