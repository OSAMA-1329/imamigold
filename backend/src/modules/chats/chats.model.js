import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, default: "" },
    attachments: [{ url: String, name: String, type: String }],
    status: { type: String, enum: ["sent", "delivered", "read"], default: "sent" },
    reactions: [{ userId: mongoose.Schema.Types.ObjectId, emoji: String }],
  },
  { timestamps: { createdAt: "time", updatedAt: true } }
);

const chatSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["direct", "group"], required: true },
    name: { type: String, default: "" },
    description: { type: String, default: "" },
    avatar: { type: String, default: "" },
    category: { type: String, default: "custom" },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    messages: [messageSchema],
    pinned: { type: Boolean, default: false },
    archived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Chat = mongoose.model("Chat", chatSchema);
