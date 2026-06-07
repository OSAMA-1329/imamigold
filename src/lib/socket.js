// Socket.IO client wrapper.
// Configure the URL and auth in .env (see .env.example).
// All chat realtime events go through this single instance.

import { io } from "socket.io-client";

const URL = import.meta.env.VITE_SOCKET_URL || "";
const PATH = import.meta.env.VITE_SOCKET_PATH || "/socket.io";
const TOKEN_KEY = import.meta.env.VITE_AUTH_TOKEN_STORAGE_KEY || "bch_token";

let socket = null;

/**
 * Get (or lazily create) the shared socket instance.
 * Returns null when VITE_SOCKET_URL is not set, so the app can fall back
 * to mock/local behaviour during development.
 */
export function getSocket() {
  if (!URL) return null;
  if (socket) return socket;

  socket = io(URL, {
    path: PATH,
    autoConnect: false,
    transports: ["websocket"],
    auth: (cb) => {
      const token =
        typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
      cb({ token });
    },
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
  });

  return socket;
}

export function connectSocket() {
  const s = getSocket();
  if (s && !s.connected) s.connect();
  return s;
}

export function disconnectSocket() {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
}

// ----- Event name constants (keep client + server in sync) -----
export const SOCKET_EVENTS = {
  // outgoing (client -> server)
  JOIN_CHAT: "chat:join",
  LEAVE_CHAT: "chat:leave",
  SEND_MESSAGE: "message:send",
  DELETE_MESSAGE: "message:delete",
  DELETE_CHAT: "chat:delete",
  TYPING: "chat:typing",
  READ: "message:read",

  // incoming (server -> client)
  MESSAGE_NEW: "message:new",
  MESSAGE_DELETED: "message:deleted",
  MESSAGE_STATUS: "message:status",
  CHAT_DELETED: "chat:deleted",
  PRESENCE: "presence:update",
  TYPING_UPDATE: "chat:typing:update",
};
