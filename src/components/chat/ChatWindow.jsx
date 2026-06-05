import { useEffect, useRef, useState } from "react";
import { useApp } from "../../context/AppContext.jsx";
import { findUser } from "../../data/mockData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Send, Paperclip, Smile, Mic, MoreVertical, Phone, Video, Info,
  CheckCheck, Check, Pin, Reply, Trash2, Copy, Hash,
} from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ChatWindow({ onToggleDetails }) {
  const { activeChat, currentUser, sendMessage, deleteMessage, deleteChat, togglePin, toggleArchive, typing, setTyping } = useApp();
  const [draft, setDraft] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [activeChat?.messages?.length]);

  if (!activeChat) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-muted/30 p-8 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-elegant">
          <Send className="h-7 w-7" />
        </div>
        <h3 className="text-xl font-semibold">Pick a conversation</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Select a chat from the left to start messaging, or create a new group.
        </p>
      </div>
    );
  }

  const isGroup = activeChat.type === "group";
  const other =
    !isGroup && findUser(activeChat.participants.find((p) => p !== currentUser.id));

  const handleSend = (e) => {
    e?.preventDefault();
    sendMessage(activeChat.id, draft);
    setDraft("");
    setTyping(false);
  };

  return (
    <div className="flex flex-1 flex-col bg-background">
      <header className="flex items-center gap-3 border-b border-border bg-card px-4 py-3">
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src={isGroup ? activeChat.avatar : other?.avatar} />
            <AvatarFallback>
              {isGroup ? <Hash className="h-4 w-4" /> : other?.name?.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          {!isGroup && other?.online && (
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-success" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold">
            {isGroup ? activeChat.name : other?.name}
          </div>
          <div className="truncate text-xs text-muted-foreground">
            {isGroup
              ? `${activeChat.members.length} members · ${activeChat.members.filter((m) => findUser(m)?.online).length} online`
              : other?.online
              ? "Online"
              : `Last seen ${format(new Date(other?.lastSeen || Date.now()), "p")}`}
          </div>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <button className="rounded-lg p-2 hover:bg-accent" aria-label="Call"><Phone className="h-4 w-4" /></button>
          <button className="rounded-lg p-2 hover:bg-accent" aria-label="Video"><Video className="h-4 w-4" /></button>
          <button onClick={onToggleDetails} className="rounded-lg p-2 hover:bg-accent" aria-label="Details"><Info className="h-4 w-4" /></button>
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-lg p-2 hover:bg-accent" aria-label="More">
              <MoreVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => togglePin(activeChat.id)}>
                <Pin className="mr-2 h-4 w-4" />{activeChat.pinned ? "Unpin" : "Pin"} chat
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleArchive(activeChat.id)}>
                <Trash2 className="mr-2 h-4 w-4" />{activeChat.archived ? "Unarchive" : "Archive"}
              </DropdownMenuItem>
              {currentUser.role === "admin" && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => {
                      if (confirm("Delete this chat for everyone? This cannot be undone.")) {
                        deleteChat(activeChat.id);
                      }
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />Delete chat (Admin)
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin">
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          {activeChat.messages.map((m, idx) => {
            const sender = findUser(m.senderId);
            const mine = m.senderId === currentUser.id;
            const prev = activeChat.messages[idx - 1];
            const showAvatar = !mine && (!prev || prev.senderId !== m.senderId);
            return (
              <div key={m.id} className={`group flex items-end gap-2 ${mine ? "justify-end" : ""}`}>
                {!mine && (
                  <div className="w-8">
                    {showAvatar && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={sender?.avatar} />
                        <AvatarFallback>{sender?.name?.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                )}
                <div className={`max-w-[70%] ${mine ? "items-end" : "items-start"} flex flex-col`}>
                  {isGroup && !mine && showAvatar && (
                    <span className="mb-1 ml-3 text-[11px] font-medium text-muted-foreground">
                      {sender?.name}
                    </span>
                  )}
                  <div className="flex items-end gap-1.5">
                    {mine && (
                      <DropdownMenu>
                        <DropdownMenuTrigger className="opacity-0 transition-opacity group-hover:opacity-100">
                          <MoreVertical className="h-3.5 w-3.5 text-muted-foreground" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem><Reply className="mr-2 h-4 w-4" />Reply</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigator.clipboard?.writeText(m.text)}>
                            <Copy className="mr-2 h-4 w-4" />Copy
                          </DropdownMenuItem>
                          <DropdownMenuItem><Pin className="mr-2 h-4 w-4" />Pin</DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => deleteMessage(activeChat.id, m.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                    <div
                      className={`rounded-2xl px-3.5 py-2 text-sm shadow-sm ${
                        mine
                          ? "rounded-br-md bg-gradient-brand text-primary-foreground"
                          : "rounded-bl-md bg-card text-foreground"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                  <div className={`mt-1 flex items-center gap-1 px-2 text-[10px] text-muted-foreground ${mine ? "justify-end" : ""}`}>
                    {format(new Date(m.time), "p")}
                    {mine && (m.status === "read" ? <CheckCheck className="h-3 w-3 text-primary" /> : <Check className="h-3 w-3" />)}
                  </div>
                </div>
              </div>
            );
          })}
          {typing && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex gap-1">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
              </div>
              typing…
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSend} className="border-t border-border bg-card px-4 py-3">
        <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-border bg-background px-3 py-2 shadow-soft focus-within:ring-2 focus-within:ring-ring">
          <button type="button" className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent" aria-label="Attach">
            <Paperclip className="h-4 w-4" />
          </button>
          <textarea
            value={draft}
            onChange={(e) => { setDraft(e.target.value); setTyping(e.target.value.length > 0); }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
            }}
            rows={1}
            placeholder={`Message ${isGroup ? activeChat.name : other?.name || ""}`}
            className="max-h-32 min-h-[24px] flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button type="button" className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent" aria-label="Emoji">
            <Smile className="h-4 w-4" />
          </button>
          <button type="button" className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent" aria-label="Voice">
            <Mic className="h-4 w-4" />
          </button>
          <button
            type="submit"
            disabled={!draft.trim()}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand text-primary-foreground shadow-elegant transition-opacity disabled:opacity-40"
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
