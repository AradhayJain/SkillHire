import { CommunityPost } from "../models/communityPost.model.js";
import { Resume } from "../models/resume.model.js";
import asyncHandler from "express-async-handler";
import uploadOnCloudinary, { deleteFromCloudinary } from "../utils/cloudinary.js";
import { SavedPost } from "../models/savedPost.model.js";
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
    
    // console.log(populatedPost);
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
      sort = "newest",
      savedPosts // <-- just extract it, don’t assign
  } = req.query;

  const skip = (page - 1) * limit;

  // Build filters dynamically
  const filter = {};
  if (tags && tags !== "all") {
      filter.tags = { $in: tags.split(",") };
  }
  if (author) {
      filter.userId = author;
  }
  if (savedPosts) {
      // savedPosts will be a comma-separated list of postIds from frontend
      filter._id = { $in: savedPosts.split(",") };
  }
  // console.log(filter)
  // Sorting logic
  let sortOption = { createdAt: -1 }; // default newest
  if (sort === "oldest") sortOption = { createdAt: 1 };
  if (sort === "popular") sortOption = { likes: -1 };

  const posts = await CommunityPost.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .populate("userId", "name pic")
      .populate("resumeId", "cloudinaryPath ResumeTitle atsScore");

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
      const userId = req.user._id; // assuming you have user from auth middleware
  
      const post = await CommunityPost.findById(postId);
      if (!post) return res.status(404).json({ message: "Post not found" });
  
      // Remove user from both arrays (reset any previous vote)
      post.upvotes = post.upvotes.filter(id => id.toString() !== userId.toString());
      post.downvotes = post.downvotes.filter(id => id.toString() !== userId.toString());
  
      const diff = post.upvotes.length - post.downvotes.length;
  
      if (type === "up") {
        // Add user only if not already in upvotes
        post.upvotes.push(userId);
      } else if (type === "down") {
        // Only allow downvote if diff > 0 (so net never goes negative)
        if (diff > 0) {
          post.downvotes.push(userId);
        }
      } else {
        return res.status(400).json({ message: "Invalid vote type" });
      }
  
      await post.save();
  
      res.json({
        message: "Vote recorded",
        post: {
          _id: post._id,
          upvotes: post.upvotes.length,
          downvotes: post.downvotes.length,
          netVotes: post.upvotes.length - post.downvotes.length,
        },
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  

  export const getTopTags = async (req, res) => {
    try {
      const topTags = await CommunityPost.aggregate([
        { $unwind: "$tags" }, // break array into single tag docs
        { $group: { _id: "$tags", count: { $sum: 1 } } }, // count occurrences
        { $sort: { count: -1 } }, // sort by count descending
        { $limit: 5 } // take top 5
      ]);
  
      res.status(200).json(topTags);
    } catch (err) {
      console.error("Error fetching top tags:", err);
      res.status(500).json({ error: "Server error" });
    }
  };

  export const toggleSavePost = async (req, res) => {
    try {
      const userId = req.user._id;
      const { postId } = req.params;
  
      // check post exists
      const post = await CommunityPost.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      // toggle save
      const existing = await SavedPost.findOne({ userId, postId });
  
      if (existing) {
        await SavedPost.deleteOne({ _id: existing._id });
        return res.json({ saved: false, message: "Post unsaved" });
      } else {
        const newSaved = await SavedPost.create({ userId, postId });
        return res.json({ saved: true, message: "Post saved", data: newSaved });
      }
    } catch (err) {
      console.error("Toggle save error:", err);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  
  // optional: get all saved posts for a user
  export const getSavedPosts = async (req, res) => {
    try {
      const userId = req.user._id;
      const savedPosts = await SavedPost.find({ userId })
  .populate({
    path: "postId",
    select: "_id description resumeId",   // explicitly request _id
    populate: { path: "userId", select: "name pic" },
  });

  console.log(savedPosts)

      res.json(savedPosts);
    } catch (err) {
      console.error("Get saved posts error:", err);
      res.status(500).json({ message: "Server error" });
    }
  };


  export const deletePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
  
    // 1. Find the post
    const post = await CommunityPost.findById(postId);
    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }
  
    // 2. Authorization check
    if (post.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('User not authorized to delete this post');
    }
  
    // 3. Delete image from Cloudinary if exists
    if (post.image) {
      try {
        await deleteFromCloudinary(post.image); 
      } catch (cloudinaryError) {
        console.error("Cloudinary delete error:", cloudinaryError.message);
      }
    }
  
    // 4. Delete the post itself
    await post.deleteOne();
  
    // 5. Delete all saved references to this post
    await SavedPost.deleteMany({ postId });
  
    // 6. Send response
    res.status(200).json({ message: 'Post deleted successfully' });
  });
  
  