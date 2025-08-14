import {Resume} from "../models/resume.model.js";
import asyncHandler from "express-async-handler";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const uploadResume = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    
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
            cloudinaryPath: cloudinaryResult.secure_url,
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
    const { atsScore } = req.body;
    const { resumeId } = req.params;
    if (!atsScore || !resumeId) {
        res.status(400);
        throw new Error("ATS score and resume ID are required");
    }
    try {
        const updatedResume = await Resume.findByIdAndUpdate(resumeId, { atsScore }, { new: true });
        if (!updatedResume) {
            res.status(404);
            throw new Error("Resume not found");
        }
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
    const { analyticsData } = req.body;
    const { resumeId } = req.params;
    if (!analyticsData || !resumeId) {
        res.status(400);
        throw new Error("Analytics data and resume ID are required");
    }
    try {
        const updatedResume = await Resume.findByIdAndUpdate(resumeId, { analyticsData:analyticsData }, { new: true });
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