import express from "express";
import cors from "cors";
import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";
import http from 'http'; // 1. Import the http module
import { initSocket, getIo } from "./utils/socket.js"; 
import { protect } from "./middlewares/authMiddleware.js";
import MongoDB from "./utils/MongoDb.js";
import userRoutes from "./routes/user.routes.js";
import resumeRoutes from "./routes/resume.routes.js";
import postRoutes from "./routes/post.routes.js";
import jobRoutes from "./routes/job.routes.js";
import messageRoutes from "./routes/message.routes.js";
import supportRoutes from "./routes/support.routes.js";


dotenv.config({});
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure:true
});
const app = express();
const server = http.createServer(app); // 3. Create an HTTP server from your Express app

// --- Initialize Socket.io ---
initSocket(server); // 4. Pass the server to your socket initializer

const PORT = process.env.PORT || 3000;
const corsOptions = {
    origin: "*", // For development. In production, restrict this to your frontend's domain.
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    req.io = getIo();
    next();
});

app.get("/", (req, res) => {
    res.send("API is running...");
}
);

// --- API Routes ---
app.use("/api/user", userRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/post", postRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/chat", protect,messageRoutes);
app.use("/api/support", supportRoutes);



// 5. Use server.listen instead of app.listen
server.listen(PORT, () => {
    MongoDB();
    console.log(`Server is running on port ${PORT}`);
});
