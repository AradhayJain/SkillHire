import {Resume} from "../models/resume.model.js";
import asyncHandler from "express-async-handler";
import uploadOnCloudinary from "../utils/cloudinary.js";
import axios from "axios";

export const uploadResume = asyncHandler(async (req, res) => {
    const userId = req.user?._id ;
    
    if (!userId || !req.file) {
        res.status(400);
        throw new Error("User ID and file are required");
    }
    
    try {
        const cloudinaryResult = await uploadOnCloudinary(req.file.path);
        
        if (!cloudinaryResult) {
        res.status(500);
        throw new Error("Image upload failed");
        }
    
        const resumeData = {
            userId,
            cloudinaryPath: cloudinaryResult,
            atsScore: 0, // Default ATS score, can be updated later
            analyticsData: {}, // Placeholder for analytics data
            updatesRemaining: 0, // Default updates remaining
            ResumeString:{}
        };
    
        const resume = await Resume.create(resumeData);
    
        res.status(201).json({
        message: "Resume uploaded successfully",
        resume,
        });
    } catch (error) {
        res.status(500);
        throw new Error("Error uploading resume: " + error.message);
    }
});

export const updateResume = asyncHandler(async (req, res) => {
    const { userId, atsScore, analyticsData, updatesRemaining } = req.body;
    const { resumeId } = req.params;
});

export const updateAtsScore = asyncHandler(async (req, res) => {
    const { resumeId } = req.params;
    const {cloudinaryPath} = req.body;
    if (!cloudinaryPath) {
        res.status(400);
        throw new Error("Cloudinary path is required");
    }

    if (!resumeId) {
        res.status(400);
        throw new Error("Resume ID is required");
    }

    try {
        const flaskResponse = await axios.post("http://127.0.0.1:5000/calculate_ats", {
            pdf_url: cloudinaryPath
        });
        const atsScore = flaskResponse.data.ats_score;
        const updatedResume = await Resume.findByIdAndUpdate(
            resumeId,
            { atsScore },
            { new: true }
        );
        res.status(200).json({
            message: "ATS score updated successfully",
            resume: updatedResume,
        });

    } catch (error) {
        res.status(500);
        throw new Error("Error updating ATS score: " + error.message);
    }
});


export const updateAnalyticsData = asyncHandler(async (req, res) => {
    const { resumeId } = req.params;
    const {cloudinaryPath} = req.body;

    if (!resumeId) {
        res.status(400);
        throw new Error("Resume ID is required");
    }
    if(!cloudinaryPath) {
        res.status(400);
        throw new Error("Cloudinary path is required");
    }
    try {
        const flaskResponse = await axios.post("http://127.0.0.1:5000/extract_details", {
            pdf_url: cloudinaryPath
        });

        const analyticsData = flaskResponse.data;

        const updatedResume = await Resume.findByIdAndUpdate(
            resumeId,
            { analyticsData },
            { new: true }
        );

        if (!updatedResume) {
            res.status(404);
            throw new Error("Resume not found");
        }
        res.status(200).json({
            message: "Analytics data updated successfully",
            resume: updatedResume,
        });

    } catch (error) {
        res.status(500);
        throw new Error("Error updating analytics data: " + error.message);
    }
});

export const getResumes = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) {
        res.status(400);
        throw new Error("User ID is required");
    }

    try {
        const resumes = await Resume.find({ userId })
            .populate("userId", "username email");

        res.status(200).json(resumes);
    } catch (error) {
        res.status(500);
        throw new Error("Error fetching resumes: " + error.message);
    }
});
