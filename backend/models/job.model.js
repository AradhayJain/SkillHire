import mongoose from "mongoose";

const appliedJobSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    coverLetter: String,
    jobTitle: String,
    jobDesc: String,
    jobLink: String,
    resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', required: true }
  }, { timestamps: true });

export const AppliedJob = mongoose.model('AppliedJob', appliedJobSchema);
