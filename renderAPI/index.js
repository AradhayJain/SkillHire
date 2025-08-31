import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from 'http'; // 1. Import the http module
import { initSocket, getIo } from "./utils/socket.js"; 
import geminiRoutes from "./route/Gemini.route.js";

dotenv.config({});

const app = express();
const server = http.createServer(app); 


initSocket(server); 

const PORT = process.env.PORT || 3000;
const corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/gemini", geminiRoutes);



app.use((req, res, next) => {
    req.io = getIo();
    next();
});

app.get("/", (req, res) => {
    res.send("API is running...");
}
);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
