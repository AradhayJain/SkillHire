import express from "express"
import cors from "cors";
import dotenv from "dotenv";
import MongoDB  from "./utils/MongoDb.js";
import userRoutes from "./routes/user.routes.js";


dotenv.config({});
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


app.listen(PORT, () => {
    MongoDB();
    console.log(`Server is running on port ${PORT}`);
});