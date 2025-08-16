import express from "express"
import cors from "cors";
import {v2 as cloudinary} from 'cloudinary'
import dotenv from "dotenv";
import MongoDB  from "./utils/MongoDb.js";
import uploadOnCloudinary from "./utils/cloudinary.js";
import userRoutes from "./routes/user.routes.js";
import resumeRoutes from "./routes/resume.routes.js";
import postRoutes from "./routes/post.routes.js";

dotenv.config({});
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const app = express();
const PORT = process.env.PORT || 3000;
const corsOptions = {
    origin:"*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/user", userRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/post", postRoutes);


app.listen(PORT, () => {
    MongoDB();
    console.log(`Server is running on port ${PORT}`);
});