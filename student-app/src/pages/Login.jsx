import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Scale } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
        } catch (err) {
            console.error("Login request failed:", err);
            const errorMessage = err.response?.data?.message || err.message || "Login failed";
            alert(`Login Failed: ${errorMessage}`);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-[#0f172a] text-white">
            <div className="w-full max-w-md p-8 space-y-6 bg-[#1e293b] rounded-xl border border-[#C5A059] shadow-2xl">
                <div className="flex flex-col items-center">
                    <Scale className="w-12 h-12 text-[#C5A059] mb-2" />
                    <h2 className="text-3xl font-playfair font-bold text-[#C5A059]">Welcome Back</h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required
                        className="w-full px-4 py-3 bg-[#0f172a] border border-gray-600 rounded focus:border-[#C5A059] focus:outline-none" />
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required
                        className="w-full px-4 py-3 bg-[#0f172a] border border-gray-600 rounded focus:border-[#C5A059] focus:outline-none" />
                    <button type="submit" className="w-full py-3 font-bold bg-[#C5A059] text-black rounded hover:bg-[#b08d48] transition">LOGIN</button>
                </form>
                <p className="text-center text-gray-400">New here? <Link to="/register" className="text-[#C5A059]">Register</Link></p>
            </div>
        </div>
    );
};

export default Login;
