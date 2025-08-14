import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  chatType: { 
    type: String, 
    enum: ['private', 'group', 'ai'],
    required: true 
  },

  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  aiName: { type: String }, 
  chatName: String,

  lastMessageAt: Date
}, { timestamps: true });

export const Chat = mongoose.model('Chat', chatSchema);