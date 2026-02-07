import { X, MessageCircle, QrCode, Upload, Check } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const UnlockModal = ({ onClose, noteId, userId }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState('selection'); // selection, qr, chat-confirm
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(null);

    const handleChatRequest = async () => {
        try {
            await api.post('/requests/chat-inquiry', { noteId });
            alert("Chat Request Sent! Check your Chat Panel.");
            navigate('/chat');
            onClose();
        } catch (err) {
            console.error(err);
            alert("Request Failed");
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return alert("Please select a file");

        setUploading(true);
        const formData = new FormData();
        formData.append('paymentImage', file);
        formData.append('noteId', noteId);

        try {
            await api.post('/requests/verify-payment', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Payment Screenshot Sent! Admin will verify.");
            onClose();
            // Trigger parent refresh if needed
        } catch (err) {
            console.error(err);
            alert("Upload Failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1e293b] w-full max-w-md rounded-2xl border border-[#C5A059]/30 p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <X />
                </button>

                <h2 className="text-2xl font-bold font-playfair text-white mb-6 text-center">Unlock Options</h2>

                {step === 'selection' && (
                    <div className="space-y-4">
                        <button
                            onClick={() => setStep('qr')}
                            className="w-full p-4 bg-[#C5A059] hover:bg-[#b08d48] text-black font-bold rounded-xl flex items-center justify-between transition group"
                        >
                            <div className="flex items-center space-x-3">
                                <QrCode className="w-6 h-6" />
                                <div className="text-left">
                                    <div className="text-lg">Pay via QR</div>
                                    <div className="text-xs opacity-75 font-normal">Instant 10-15 min access</div>
                                </div>
                            </div>
                            <span className="text-xl group-hover:translate-x-1 transition">→</span>
                        </button>

                        <button
                            onClick={handleChatRequest}
                            className="w-full p-4 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl flex items-center justify-between transition"
                        >
                            <div className="flex items-center space-x-3">
                                <MessageCircle className="w-6 h-6 text-[#C5A059]" />
                                <div className="text-left">
                                    <div className="text-lg">Chat with Admin</div>
                                    <div className="text-xs text-gray-400 font-normal">Discuss before paying</div>
                                </div>
                            </div>
                            <span>→</span>
                        </button>
                    </div>
                )}

                {step === 'qr' && (
                    <div className="text-center">
                        <div className="bg-white p-4 rounded-xl inline-block mb-4">
                            {/* Placeholder QR - Replace with user's actual QR */}
                            <img
                                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=admin@upi&pn=LawPlatform"
                                alt="Payment QR"
                                className="w-40 h-40"
                            />
                        </div>
                        <p className="text-gray-300 mb-4 text-sm">Scan & Pay. Then upload screenshot below.</p>

                        <div className="mb-4">
                            <label className="block w-full p-4 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-[#C5A059] transition text-gray-400 hover:text-white flex flex-col items-center justify-center">
                                <Upload className="mb-2" />
                                <span className="text-sm">{file ? file.name : "Click to Upload Screenshot"}</span>
                                <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                            </label>
                        </div>

                        <button
                            onClick={handleUpload}
                            disabled={uploading}
                            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg disabled:opacity-50"
                        >
                            {uploading ? "Verifying..." : "Submit Payment Proof"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UnlockModal;
