import { useEffect, useState } from 'react';
import api from '../utils/api';
import { Ban, CheckCircle } from 'lucide-react';

const UsersPage = () => {
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/users');
            setUsers(data);
        } catch (err) {
            console.error(err);
        }
    };

    const [notes, setNotes] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchUsers();
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            const { data } = await api.get('/notes');
            setNotes(data);
        } catch (err) {
            console.error(err);
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
            await api.put(`/users/${id}/status`, { status: newStatus });
            fetchUsers();
        } catch (err) {
            console.error(err);
        }
    };

    const handleGrantAccess = async (noteId) => {
        if (!selectedUser) return;
        try {
            await api.post('/admin/grant-access', { studentId: selectedUser._id, noteId });
            alert('Access Granted!');
            fetchUsers(); // Refresh to update purchasedNotes list
            // Optionally update local state to reflect change immediately in modal
            setSelectedUser(prev => ({
                ...prev,
                purchasedNotes: [...(prev.purchasedNotes || []), noteId]
            }));
        } catch (err) {
            console.error(err);
            alert('Failed to grant access');
        }
    };

    const openAccessModal = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">User Management</h2>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note Access</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button onClick={() => openAccessModal(user)} className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
                                        Manage Access ({user.purchasedNotes?.length || 0})
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => toggleStatus(user._id, user.status)}
                                        className={`${user.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                                    >
                                        {user.status === 'active' ? 'Block' : 'Unblock'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Grant Access Modal */}
            {showModal && selectedUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Manage Access for {selectedUser.name}</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-black font-bold text-xl">&times;</button>
                        </div>

                        <div className="overflow-y-auto flex-1 space-y-3">
                            {notes.map(note => {
                                const hasAccess = selectedUser.purchasedNotes?.includes(note._id);
                                return (
                                    <div key={note._id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                                        <div>
                                            <p className="font-semibold">{note.title}</p>
                                            <p className="text-xs text-gray-500">₹{note.price}</p>
                                        </div>
                                        {hasAccess ? (
                                            <span className="text-green-600 text-sm font-bold flex items-center"><CheckCircle size={16} className="mr-1" /> Unlocked</span>
                                        ) : (
                                            <button
                                                onClick={() => handleGrantAccess(note._id)}
                                                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                            >
                                                Grant
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersPage;
