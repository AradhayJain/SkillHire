import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    analyticsData: Schema.Types.Mixed,
    atsScore: Number,
    cloudinaryPath: String,
    updatesRemaining: { type: Number, default: 0 }
}, { timestamps: true });

export const Resume = mongoose.model('Resume', resumeSchema);