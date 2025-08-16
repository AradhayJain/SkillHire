import { Resume } from "../models/resume.model.js";
import asyncHandler from "express-async-handler";
import uploadOnCloudinary, { deleteFromCloudinary } from "../utils/cloudinary.js";
import axios from "axios";
import mongoose from "mongoose";

// --- CREATE: Upload a new resume ---
export const uploadResume = asyncHandler(async (req, res) => {
    const { title } = req.body;
    const userId = req.user?._id;

    if (!title) {
        res.status(400);
        throw new Error("Resume title is required");
    }
    if (!req.file) {
        res.status(400);
        throw new Error("Resume file is required");
    }

    const cloudinaryUpload = await uploadOnCloudinary(req.file.path);

    if (!cloudinaryUpload || !cloudinaryUpload.url) {
        res.status(500);
        throw new Error("Failed to upload resume to Cloudinary");
    }

    const newResumeData = {
        userId,
        ResumeTitle: title,
        cloudinaryPath: cloudinaryUpload.url, // Correctly access the URL
        atsScore: 0,
        analyticsData: {},
        updatesRemaining: 0,
        ResumeString: {}
    };

    const resume = await Resume.create(newResumeData);

    res.status(201).json({
        message: "Resume uploaded successfully",
        success: true,
        resume,
    });
});


// --- READ: Get all resumes for the logged-in user ---
export const getResumes = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const resumes = await Resume.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
        message: "Resumes fetched successfully",
        success: true,
        resumes,
    });
});

// --- UPDATE: General purpose update for title OR file ---
export const updateResume = asyncHandler(async (req, res) => {
    const { resumeId } = req.params;
    const { title } = req.body;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
        res.status(400);
        throw new Error("Invalid Resume ID format");
    }

    const resume = await Resume.findById(resumeId);

    if (!resume) {
        res.status(404);
        throw new Error("Resume not found");
    }

    if (resume.userId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("You are not authorized to update this resume");
    }

    // --- Handle File Update ---
    if (req.file) {
        const oldPath = resume.cloudinaryPath;

        const newUpload = await uploadOnCloudinary(req.file.path);
        if (!newUpload || !newUpload.url) {
            res.status(500);
            throw new Error("Failed to upload the new resume file.");
        }
        
        resume.cloudinaryPath = newUpload.url; // Correctly access the URL
        
        resume.atsScore = 0;
        resume.analyticsData = {};

        if (oldPath) {
            try {
                await deleteFromCloudinary(oldPath);
            } catch (cloudinaryError) {
                console.error("Failed to delete old file from Cloudinary:", cloudinaryError);
            }
        }
    }

    // --- Handle Title Update ---
    if (title) {
        resume.ResumeTitle = title;
    }

    const updatedResume = await resume.save();

    res.status(200).json({
        message: "Resume updated successfully",
        success: true,
        resume: updatedResume,
    });
});


// --- DELETE: Delete a resume ---
export const deleteResume = asyncHandler(async (req, res) => {
    const { resumeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
        res.status(400);
        throw new Error("Invalid Resume ID format");
    }

    const resume = await Resume.findById(resumeId);
    if (!resume) {
        res.status(404);
        throw new Error("Resume not found");
    }

    if (resume.userId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("You are not authorized to delete this resume");
    }
    
    try {
        await deleteFromCloudinary(resume.cloudinaryPath);
    } catch (cloudinaryError) {
        console.error("Could not delete file from Cloudinary during resume deletion:", cloudinaryError);
    }

    await resume.deleteOne();

    res.status(200).json({
        message: "Resume deleted successfully",
        success: true,
        resumeId: resumeId
    });
});

// --- UPDATE: Update ATS score by calling external service ---
export const updateAtsScore = asyncHandler(async (req, res) => {
    const { resumeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
        res.status(400);
        throw new Error("Invalid Resume ID format");
    }

    const resume = await Resume.findById(resumeId);
    if (!resume) {
        res.status(404);
        throw new Error("Resume not found");
    }

    if (resume.userId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("You are not authorized to perform this action");
    }

    if (!resume.cloudinaryPath) {
        res.status(400);
        throw new Error("Resume does not have a valid file path to analyze");
    }

    try {
        const flaskResponse = await axios.post("http://127.0.0.1:5000/calculate_ats", {
            pdf_url: resume.cloudinaryPath
        });

        const atsScore = flaskResponse.data.ats_score;

        const updatedResume = await Resume.findByIdAndUpdate(
            resumeId,
            { atsScore },
            { new: true }
        );

        res.status(200).json({
            message: "ATS score updated successfully",
            success: true,
            resume: updatedResume,
        });

    } catch (error) {
        console.error("Error calling ATS service:", error.message);
        res.status(500);
        throw new Error("Error updating ATS score. The analysis service may be down.");
    }
});


// --- UPDATE: Update analytics data by calling external service ---
export const updateAnalyticsData = asyncHandler(async (req, res) => {
    const { resumeId } = req.params;

     if (!mongoose.Types.ObjectId.isValid(resumeId)) {
        res.status(400);
        throw new Error("Invalid Resume ID format");
    }

    const resume = await Resume.findById(resumeId);
    if (!resume) {
        res.status(404);
        throw new Error("Resume not found");
    }

    if (resume.userId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("You are not authorized to perform this action");
    }
    
    if (!resume.cloudinaryPath) {
        res.status(400);
        throw new Error("Resume does not have a valid file path to analyze");
    }

    try {
        const flaskResponse = await axios.post("http://127.0.0.1:5000/extract_details", {
            pdf_url: resume.cloudinaryPath
        });

        const analyticsData = flaskResponse.data;

        const updatedResume = await Resume.findByIdAndUpdate(
            resumeId,
            { analyticsData },
            { new: true }
        );

        res.status(200).json({
            message: "Analytics data updated successfully",
            success: true,
            resume: updatedResume,
        });

    } catch (error) {
        console.error("Error calling analytics service:", error.message);
        res.status(500);
        throw new Error("Error updating analytics data. The analysis service may be down.");
    }
});
