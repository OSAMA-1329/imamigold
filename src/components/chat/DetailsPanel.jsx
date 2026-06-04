import { useApp } from "../../context/AppContext.jsx";
import { findUser } from "../../data/mockData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileText, Image as ImageIcon, Bell, X, Users } from "lucide-react";

export default function DetailsPanel({ onClose }) {
  const { activeChat, currentUser } = useApp();
  if (!activeChat) return null;

  const isGroup = activeChat.type === "group";
  const other = !isGroup && findUser(activeChat.participants.find((p) => p !== currentUser.id));
  const members = isGroup ? activeChat.members.map(findUser).filter(Boolean) : [];

  return (
    <aside className="hidden h-screen w-80 shrink-0 flex-col border-l border-border bg-card lg:flex">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold">Details</h3>
        <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-accent" aria-label="Close">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="flex flex-col items-center border-b border-border px-4 py-6">
        <Avatar className="h-20 w-20">
          <AvatarImage src={isGroup ? activeChat.avatar : other?.avatar} />
          <AvatarFallback>{(isGroup ? activeChat.name : other?.name || "?").slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="mt-3 text-base font-semibold">{isGroup ? activeChat.name : other?.name}</div>
        <div className="text-xs text-muted-foreground">
          {isGroup ? activeChat.description : other?.title}
        </div>
        {isGroup && (
          <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-3 w-3" />
            {members.length} members
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin">
        {isGroup && (
          <section className="mb-6">
            <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Members</h4>
            <div className="space-y-1.5">
              {members.slice(0, 10).map((m) => (
                <div key={m.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-accent">
                  <div className="relative">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={m.avatar} />
                      <AvatarFallback>{m.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    {m.online && <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-card bg-success" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm">{m.name}</div>
                    <div className="text-[10px] capitalize text-muted-foreground">{m.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        <section className="mb-6">
          <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Shared files</h4>
          <div className="space-y-1.5">
            {[
              { name: "pricing-oct.pdf", size: "412 KB", icon: FileText },
              { name: "vendor-list.xlsx", size: "88 KB", icon: FileText },
              { name: "floor-plan.png", size: "1.2 MB", icon: ImageIcon },
            ].map((f) => (
              <div key={f.name} className="flex items-center gap-2 rounded-lg border border-border px-2 py-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-accent-foreground">
                  <f.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-medium">{f.name}</div>
                  <div className="text-[10px] text-muted-foreground">{f.size}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Settings</h4>
          <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
            <span className="flex items-center gap-2"><Bell className="h-4 w-4" />Notifications</span>
            <span className="text-xs text-muted-foreground">On</span>
          </div>
        </section>
      </div>
    </aside>
  );
}
