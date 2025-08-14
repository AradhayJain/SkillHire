import express from "express";
import { AddPost } from "../controllers/post.controller.js";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.post("/", protect, upload.single("image"), AddPost);

export default router;