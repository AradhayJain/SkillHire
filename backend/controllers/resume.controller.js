import { Resume } from "../models/resume.model.js";
import asyncHandler from "express-async-handler";
import uploadOnCloudinary, { deleteFromCloudinary } from "../utils/cloudinary.js";
import googleGenAi from "../utils/Gemini.js";
import axios from "axios";
import mongoose from "mongoose";

// --- CREATE: Upload a new resume and perform initial analysis ---
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

    // --- Perform full analysis on initial upload using the single endpoint ---
    let analyticsData = {};
    let atsScore = 0;
    try {
        // Call the single Flask service endpoint
        const flaskResponse = await axios.post("http://127.0.0.1:5000/extract_details", { 
            pdf_url: cloudinaryUpload.url 
        });

        // Extract data from the new unified response structure
        analyticsData = flaskResponse.data || {}; // Save the entire response as analytics
        atsScore = flaskResponse.data?.ats_result?.ats_score || 0; // Safely access the ATS score
        console.log("Flask service response:", flaskResponse.data);
        
        console.log("Initial Analysis Complete:", { analyticsData, atsScore });


    } catch (error) {
        console.error("Error calling Flask service during upload:", error.message);
        // Proceeding with default values, but you could throw an error here.
    }
    const extracted_text = analyticsData.extracted_text || "";
    const input_prompt = `
You are an advanced and highly experienced Applicant Tracking System (ATS) specializing in tech roles such as Software Engineering, Data Science, Data Analysis, Big Data Engineering, AI/ML Engineering, and Cloud Engineering. 

Your job is to **evaluate resumes** with precision, providing measurable insights aligned with current industry standards.

Instructions:
- Read the resume carefully.  
- Respond ONLY in **valid JSON**.  
- Do NOT include markdown formatting, code fences, or explanations.  
- Output MUST be plain JSON that matches the schema exactly.  

Schema:
{
  "General_ATS_Score": "Number (1-100)",
  "Application_Success_Rate": "Number (1-100)"
}

Resume Text:
${extracted_text}
`



const atsInsights = await googleGenAi(input_prompt);
console.log("ATS Score:", atsInsights.General_ATS_Score);
console.log("Application Success Rate:", atsInsights.Application_Success_Rate);
console.log("Suggestions:", atsInsights.Personalized_Suggestions);

    const newResumeData = {
        userId,
        ResumeTitle: title,
        cloudinaryPath: cloudinaryUpload.url,
        atsScore:atsInsights.General_ATS_Score, 
        analyticsData, 
        updatesRemaining: 0, 
        ResumeString: analyticsData.extracted_text || "", 
        ResumeCategory:analyticsData.predicted_label
    };

    const resume = await Resume.create(newResumeData);

    res.status(201).json({
        message: "Resume uploaded and analyzed successfully",
        success: true,
        resume,
    });
});


// --- READ: Get all resumes for the logged-in user ---
export const getResumes = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const resumes = await Resume.find({ userId }).sort({ createdAt: -1 });
    // console.log(resumes)

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
        
        resume.cloudinaryPath = newUpload.url;
        
        // --- Re-run full analysis when a new file is uploaded ---
        try {
            const flaskResponse = await axios.post("http://127.0.0.1:5000/extract_one", { 
                pdf_url: newUpload.url 
            });
            
            resume.analyticsData = flaskResponse.data;
            resume.atsScore = flaskResponse.data?.ats_result?.ats_score || 0;
            resume.ResumeString = flaskResponse.data.extracted_text || resume.ResumeString;
            resume.ResumeCategory = flaskResponse.data.predicted_label || resume.ResumeCategory;
            console.log("Resume updated with new file and analysis:", {
                analyticsData: resume.analyticsData,
                atsScore: resume.atsScore
            });

        } catch (error) {
            console.error("Error calling Flask services during update:", error.message);
        }

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
    console.log("Resume updated:",{
        id: updatedResume.id,
        title: updatedResume.ResumeTitle,
        cloudinaryPath: updatedResume.cloudinaryPath,
        analyticsData: updatedResume.analyticsData,
        atsScore: updatedResume.atsScore,
        ResumeCategory: updatedResume.ResumeCategory
    })

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

// --- GET: Get ATS score from the database ---
export const getAtsScore = asyncHandler(async (req, res) => {
    const { resumeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(resumeId)) {
        res.status(400);
        throw new Error("Invalid Resume ID format");
    }

    const resume = await Resume.findById(resumeId).select('atsScore ResumeTitle');
    if (!resume) {
        res.status(404);
        throw new Error("Resume not found");
    }

    if (resume.userId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("You are not authorized to view this data");
    }

    res.status(200).json({
        message: "ATS score fetched successfully",
        success: true,
        resume: {
            _id: resume._id,
            ResumeTitle: resume.ResumeTitle,
            ResumeCategory: resume.ResumeCategory,
            atsScore: resume.atsScore
        },
    });
});


// --- GET: Get analytics data from the database ---
export const getAnalyticsData = asyncHandler(async (req, res) => {
    const { resumeId } = req.params;

     if (!mongoose.Types.ObjectId.isValid(resumeId)) {
        res.status(400);
        throw new Error("Invalid Resume ID format");
    }

    const resume = await Resume.findById(resumeId).select('analyticsData ResumeTitle');
    if (!resume) {
        res.status(404);
        throw new Error("Resume not found");
    }

    if (resume.userId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("You are not authorized to view this data");
    }
    
    res.status(200).json({
        message: "Analytics data fetched successfully",
        success: true,
        resume: {
            _id: resume._id,
            ResumeTitle: resume.ResumeTitle,
            ResumeCategory: resume.ResumeCategory,
            analyticsData: resume.analyticsData
        },
    });
});

export const getResumesbyId = asyncHandler(async (req, res) => {
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
        throw new Error("You are not authorized to view this resume");
    }

    res.status(200).json({
        message: "Resume fetched successfully",
        success: true,
        resume,
    });
}
);
