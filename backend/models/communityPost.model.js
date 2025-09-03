import mongoose from "mongoose";

const communitySchema = new mongoose.Schema({
    description: String,
    upvotes: [{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
    downvotes: [{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' ,required: false },
    tags: [String],
    comments: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      commentText: String,
      createdAt: { type: Date, default: Date.now }
    }],
    image: String
  }, { timestamps: true });

export const CommunityPost = mongoose.model('CommunityPost', communitySchema);
  