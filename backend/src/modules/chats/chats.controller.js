import mongoose from "mongoose";
import { Chat } from "./chats.model.js";
import { HttpError } from "../../middleware/error.js";

const isMember = (chat, userId) =>
  chat.members.some((m) => m.toString() === userId);

export async function list(req, res) {
  const filter = req.user.role === "admin" ? {} : { members: req.user.id };
  const chats = await Chat.find(filter).sort({ updatedAt: -1 });
  res.json({ chats });
}

export async function get(req, res) {
  const chat = await Chat.findById(req.params.id).populate("members", "name email role avatar");
  if (!chat) throw new HttpError(404, "Chat not found");
  if (req.user.role !== "admin" && !isMember(chat, req.user.id))
    throw new HttpError(403, "Forbidden");
  res.json({ chat });
}

export async function createDirect(req, res) {
  const { otherUserId } = req.body;
  if (!otherUserId) throw new HttpError(400, "otherUserId required");
  const members = [req.user.id, otherUserId].sort();
  let chat = await Chat.findOne({ type: "direct", members: { $all: members, $size: 2 } });
  if (!chat) chat = await Chat.create({ type: "direct", members });
  res.status(201).json({ chat });
}

export async function sendMessage(req, res) {
  const chat = await Chat.findById(req.params.id);
  if (!chat) throw new HttpError(404, "Chat not found");
  if (req.user.role !== "admin" && !isMember(chat, req.user.id))
    throw new HttpError(403, "Forbidden");
  const msg = {
    _id: new mongoose.Types.ObjectId(),
    senderId: req.user.id,
    text: req.body.text || "",
    attachments: req.body.attachments || [],
    status: "sent",
    reactions: [],
  };
  chat.messages.push(msg);
  await chat.save();
  const saved = chat.messages[chat.messages.length - 1];

  // Broadcast over Socket.IO if available.
  const io = req.app.get("io");
  io?.to(`chat:${chat._id}`).emit("message:new", { chatId: chat._id.toString(), message: saved });

  res.status(201).json({ message: saved });
}

export async function deleteMessage(req, res) {
  const chat = await Chat.findById(req.params.id);
  if (!chat) throw new HttpError(404, "Chat not found");
  const msg = chat.messages.id(req.params.mid);
  if (!msg) throw new HttpError(404, "Message not found");
  if (req.user.role !== "admin" && msg.senderId.toString() !== req.user.id)
    throw new HttpError(403, "Forbidden");
  msg.deleteOne();
  await chat.save();
  req.app.get("io")?.to(`chat:${chat._id}`).emit("message:deleted", {
    chatId: chat._id.toString(),
    messageId: req.params.mid,
  });
  res.json({ ok: true });
}

export async function remove(req, res) {
  if (req.user.role !== "admin") throw new HttpError(403, "Forbidden");
  await Chat.findByIdAndDelete(req.params.id);
  req.app.get("io")?.to(`chat:${req.params.id}`).emit("chat:deleted", { chatId: req.params.id });
  res.json({ ok: true });
}
