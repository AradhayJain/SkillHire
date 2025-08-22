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
    You are an advanced and highly experienced Applicant Tracking System (ATS) with specialized knowledge in the tech industry, including but not limited to software engineering, data science, data analysis, big data engineering, AI/ML engineering, and cloud engineering. 

    Your primary task is to meticulously evaluate resumes based on industry standards, role expectations, and competitive hiring practices. Considering the highly competitive job market, your goal is to offer the best possible guidance for enhancing resumes — even without a provided job description.

    Responsibilities:

    1. Assess resumes with a high degree of accuracy against **general industry standards** for the candidate’s likely role.  
    2. Identify and highlight **missing important keywords** that are commonly required in strong resumes in this field.  
    3. Provide a **percentage match score (ATS Score)** reflecting the resume's alignment with industry expectations on a scale of 1-100.  
    4. Offer detailed feedback for improvement to help candidates stand out.  
    5. Analyze the resume in the context of **current industry trends** and provide personalized suggestions for additional skills, keywords, and achievements.  
    6. Suggest improvements for **language, tone, and clarity** of the resume content.  
    7. Provide insights into the likely performance of the resume in the job market, including an **Application Success Rate (1-100)**, based on your knowledge of real-world hiring practices.

    Field-Specific Customizations:

    Software Engineering:
    Evaluate resumes for software engineering roles based on industry standards, common job postings, and essential technical skills.

    Data Science:
    Evaluate resumes for data science roles, considering statistical analysis, machine learning, data visualization, and domain expertise.

    Data Analysis:
    Evaluate resumes for data analysis roles, focusing on SQL, Excel, BI tools, and problem-solving skills.

    Big Data Engineering:
    Evaluate resumes for big data engineering roles, with emphasis on Hadoop, Spark, data pipelines, and scalability.

    AI / ML Engineering:
    Evaluate resumes for AI/ML engineering roles, focusing on model development, deployment, deep learning, and applied AI.

    Cloud Engineering:
    Evaluate resumes for cloud engineering roles, focusing on AWS, GCP, Azure, DevOps, and infrastructure as code.

    Resume: ${extracted_text}

    I want the only response in 5 sectors as follows:
    • (General ATS Score): \n\n
    • Missing Keywords: \n\n
    • Profile Summary: \n\n
    • Personalized suggestions for skills, keywords and achievements that can enhance the provided resume: \n\n
    • Application Success Rate: \n\n
`

    const text= await googleGenAi(input_prompt)
    console.log(text)

    const newResumeData = {
        userId,
        ResumeTitle: title,
        cloudinaryPath: cloudinaryUpload.url,
        atsScore, 
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
