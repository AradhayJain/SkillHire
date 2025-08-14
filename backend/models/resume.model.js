import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    analyticsData: mongoose.Schema.Types.Mixed,
    atsScore: Number,
    cloudinaryPath: String,
    updatesRemaining: { type: Number, default: 0 },
    ResumeString: mongoose.Schema.Types.Mixed, // Placeholder for resume string data
}, { timestamps: true });

export const Resume = mongoose.model('Resume', resumeSchema);