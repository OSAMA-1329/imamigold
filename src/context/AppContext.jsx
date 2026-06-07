import { createContext, useContext, useMemo, useState, useCallback, useEffect, useRef } from "react";
import { users, directChats, groupChats, notifications as seedNotifs } from "../data/mockData";
import { visibleChats } from "../utils/permissions";
import { useAuth } from "./AuthContext.jsx";
import { connectSocket, disconnectSocket, getSocket, SOCKET_EVENTS } from "../lib/socket";

const AppContext = createContext(null);

const defaultUserByRole = {
  admin: "u-admin-1",
  purchase: "u-pur-1",
  wholesale: "u-whl-1",
  retail: "u-ret-1",
};

export function AppProvider({ children, role = "admin" }) {
  const { user: authUser } = useAuth();
  const currentUserId = authUser?.id && users.find((u) => u.id === authUser.id)
    ? authUser.id
    : defaultUserByRole[authUser?.role || role];

  const [chats, setChats] = useState([...directChats, ...groupChats]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [notifs, setNotifs] = useState(seedNotifs);
  const [typing, setTypingLocal] = useState(false);
  const [theme, setTheme] = useState("light");
  const [socketConnected, setSocketConnected] = useState(false);
  const typingEmitRef = useRef(0);

  const currentUser = useMemo(
    () => users.find((u) => u.id === currentUserId) || users[0],
    [currentUserId]
  );

  const myChats = useMemo(
    () => visibleChats(currentUser, chats).sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)),
    [currentUser, chats]
  );

  const activeChat = useMemo(
    () => (activeChatId ? chats.find((c) => c.id === activeChatId) : null),
    [chats, activeChatId]
  );

  // ----- Socket.IO lifecycle -----
  useEffect(() => {
    const s = connectSocket();
    if (!s) return; // No socket URL configured — stay in local/mock mode.

    const onConnect = () => setSocketConnected(true);
    const onDisconnect = () => setSocketConnected(false);

    const onNewMessage = ({ chatId, message }) => {
      setChats((prev) =>
        prev.map((c) =>
          c.id === chatId
            ? { ...c, messages: [...c.messages, message], unread: (c.unread || 0) + (message.senderId !== currentUserId ? 1 : 0) }
            : c
        )
      );
    };

    const onMessageDeleted = ({ chatId, messageId }) => {
      setChats((prev) =>
        prev.map((c) =>
          c.id === chatId ? { ...c, messages: c.messages.filter((m) => m.id !== messageId) } : c
        )
      );
    };

    const onMessageStatus = ({ chatId, messageId, status }) => {
      setChats((prev) =>
        prev.map((c) =>
          c.id === chatId
            ? { ...c, messages: c.messages.map((m) => (m.id === messageId ? { ...m, status } : m)) }
            : c
        )
      );
    };

    const onChatDeleted = ({ chatId }) => {
      setChats((prev) => prev.filter((c) => c.id !== chatId));
      setActiveChatId((id) => (id === chatId ? null : id));
    };

    const onTypingUpdate = ({ chatId, userId, isTyping }) => {
      if (userId === currentUserId) return;
      setTypingLocal((prev) => (activeChatId === chatId ? isTyping : prev));
    };

    s.on("connect", onConnect);
    s.on("disconnect", onDisconnect);
    s.on(SOCKET_EVENTS.MESSAGE_NEW, onNewMessage);
    s.on(SOCKET_EVENTS.MESSAGE_DELETED, onMessageDeleted);
    s.on(SOCKET_EVENTS.MESSAGE_STATUS, onMessageStatus);
    s.on(SOCKET_EVENTS.CHAT_DELETED, onChatDeleted);
    s.on(SOCKET_EVENTS.TYPING_UPDATE, onTypingUpdate);

    return () => {
      s.off("connect", onConnect);
      s.off("disconnect", onDisconnect);
      s.off(SOCKET_EVENTS.MESSAGE_NEW, onNewMessage);
      s.off(SOCKET_EVENTS.MESSAGE_DELETED, onMessageDeleted);
      s.off(SOCKET_EVENTS.MESSAGE_STATUS, onMessageStatus);
      s.off(SOCKET_EVENTS.CHAT_DELETED, onChatDeleted);
      s.off(SOCKET_EVENTS.TYPING_UPDATE, onTypingUpdate);
    };
  }, [currentUserId, activeChatId]);

  // Sign-out → drop the socket so the next user reconnects with their token.
  useEffect(() => {
    if (!authUser) disconnectSocket();
  }, [authUser]);

  // Join/leave rooms when active chat changes.
  useEffect(() => {
    const s = getSocket();
    if (!s || !activeChatId) return;
    s.emit(SOCKET_EVENTS.JOIN_CHAT, { chatId: activeChatId });
    return () => s.emit(SOCKET_EVENTS.LEAVE_CHAT, { chatId: activeChatId });
  }, [activeChatId]);

  const sendMessage = useCallback((chatId, text) => {
    if (!text.trim()) return;
    const message = {
      id: `msg-${Date.now()}`,
      senderId: currentUserId,
      text,
      time: new Date().toISOString(),
      status: "sent",
      reactions: [],
    };

    // Optimistic local update.
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, messages: [...c.messages, message] } : c))
    );

    const s = getSocket();
    if (s?.connected) {
      s.emit(SOCKET_EVENTS.SEND_MESSAGE, { chatId, message }, (ack) => {
        if (ack?.ok && ack.message) {
          setChats((prev) =>
            prev.map((c) =>
              c.id === chatId
                ? { ...c, messages: c.messages.map((m) => (m.id === message.id ? { ...m, ...ack.message } : m)) }
                : c
            )
          );
        }
      });
    }
  }, [currentUserId]);

  const deleteMessage = useCallback((chatId, msgId) => {
    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId ? { ...c, messages: c.messages.filter((m) => m.id !== msgId) } : c
      )
    );
    getSocket()?.emit(SOCKET_EVENTS.DELETE_MESSAGE, { chatId, messageId: msgId });
  }, []);

  const togglePin = useCallback((chatId) => {
    setChats((prev) => prev.map((c) => (c.id === chatId ? { ...c, pinned: !c.pinned } : c)));
  }, []);

  const toggleArchive = useCallback((chatId) => {
    setChats((prev) => prev.map((c) => (c.id === chatId ? { ...c, archived: !c.archived } : c)));
  }, []);

  const deleteChat = useCallback((chatId) => {
    setChats((prev) => prev.filter((c) => c.id !== chatId));
    setActiveChatId((id) => (id === chatId ? null : id));
    getSocket()?.emit(SOCKET_EVENTS.DELETE_CHAT, { chatId });
  }, []);

  const createGroup = useCallback((data) => {
    const id = `grp-${Date.now()}`;
    setChats((prev) => [
      ...prev,
      {
        id,
        type: "group",
        name: data.name,
        description: data.description || "",
        avatar: `https://api.dicebear.com/7.x/shapes/svg?seed=${id}`,
        category: data.category || "custom",
        members: [currentUserId, ...data.members],
        pinned: false,
        unread: 0,
        messages: [],
      },
    ]);
    setActiveChatId(id);
  }, [currentUserId]);

  const markNotifsRead = useCallback(() => {
    setNotifs((prev) => prev.map((n) => ({ ...n, unread: false })));
  }, []);

  // Throttled typing emitter (max 1 emit / 1.5s) + auto-stop.
  const setTyping = useCallback((isTyping) => {
    setTypingLocal(isTyping);
    const s = getSocket();
    if (!s?.connected || !activeChatId) return;
    const now = Date.now();
    if (isTyping && now - typingEmitRef.current > 1500) {
      typingEmitRef.current = now;
      s.emit(SOCKET_EVENTS.TYPING, { chatId: activeChatId, isTyping: true });
    } else if (!isTyping) {
      s.emit(SOCKET_EVENTS.TYPING, { chatId: activeChatId, isTyping: false });
    }
  }, [activeChatId]);

  const value = {
    users, currentUser, currentUserId,
    chats, myChats, activeChat, activeChatId, setActiveChatId,
    sendMessage, deleteMessage, togglePin, toggleArchive, deleteChat, createGroup,
    notifs, markNotifsRead,
    typing, setTyping,
    theme, setTheme,
    role,
    socketConnected,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
};
