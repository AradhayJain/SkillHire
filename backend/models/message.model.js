import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true, index: true },

  // sender can be a user or 'ai'
  senderType: { type: String, enum: ['user', 'ai'], required: true },
  senderId: { type: Schema.Types.ObjectId, ref: 'User' }, // null if senderType is 'ai'

  // receiver can be a user or 'ai'
  receiverType: { type: String, enum: ['user', 'ai'], required: true },
  receiverId: { type: Schema.Types.ObjectId, ref: 'User' }, // null if receiverType is 'ai'

  // content
  messageType: { type: String, enum: ['text', 'image', 'file'], required: true },
  messageText: {
    type: String,
    validate: {
      validator: function (v) {
        return this.messageType !== 'text' || (v && v.trim().length > 0);
      },
      message: 'Text messages must have messageText'
    }
  },
  attachmentUrl: {
    type: String,
    validate: {
      validator: function (v) {
        return this.messageType === 'text' || !!v;
      },
      message: 'Non-text messages must have an attachmentUrl'
    }
  },

  // status
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

export const Message = mongoose.model('Message', messageSchema);