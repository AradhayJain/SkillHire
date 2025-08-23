import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

// This object will store a mapping of { userId: socketId }
const userSocketMap = {}; 
let io = null;

// Getter function to access the io instance in other files (like controllers)
export const getIo = () => io;

// Getter function to find a user's socket ID
export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

export const initSocket = (server) => {
    io = new Server(server, { 
        cors: {
            // This origin MUST exactly match the URL in your browser's address bar
            origin: "http://localhost:5173", 
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    // Middleware to authenticate socket connections using the JWT
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication error: Token not provided'));
        }
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return next(new Error('Authentication error: Invalid token'));
            }
            // Attach the user's ID to the socket object for easy access
            socket.userId = decoded.id; 
            next();
        });
    });

    io.on('connection', (socket) => {
        const userId = socket.userId;
        console.log('A user connected:', userId);

        // Add the new user to our map of online users
        if (userId) {
            userSocketMap[userId] = socket.id;
        }

        // Broadcast the updated list of online user IDs to ALL clients
        io.emit('getOnlineUsers', Object.keys(userSocketMap));

        // Listener for when a client wants to join a specific chat room
        socket.on('joinChat', (chatId) => {
            socket.join(chatId);
            console.log(`User ${userId} joined chat room: ${chatId}`);
        });

        // Listener for when a client disconnects
        socket.on('disconnect', () => {
            console.log('User disconnected:', userId);
            // Remove the user from the map
            delete userSocketMap[userId];
            // Broadcast the final list of online users to ALL clients
            io.emit('getOnlineUsers', Object.keys(userSocketMap));
        });
    });

    console.log("Socket.io server initialized");
};