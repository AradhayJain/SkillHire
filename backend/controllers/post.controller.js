import { CommunityPost } from "../models/communityPost.model.js";
import { Resume } from "../models/resume.model.js";
import asyncHandler from "express-async-handler";
import uploadOnCloudinary from "../utils/cloudinary.js";


export const AddPost = asyncHandler(async (req, res) => {
    const { description, image, resumeId, tags } = req.body;
    const userId = req.user?._id;

    if (!description) {
        res.status(400);
        throw new Error("Description is required");
    }
    if (resumeId) {
        const resumeExists = await Resume.findOne({ _id: resumeId, userId });
        if (!resumeExists) {
            res.status(400);
            throw new Error("Invalid resumeId or you do not own this resume");
        }
    }
    const response  = await uploadOnCloudinary(image);
    if (!response) {
        res.status(500);
        throw new Error("Image upload failed");
    }
    const imageUrl = response.secure_url;

    const newPost = await CommunityPost.create({
        description,
        image: imageUrl,
        userId,
        resumeId: resumeId || null,
        tags: tags || []
    });

    res.status(201).json(newPost);
});
