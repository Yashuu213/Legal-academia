import { useEffect, useState, useContext, useRef } from 'react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import io from 'socket.io-client';
import { Send, Image, Video } from 'lucide-react';

// Use VITE_API_URL for socket, but remove '/api' suffix if present, or fallback to localhost
const SOCKET_URL = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace('/api', '')
    : 'http://127.0.0.1:5000';

const socket = io(SOCKET_URL);

const ChatPage = () => {
    const { user } = useContext(AuthContext);
    const [rooms, setRooms] = useState([]);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const scrollRef = useRef();

    useEffect(() => {
        fetchRooms();

        // Debug connection
        socket.on('connect', () => console.log('Admin Socket Connected:', socket.id));
        socket.on('connect_error', (err) => console.error('Admin Socket Connection Error:', err));

        socket.on('receive_message', (data) => {
            console.log('Admin received message:', data);
            if (currentRoom && data.chatRoomId === currentRoom._id) {
                setMessages((prev) => {
                    const exists = prev.some(msg => msg.createdAt === data.createdAt && msg.text === data.text);
                    if (exists) return prev;
                    return [...prev, data];
                });
                setTimeout(scrollToBottom, 100);
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
            const { data } = await api.get('/chat/all-rooms');
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

    const sendMessage = async (type = 'text', content = null) => {
        if (!content && !newMessage.trim()) return;

        const messageData = {
            chatRoomId: currentRoom._id,
            senderId: user.id,
            text: type === 'text' ? newMessage : '',
            mediaUrl: type !== 'text' ? content : '',
            type: type,
            createdAt: new Date().toISOString()
        };

        console.log('Sending message:', messageData);

        // Optimistic update
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

    const handleFileUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        try {
            const { data } = await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            sendMessage(type, data.url);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex h-screen pt-4 pb-4 pr-4">
            {/* Sidebar List */}
            <div className="w-1/3 bg-white border-r border-gray-200 overflow-y-auto ml-4 rounded-l-lg shadow sm:w-1/4">
                <h3 className="p-4 font-bold border-b text-lg">Chat Rooms</h3>
                {rooms.map(room => (
                    <div
                        key={room._id}
                        onClick={() => joinRoom(room)}
                        className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${currentRoom?._id === room._id ? 'bg-blue-50' : ''}`}
                    >
                        <p className="font-semibold">{room.studentId?.name}</p>
                        <p className="text-xs text-gray-500">
                            {room.relatedNoteId ? `Re: ${room.relatedNoteId.title}` : `Mentorship: ${room.mentorshipRequestId?.topic}`}
                        </p>
                    </div>
                ))}
            </div>

            {/* Chat Window */}
            <div className="flex-1 bg-gray-50 flex flex-col rounded-r-lg shadow mr-4 h-full">
                {currentRoom ? (
                    <>
                        <div className="p-4 bg-white border-b flex justify-between items-center rounded-tr-lg">
                            <h3 className="font-bold">{currentRoom.studentId?.name}</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-xs p-3 rounded-lg ${msg.senderId === user.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                        {msg.type === 'text' && <p>{msg.text}</p>}
                                        {msg.type === 'image' && <img src={`${SOCKET_URL}${msg.mediaUrl}`} alt="sent" className="w-full rounded" />}
                                        {msg.type === 'video' && <video src={`${SOCKET_URL}${msg.mediaUrl}`} controls className="w-full rounded" />}
                                    </div>
                                </div>
                            ))}
                            <div ref={scrollRef} />
                        </div>
                        <div className="p-4 bg-white border-t rounded-br-lg">
                            <div className="flex items-center space-x-2">
                                <label className="cursor-pointer text-gray-500 hover:text-blue-500">
                                    <Image size={24} />
                                    <input type="file" hidden accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} />
                                </label>
                                <label className="cursor-pointer text-gray-500 hover:text-blue-500">
                                    <Video size={24} />
                                    <input type="file" hidden accept="video/*" onChange={(e) => handleFileUpload(e, 'video')} />
                                </label>
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                    className="flex-1 p-2 border rounded-lg focus:outline-none"
                                    placeholder="Type a message..."
                                />
                                <button onClick={() => sendMessage()} className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">Select a room to chat</div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;
