import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { User } from '../models/user.model.js';
import dotenv from 'dotenv';
dotenv.config({});
// --- AI Client (Gemini) ---
const genAI = new GoogleGenerativeAI( process.env.GEMINI_API_KEY );
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// --- Online User Tracking ---
const userSocketMap = {}; 
let io = null;

// Getter function to access io in controllers
export const getIo = () => io;

// Getter to find a receiver's socketId
export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};

export const initSocket = (server) => {
    io = new Server(server, { 
        cors: {
            origin: "http://localhost:5173", // must match frontend
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    // --- Middleware for Auth ---
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication error: Token not provided'));
        }
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return next(new Error('Authentication error: Invalid token'));
            }
            socket.userId = decoded.id; 
            next();
        });
    });

    // --- Connection Handler ---
    io.on('connection', async (socket) => {
        const userId = socket.userId;
        console.log('A user connected:', userId);

        // Add user to map
        if (userId) {
            userSocketMap[userId] = socket.id;
        }

        // Broadcast online users
        io.emit('getOnlineUsers', Object.keys(userSocketMap));

        // --- Normal User-to-User Chat (unchanged names) ---
        socket.on('joinChat', (chatId) => {
            socket.join(chatId);
            console.log(`User ${userId} joined chat room: ${chatId}`);
        });

        socket.on('sendMessage', ({ chatId, message }) => {
            io.to(chatId).emit('receiveMessage', {
                sender: userId,
                message,
                chatId,
                timestamp: new Date()
            });
        });

        // --- AI Resume Coach Chat (renamed events) ---
        socket.on('joinAIChat', async () => {
            try {
                const user = await User.findById(userId).select('name');
                if (user) {
                    const welcomeMessage = {
                        sender: 'ai',
                        text: `Hello ${user.name.split(' ')[0]}! I'm your AI career coach. How can I help you improve your resume today?`
                    };
                    socket.emit('aiMessage', welcomeMessage);
                }
            } catch (error) {
                console.error("Could not fetch user for welcome message:", error);
            }
        });

        socket.on('sendAIMessage', async ({ resumeText, userQuestion }) => {
            if (!resumeText || !userQuestion) {
                return socket.emit('aiError', { sender: 'ai', text: 'Missing resume text or question.' });
            }

            const prompt = `You are a professional career coach reviewing a resume. Your tone should be encouraging and helpful. Based ONLY on the following resume text, answer the user's question. Do not invent information not present in the text.

            --- RESUME TEXT ---
            ${resumeText}
            --- END RESUME TEXT ---

            User's Question: "${userQuestion}"`;

            try {
                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text();
                
                socket.emit('aiMessage', { sender: 'ai', text });
            } catch (error) {
                console.error("Error with Gemini API:", error);
                socket.emit('aiError', { sender: 'ai', text: 'Sorry, I could not process your request at the moment.' });
            }
        });

        // --- Disconnect ---
        socket.on('disconnect', () => {
            console.log('User disconnected:', userId);
            delete userSocketMap[userId];
            io.emit('getOnlineUsers', Object.keys(userSocketMap));
        });
    });

    console.log("Socket.io server initialized");
};
