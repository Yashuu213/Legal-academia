import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Save, ExternalLink } from 'lucide-react';

const Settings = () => {
    const [whatsappLink, setWhatsappLink] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const { data } = await api.get('/settings/whatsapp_group_link');
            if (data && data.value) {
                setWhatsappLink(data.value);
            }
        } catch (err) {
            console.error('Failed to fetch settings', err);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await api.put('/settings/whatsapp_group_link', { value: whatsappLink });
            setMessage('Settings saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error('Failed to save settings', err);
            setMessage('Failed to save settings.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 font-playfair">System Settings</h2>

            <div className="bg-white p-8 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-6 text-gray-700 border-b pb-2">Community & Social</h3>

                <form onSubmit={handleSave} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Student WhatsApp Group Link
                        </label>
                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600">
                            <input
                                type="text"
                                value={whatsappLink}
                                onChange={(e) => setWhatsappLink(e.target.value)}
                                placeholder="https://chat.whatsapp.com/..."
                                className="block flex-1 border-0 bg-transparent py-3 pl-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            />
                            {whatsappLink && (
                                <a
                                    href={whatsappLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex select-none items-center px-3 text-gray-500 hover:text-blue-600 bg-gray-50 border-l"
                                >
                                    <ExternalLink size={18} />
                                </a>
                            )}
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                            This link will be displayed on the Student App for verified students to join.
                        </p>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                        {message && (
                            <p className={`text-sm font-medium ${message.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>
                                {message}
                            </p>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 ml-auto"
                        >
                            <Save size={18} />
                            <span>{loading ? 'Saving...' : 'Save Settings'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;
