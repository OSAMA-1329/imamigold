import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { Chat } from "../modules/chats/chats.model.js";

export const EVENTS = {
  JOIN_CHAT: "chat:join",
  LEAVE_CHAT: "chat:leave",
  SEND_MESSAGE: "message:send",
  DELETE_MESSAGE: "message:delete",
  DELETE_CHAT: "chat:delete",
  TYPING: "chat:typing",
  READ: "message:read",

  MESSAGE_NEW: "message:new",
  MESSAGE_DELETED: "message:deleted",
  MESSAGE_STATUS: "message:status",
  CHAT_DELETED: "chat:deleted",
  PRESENCE: "presence:update",
  TYPING_UPDATE: "chat:typing:update",
};

export function attachSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: env.clientOrigin, credentials: true },
    path: "/socket.io",
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Unauthorized"));
      const payload = jwt.verify(token, env.jwtSecret);
      socket.user = { id: payload.sub, role: payload.role, name: payload.name };
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(`user:${socket.user.id}`);
    io.emit(EVENTS.PRESENCE, { userId: socket.user.id, online: true });

    socket.on(EVENTS.JOIN_CHAT, ({ chatId }) => chatId && socket.join(`chat:${chatId}`));
    socket.on(EVENTS.LEAVE_CHAT, ({ chatId }) => chatId && socket.leave(`chat:${chatId}`));

    socket.on(EVENTS.SEND_MESSAGE, async ({ chatId, message }, ack) => {
      try {
        const chat = await Chat.findById(chatId);
        if (!chat) return ack?.({ ok: false, error: "chat not found" });
        const saved = {
          senderId: socket.user.id,
          text: message?.text || "",
          attachments: message?.attachments || [],
          status: "sent",
          reactions: [],
        };
        chat.messages.push(saved);
        await chat.save();
        const stored = chat.messages[chat.messages.length - 1];
        io.to(`chat:${chatId}`).emit(EVENTS.MESSAGE_NEW, { chatId, message: stored });
        ack?.({ ok: true, message: stored });
      } catch (err) {
        ack?.({ ok: false, error: err.message });
      }
    });

    socket.on(EVENTS.DELETE_MESSAGE, async ({ chatId, messageId }) => {
      const chat = await Chat.findById(chatId);
      if (!chat) return;
      const msg = chat.messages.id(messageId);
      if (!msg) return;
      if (socket.user.role !== "admin" && msg.senderId.toString() !== socket.user.id) return;
      msg.deleteOne();
      await chat.save();
      io.to(`chat:${chatId}`).emit(EVENTS.MESSAGE_DELETED, { chatId, messageId });
    });

    socket.on(EVENTS.DELETE_CHAT, async ({ chatId }) => {
      if (socket.user.role !== "admin") return;
      await Chat.findByIdAndDelete(chatId);
      io.to(`chat:${chatId}`).emit(EVENTS.CHAT_DELETED, { chatId });
    });

    socket.on(EVENTS.TYPING, ({ chatId, isTyping }) => {
      socket.to(`chat:${chatId}`).emit(EVENTS.TYPING_UPDATE, {
        chatId,
        userId: socket.user.id,
        isTyping: !!isTyping,
      });
    });

    socket.on("disconnect", () => {
      io.emit(EVENTS.PRESENCE, { userId: socket.user.id, online: false });
    });
  });

  return io;
}
