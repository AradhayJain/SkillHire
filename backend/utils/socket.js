import { Server } from 'socket.io';
import { GoogleGenerativeAI } from '@google/generative-ai';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js'; // Import User model to get user's name

// 1. Initialize the Gemini AI client
const genAI = new GoogleGenerativeAI("AIzaSyDy2dYTvbAcdqkbsO7t-nJCMaLiIYlTdO0");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const initSocket = (server) => {
    // 2. Configure CORS
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173", // Your frontend URL
            methods: ["GET", "POST"]
        }
    });

    // // 3. Add Authentication Middleware
    // io.use((socket, next) => {
    //     const token = socket.handshake.auth.token;
    //     if (!token) {
    //         return next(new Error('Authentication error: Token not provided'));
    //     }
    //     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    //         if (err) {
    //             return next(new Error('Authentication error: Invalid token'));
    //         }
    //         socket.user = decoded; // Attach user info to the socket
    //         next();
    //     });
    // });

    // 4. Handle Connections and Events
    io.on('connection', async (socket) => {
        console.log('A user connected:', socket.id);

        // --- NEW: Send Welcome Message on Connection ---
        // try {
        //     const user = await User.findById(socket.user.id).select('name');
        //     const welcomeMessage = {
        //         sender: 'ai',
        //         text: `Hello ${user.name.split(' ')[0]}! I'm your AI career coach. How can I help you improve your resume today?`
        //     };
        //     socket.emit('aiResponse', welcomeMessage); // Send message only to the connected client
        // } catch (error) {
        //     console.error("Could not fetch user for welcome message:", error);
        // }
        // // --- END NEW PART ---

        socket.on('sendMessage', async (data) => {
            const { resumeText, userQuestion } = data;

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
                
                socket.emit('aiResponse', { sender: 'ai', text });

            } catch (error) {
                console.error("Error with Gemini API:", error);
                socket.emit('aiError', { sender: 'ai', text: 'Sorry, I could not process your request at the moment.' });
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });

    console.log("Socket.io server initialized");
};
