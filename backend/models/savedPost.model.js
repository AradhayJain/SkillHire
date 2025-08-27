// models/SavedPost.js
import mongoose from "mongoose";

const savedPostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommunityPost",
      required: true,
    },
  },
  { timestamps: true }
);

// prevent duplicate saves of same post by same user
savedPostSchema.index({ userId: 1, postId: 1 }, { unique: true });

export const SavedPost = mongoose.model("SavedPost", savedPostSchema);
