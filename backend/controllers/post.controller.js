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
        .populate("resumeId", "cloudinaryPath ResumeTitle atsScore"); // include both fields
    
    console.log(populatedPost);
    res.status(201).json(populatedPost);
});


/**
 * @desc    Get all community posts with pagination
 * @route   GET /api/community/posts
 * @access  Public
 */
export const getPosts = asyncHandler(async (req, res) => {
    const { 
        page = 1, 
        limit = 10, 
        tags, 
        author, 
        sort = "newest" 
    } = req.query;

    const skip = (page - 1) * limit;

    // Build filters dynamically
    const filter = {};
    if (tags) {
        console.log(tags)
        console.log(typeof tags)
        // tags can be comma separated -> split into array
        filter.tags = { $in: tags.split(",") };
        console.log(filter.tags)
    }
    if (author) {
        filter.userId = author; // expecting userId from frontend
    }

    // Sorting logic
    let sortOption = { createdAt: -1 }; // default newest
    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "popular") sortOption = { likes: -1 }; // example: sort by likes

    // Fetch posts
    const posts = await CommunityPost.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit))
        .populate("userId", "name pic") // populate user
        .populate("resumeId", "cloudinaryPath ResumeTitle atsScore"); // populate resume fields

    // Pagination data
    const totalPosts = await CommunityPost.countDocuments(filter);
    const totalPages = Math.ceil(totalPosts / limit);

    res.status(200).json({
        posts,
        totalPosts,
        totalPages,
        currentPage: Number(page)
    });
});


export const upvotePost = async (req, res) => {
    try {
      const { id } = req.params;
  
      const post = await CommunityPost.findByIdAndUpdate(
        id,
        { $inc: { upvotes: 1 } },
        { new: true }
      );
  
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Downvote a post
  export const downvotePost = async (req, res) => {
    try {
      const { id } = req.params;
  
      const post = await CommunityPost.findByIdAndUpdate(
        id,
        { $inc: { downvotes: 1 } },
        { new: true }
      );
  
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  export const votePost = async (req, res) => {
    try {
      const { postId } = req.params;
      const { type } = req.body; // "up" or "down"
  
      const post = await CommunityPost.findById(postId);
      if (!post) return res.status(404).json({ message: "Post not found" });
  
      if (type === "up") {
        post.upvotes += 1;
      } else if (type === "down") {
        post.downvotes += 1;
      } else {
        return res.status(400).json({ message: "Invalid vote type" });
      }
  
      await post.save();
  
      res.json({
        message: "Vote recorded",
        post: {
          _id: post._id,
          upvotes: post.upvotes,
          downvotes: post.downvotes,
        },
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
