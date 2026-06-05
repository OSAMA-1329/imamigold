import { createContext, useContext, useMemo, useState, useCallback } from "react";
import { users, directChats, groupChats, notifications as seedNotifs } from "../data/mockData";
import { visibleChats } from "../utils/permissions";
import { useAuth } from "./AuthContext.jsx";

const AppContext = createContext(null);

const defaultUserByRole = {
  admin: "u-admin-1",
  purchase: "u-pur-1",
  wholesale: "u-whl-1",
  retail: "u-ret-1",
};

export function AppProvider({ children, role = "admin" }) {
  const { user: authUser } = useAuth();
  // Auth user takes precedence; fall back to seed user for the role.
  const currentUserId = authUser?.id && users.find((u) => u.id === authUser.id)
    ? authUser.id
    : defaultUserByRole[authUser?.role || role];

  const [chats, setChats] = useState([...directChats, ...groupChats]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [notifs, setNotifs] = useState(seedNotifs);
  const [typing, setTyping] = useState(false);
  const [theme, setTheme] = useState("light");

  const currentUser = useMemo(
    () => users.find((u) => u.id === currentUserId) || users[0],
    [currentUserId]
  );

  const myChats = useMemo(
    () => visibleChats(currentUser, chats).sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)),
    [currentUser, chats]
  );

  const activeChat = useMemo(
    () => chats.find((c) => c.id === activeChatId) || myChats[0] || null,
    [chats, activeChatId, myChats]
  );

  const sendMessage = useCallback((chatId, text) => {
    if (!text.trim()) return;
    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId
          ? {
              ...c,
              messages: [
                ...c.messages,
                {
                  id: `msg-${Date.now()}`,
                  senderId: currentUserId,
                  text,
                  time: new Date().toISOString(),
                  status: "sent",
                  reactions: [],
                },
              ],
            }
          : c
      )
    );
  }, [currentUserId]);

  const deleteMessage = useCallback((chatId, msgId) => {
    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId ? { ...c, messages: c.messages.filter((m) => m.id !== msgId) } : c
      )
    );
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

  const value = {
    users, currentUser, currentUserId,
    chats, myChats, activeChat, activeChatId, setActiveChatId,
    sendMessage, deleteMessage, togglePin, toggleArchive, deleteChat, createGroup,
    notifs, markNotifsRead,
    typing, setTyping,
    theme, setTheme,
    role,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
};
