import { useState } from "react";
import { useApp } from "../../context/AppContext.jsx";
import { findUser } from "../../data/mockData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Pin, Hash, Users } from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";
import CreateGroupModal from "../groups/CreateGroupModal.jsx";

function lastMessagePreview(chat) {
  const m = chat.messages[chat.messages.length - 1];
  return m ? m.text : "No messages yet";
}

export default function ChatList() {
  const { myChats, activeChat, setActiveChatId, currentUser } = useApp();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("all");
  const [openModal, setOpenModal] = useState(false);

  const filtered = myChats.filter((c) => {
    if (tab === "direct" && c.type !== "direct") return false;
    if (tab === "groups" && c.type !== "group") return false;
    if (c.archived && tab !== "archived") return false;
    if (tab === "archived" && !c.archived) return false;
    if (!query) return true;
    const name =
      c.type === "group"
        ? c.name
        : findUser(c.participants.find((p) => p !== currentUser.id))?.name || "";
    return name.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div className="flex h-screen w-full max-w-sm flex-col border-r border-border bg-card md:w-80">
      <div className="border-b border-border p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Messages</h2>
          {(currentUser.role === "admin" || currentUser.role === "purchase") && (
            <button
              onClick={() => setOpenModal(true)}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand text-primary-foreground shadow-elegant transition-transform hover:scale-105"
              aria-label="New group"
            >
              <Plus className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search conversations"
            className="w-full bg-transparent outline-none"
          />
        </div>
        <div className="mt-3 flex gap-1 rounded-lg bg-muted p-1 text-xs">
          {[
            { id: "all", label: "All" },
            { id: "direct", label: "Direct" },
            { id: "groups", label: "Groups" },
            { id: "archived", label: "Archive" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 rounded-md px-2 py-1.5 font-medium transition-colors ${
                tab === t.id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {filtered.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center text-sm text-muted-foreground">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Search className="h-5 w-5" />
            </div>
            No conversations yet
          </div>
        )}
        {filtered.map((chat) => {
          const isActive = activeChat?.id === chat.id;
          const isGroup = chat.type === "group";
          const other =
            !isGroup && findUser(chat.participants.find((p) => p !== currentUser.id));
          const last = chat.messages[chat.messages.length - 1];
          return (
            <button
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={`flex w-full items-start gap-3 border-b border-border/50 px-4 py-3 text-left transition-colors ${
                isActive ? "bg-accent" : "hover:bg-accent/50"
              }`}
            >
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={isGroup ? chat.avatar : other?.avatar} />
                  <AvatarFallback>
                    {isGroup ? <Hash className="h-4 w-4" /> : other?.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                {!isGroup && other?.online && (
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-success" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <div className="truncate text-sm font-medium text-foreground">
                    {isGroup ? chat.name : other?.name}
                  </div>
                  {chat.pinned && <Pin className="h-3 w-3 text-primary" />}
                  {isGroup && (
                    <span className="ml-auto inline-flex items-center gap-0.5 text-[10px] text-muted-foreground">
                      <Users className="h-3 w-3" />
                      {chat.members.length}
                    </span>
                  )}
                </div>
                <div className="mt-0.5 flex items-center gap-2">
                  <p className="line-clamp-1 flex-1 text-xs text-muted-foreground">
                    {lastMessagePreview(chat)}
                  </p>
                  {last && (
                    <span className="shrink-0 text-[10px] text-muted-foreground">
                      {formatDistanceToNowStrict(new Date(last.time))}
                    </span>
                  )}
                </div>
              </div>
              {chat.unread > 0 && (
                <Badge className="ml-1 h-5 bg-primary px-1.5 text-[10px] text-primary-foreground">
                  {chat.unread}
                </Badge>
              )}
            </button>
          );
        })}
      </div>

      <CreateGroupModal open={openModal} onOpenChange={setOpenModal} />
    </div>
  );
}
