import express from "express";
import { AddPost, getPosts } from "../controllers/post.controller.js";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.post("/upload", protect, upload.single("image"), AddPost);
router.get("/",protect,getPosts);

export default router;