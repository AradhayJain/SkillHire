import mongoose from "mongoose";

const appliedJobSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    coverLetter: String,
    jobTitle: String,
    jobDesc: String,
    jobLink: String,
    resumeId: { type: Schema.Types.ObjectId, ref: 'Resume', required: true }
  }, { timestamps: true });

export const AppliedJob = mongoose.model('AppliedJob', appliedJobSchema);
