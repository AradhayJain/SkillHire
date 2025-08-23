// controllers/message.controller.js
import { Chat } from "../models/chat.model.js";
import { Message } from "../models/message.model.js";
import mongoose from "mongoose";
import { getReceiverSocketId } from "../utils/socket.js";
// ==================== EXISTING FUNCTIONS ====================

// Get all chats where current user is a member
export const getChatForSideBar = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const chats = await Chat.find({ members: userId })
      .populate("lastMessage")
      .populate("members", "name email pic")
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (err) {
    console.error("Error fetching chats:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all messages for a selected chat
export const getMessages = async (req, res) => {
  try {
    const chatId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({ error: "Invalid chat id" });
    }

    const messages = await Message.find({ chatId })
      .populate("senderId", "name email pic")
      .sort({ createdAt: 1 });

    res.json(messages);
    // console.log(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Send a new message
export const sendMessage = async (req, res) => {
  try {
    const chatId = req.params.id;
    const { messageType, messageText, attachmentUrl } = req.body;
    const senderId = req.user?._id;
    const io = req.io;

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({ error: "Invalid chat id" });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ error: "Chat not found" });
    }

    const newMessage = new Message({
      chatId,
      senderType: "user",
      senderId,
      messageType,
      messageText,
      attachmentUrl,
    });

    // Use Promise.all to save the new message and update the chat document concurrently
    await Promise.all([
      newMessage.save(),
      Chat.findByIdAndUpdate(chatId, {
        lastMessage: newMessage._id,
        lastMessageAt: new Date(),
        $push: { messages: newMessage._id }, // This adds the message to the chat's array
      }),
    ]);

    // ✅ THIS IS THE FIX:
    // Re-query the message to correctly populate sender details.
    // .populate() must be called on a Mongoose query, not a document instance.
    const populatedMessage = await Message.findById(newMessage._id)
        .populate("senderId", "name email pic");

    // --- Real-time logic ---
    io.to(chatId).emit("receiveMessage", populatedMessage);

    const recipients = chat.members.filter(
      (member) => member.toString() !== senderId.toString()
    );

    recipients.forEach((recipientId) => {
      const recipientSocketId = getReceiverSocketId(recipientId.toString());
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("newMessageNotification", populatedMessage);
      }
    });
    // --- End real-time logic ---

    res.status(201).json(populatedMessage);

  } catch (err) {
    // Log the actual error on the server for debugging
    console.error("Error sending message:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ==================== NEW FUNCTION ====================

// Create a new chat
// Create a new chat
export const newChat = async (req, res) => {
  try {
    const { chatType, members, chatName } = req.body;

    if (!["private", "group", "ai"].includes(chatType)) {
      return res.status(400).json({ error: "Invalid chat type" });
    }

    if (!members || members.length === 0) {
      return res.status(400).json({ error: "Chat must have at least one member" });
    }

    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    // Ensure current user is always part of the chat
    const uniqueMembers = [...new Set([...members, userId.toString()])];

    // ===== Duplicate check for private chat =====
    if (chatType === "private") {
      if (uniqueMembers.length !== 2) {
        return res.status(400).json({ error: "Private chat must have exactly 2 members" });
      }

      const existingChat = await Chat.findOne({
        chatType: "private",
        members: { $all: uniqueMembers, $size: 2 },
      }).populate("members", "name email");

      if (existingChat) {
        return res.status(200).json(existingChat); // return existing instead of new
      }
    }

    // ===== Create new chat =====
    const chat = new Chat({
      chatType,
      members: uniqueMembers,
      chatName: chatType === "group" || chatType === "ai" ? chatName : undefined,
    });

    await chat.save();

    const populatedChat = await Chat.findById(chat._id)
      .populate("members", "name email");

    res.status(201).json(populatedChat);
  } catch (err) {
    console.error("Error creating chat:", err);
    res.status(500).json({ error: "Server error" });
  }
};

