import { CommunityPost } from "../models/communityPost.model.js";
import { Resume } from "../models/resume.model.js";
import asyncHandler from "express-async-handler";
import uploadOnCloudinary from "../utils/cloudinary.js";

/**
 * @desc    Create a new community post
 * @route   POST /api/community/posts
 * @access  Private
 */
export const AddPost = asyncHandler(async (req, res) => {
    const { description, resumeId, tags } = req.body;
    const userId = req.user?._id;

    if (!description) {
        res.status(400);
        throw new Error("Description is required");
    }
    
    // Validate resumeId if provided
    if (resumeId) {
        const resumeExists = await Resume.findOne({ _id: resumeId, userId });
        if (!resumeExists) {
            res.status(400);
            throw new Error("Invalid resumeId or you do not own this resume");
        }
    }

    let imageUrl = null;
    // Check for an uploaded file and upload it to Cloudinary
    if (req.file && req.file.path) {
        const response = await uploadOnCloudinary(req.file.path);
        if (!response || !response.secure_url) {
            res.status(500);
            throw new Error("Image upload failed");
        }
        imageUrl = response.secure_url;
    }

    const newPost = await CommunityPost.create({
        description,
        image: imageUrl, // Can be null if no image is uploaded
        userId,
        resumeId: resumeId || null,
        tags: tags ? JSON.parse(tags) : [] // Tags might come as a JSON string
    });

    // Populate user details for the immediate response
    const populatedPost = await CommunityPost.findById(newPost._id)
        .populate("userId", "name pic")
        .populate("resumeId", "cloudinaryPath ResumeTitle"); // include both fields
    
    
    res.status(201).json(populatedPost);
});


/**
 * @desc    Get all community posts with pagination
 * @route   GET /api/community/posts
 * @access  Public
 */
export const getPosts = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const posts = await CommunityPost.find({})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .populate("userId", "name pic") // get user name + pic
    .populate("resumeId", "cloudinaryPath ResumeTitle"); // include both fields
  
    console.log(posts)

    const totalPosts = await CommunityPost.countDocuments({});
    const totalPages = Math.ceil(totalPosts / limit);

    res.status(200).json({
        posts,
        totalPosts,
        totalPages,
        currentPage: Number(page)
    });
});
