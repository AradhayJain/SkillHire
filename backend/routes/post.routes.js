import express from "express";
import { AddPost, downvotePost, getPosts, getSavedPosts, getTopTags, toggleSavePost, upvotePost, votePost } from "../controllers/post.controller.js";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.post("/upload", protect, upload.single("image"), AddPost);
router.get("/",protect,getPosts);
router.put("/:id/upvote",protect, upvotePost);
router.put("/:id/downvote",protect, downvotePost);
router.post("/:postId/vote",protect, votePost);
router.get("/top-tags", getTopTags);
router.post("/save/:postId", protect, toggleSavePost);
router.get("/saved", protect, getSavedPosts);


export default router;