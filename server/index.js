const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const http = require('http');
const path = require('path');
const Message = require('./models/Message');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Serve Static Assets (Images/Videos)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// DB Connection
// DB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected successfully to', process.env.MONGO_URI))
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
        process.exit(1); // Exit if DB fails
    });

mongoose.connection.on('error', err => console.error('MongoDB Runtime Error:', err));
mongoose.connection.on('disconnected', () => console.log('MongoDB Disconnected'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/notes', require('./routes/noteRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

// Socket.io for Realtime Chat
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all for dev
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined room: ${roomId}`);
        // Log all rooms this socket is in
        console.log(`Socket ${socket.id} is now in rooms:`, socket.rooms);
    });

    socket.on('send_message', async (data) => {
        // 1. Emit IMMEDIATELY (Optimistic server-side)
        io.to(data.chatRoomId).emit('receive_message', data);
        console.log(`Optimistic emit to room ${data.chatRoomId}`);

        // 2. Save to DB asynchronously
        try {
            const newMessage = new Message(data);
            await newMessage.save();
            console.log('Message saved to DB');
        } catch (err) {
            console.error('Message save error:', err);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
