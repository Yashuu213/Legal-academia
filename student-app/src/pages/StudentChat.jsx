import { useEffect, useState, useContext, useRef } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import io from 'socket.io-client';
import { Send } from 'lucide-react';

// Helper to determine Socket URL from Env Var (handles full URL or just Hostname)
const getSocketUrl = () => {
    const url = import.meta.env.VITE_API_URL;
    if (!url) return 'http://127.0.0.1:5000';
    if (url.startsWith('http')) return url.replace('/api', '');
    return `https://${url}`;
};

const SOCKET_URL = getSocketUrl();

const socket = io(SOCKET_URL);

const StudentChat = () => {
    const { user } = useContext(AuthContext);
    const [rooms, setRooms] = useState([]);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const scrollRef = useRef();

    useEffect(() => {
        if (user) fetchRooms();
    }, [user]);

    useEffect(() => {
        // Debug connection
        socket.on('connect', () => console.log('Socket Connected:', socket.id));
        socket.on('connect_error', (err) => console.error('Socket Connection Error:', err));

        socket.on('receive_message', (data) => {
            console.log('Received message:', data);
            if (currentRoom && data.chatRoomId === currentRoom._id) {
                setMessages((prev) => {
                    // Avoid duplicates if we optimistically added it
                    const exists = prev.some(msg => msg.createdAt === data.createdAt && msg.text === data.text);
                    if (exists) return prev;
                    return [...prev, data];
                });
                scrollToBottom();
            }
        });

        return () => {
            socket.off('connect');
            socket.off('connect_error');
            socket.off('receive_message');
        };
    }, [currentRoom]);

    const fetchRooms = async () => {
        try {
            const { data } = await api.get('/chat/my-rooms');
            setRooms(data);
        } catch (err) {
            console.error("Failed to fetch rooms:", err);
        }
    };

    const joinRoom = async (room) => {
        console.log('Joining room:', room._id);
        setCurrentRoom(room);
        socket.emit('join_room', room._id);
        try {
            const { data } = await api.get(`/chat/${room._id}/messages`);
            setMessages(data);
            setTimeout(scrollToBottom, 100);
        } catch (err) {
            console.error("Failed to fetch messages:", err);
        }
    };

    const scrollToBottom = () => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !currentRoom) return;

        const messageData = {
            chatRoomId: currentRoom._id,
            senderId: user.id,
            text: newMessage,
            type: 'text',
            createdAt: new Date().toISOString()
        };

        console.log('Sending message:', messageData);

        // Optimistic Update
        setMessages((prev) => [...prev, messageData]);
        setNewMessage('');

        try {
            await socket.emit('send_message', messageData);
            setTimeout(scrollToBottom, 100);
        } catch (err) {
            console.error("Socket emit error:", err);
            alert("Failed to send message. Check internet connection.");
        }
    };

    return (
        <div className="flex h-screen bg-[#0f172a] text-white pt-20 px-8 pb-8">
            <div className="w-1/4 bg-[#1e293b] border-r border-gray-700 rounded-l-xl overflow-y-auto">
                <h3 className="p-4 border-b border-gray-700 font-bold text-[#C5A059]">My Discussions</h3>
                {rooms.length === 0 && <p className="p-4 text-gray-400 text-sm">No chats yet. Request a note or mentorship to start.</p>}
                {rooms.map(room => (
                    <div key={room._id} onClick={() => joinRoom(room)} className={`p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-800 ${currentRoom?._id === room._id ? 'bg-gray-800' : ''}`}>
                        <div className="flex justify-between">
                            <p className="font-semibold text-sm">With Admin</p>
                            {room.status === 'pending' && <span className="text-[10px] bg-yellow-600 px-1 rounded text-white">Pending</span>}
                        </div>
                        <p className="text-xs text-gray-400 truncate">Re: {room.relatedNoteId?.title || room.mentorshipRequestId?.topic}</p>
                    </div>
                ))}
            </div>
            <div className="flex-1 bg-[#0f172a] border border-l-0 border-gray-700 rounded-r-xl flex flex-col">
                {currentRoom ? (
                    <>
                        <div className="p-4 border-b border-gray-700 bg-[#1e293b] rounded-tr-xl">
                            <h3 className="font-bold text-[#C5A059]">Chat with Admin</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-xs p-3 rounded-lg ${msg.senderId === user.id ? 'bg-[#C5A059] text-black' : 'bg-gray-700 text-white'}`}>
                                        {msg.type === 'text' && <p>{msg.text}</p>}
                                        {(msg.type === 'image' || msg.type === 'video') && <span className="italic text-xs">[Media]</span>}
                                    </div>
                                </div>
                            ))}
                            <div ref={scrollRef} />
                        </div>

                        {/* Chat Input or Pending Message */}
                        {currentRoom.status === 'pending' ? (
                            <div className="p-4 bg-yellow-900/20 border-t border-yellow-700 rounded-br-xl text-center">
                                <p className="text-yellow-500 font-bold">Request Sent to Admin</p>
                                <p className="text-xs text-gray-400">You can chat once they accept your request.</p>
                            </div>
                        ) : (
                            <div className="p-4 bg-[#1e293b] border-t border-gray-700 rounded-br-xl">
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={e => setNewMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                        className="flex-1 bg-gray-900 border border-gray-600 rounded-lg p-3 focus:border-[#C5A059] outline-none"
                                        placeholder="Type message... (Text Only)"
                                    />
                                    <button onClick={sendMessage} className="p-3 bg-[#C5A059] text-black rounded-full hover:bg-[#a08040]"><Send size={20} /></button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">Select a conversation</div>
                )}
            </div>
        </div>
    );
};

export default StudentChat;
