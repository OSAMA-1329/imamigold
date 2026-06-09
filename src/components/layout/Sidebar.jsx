import { Link, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  MessageSquare, Users, Bell, LayoutDashboard, Search, Settings,
  LogOut, Hash, Pin, Archive, Sparkles, ShieldCheck,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const navByRole = {
  admin: [
    { to: "/admin", icon: LayoutDashboard, label: "Dashboard", end: true },
    { to: "/admin/chats", icon: MessageSquare, label: "Chats" },
    { to: "/admin/groups", icon: Hash, label: "Groups" },
    { to: "/admin/users", icon: Users, label: "Users" },
    { to: "/admin/notifications", icon: Bell, label: "Notifications" },
  ],
  purchase: [
    { to: "/purchase", icon: MessageSquare, label: "Chats", end: true },
    { to: "/purchase/groups", icon: Hash, label: "Groups" },
    { to: "/purchase/notifications", icon: Bell, label: "Notifications" },
  ],
  wholesale: [
    { to: "/wholesale", icon: MessageSquare, label: "Chats", end: true },
    { to: "/wholesale/notifications", icon: Bell, label: "Notifications" },
  ],
  retail: [
    { to: "/retail", icon: MessageSquare, label: "Chats", end: true },
    { to: "/retail/groups", icon: Hash, label: "Groups" },
    { to: "/retail/notifications", icon: Bell, label: "Notifications" },
  ],
};

export default function Sidebar() {
  const { currentUser, role, notifs } = useApp();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const items = navByRole[role];
  const unreadCount = notifs.filter((n) => n.unread).length;
  const handleSignOut = () => { signOut(); navigate("/auth", { replace: true }); };

  return (
    <aside className="hidden h-screen w-64 shrink-0 flex-col bg-[var(--color-sidebar)] text-[var(--color-sidebar-foreground)] md:flex">
      <div className="flex items-center gap-2 px-5 pt-5 pb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-brand shadow-elegant">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <div className="text-sm font-semibold leading-tight">ImamiHub</div>
          <div className="text-[11px] uppercase tracking-wider text-[var(--color-sidebar-foreground)]/60">
            Communication
          </div>
        </div>
      </div>

      <div className="mx-3 mb-3 rounded-xl bg-[var(--color-sidebar-accent)] p-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-9 w-9">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback>{currentUser.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--color-sidebar-accent)] bg-success" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">{currentUser.name}</div>
            <div className="flex items-center gap-1 text-[11px] capitalize text-[var(--color-sidebar-foreground)]/70">
              {role === "admin" && <ShieldCheck className="h-3 w-3" />}
              {currentUser.title}
            </div>
          </div>
        </div>
      </div>

      <div className="px-3 pb-2">
        <div className="flex items-center gap-2 rounded-lg bg-[var(--color-sidebar-accent)] px-3 py-2 text-sm text-[var(--color-sidebar-foreground)]/70">
          <Search className="h-4 w-4" />
          <input
            placeholder="Search…"
            className="w-full bg-transparent outline-none placeholder:text-[var(--color-sidebar-foreground)]/50"
          />
          <kbd className="rounded bg-[var(--color-sidebar)] px-1.5 py-0.5 text-[10px] text-[var(--color-sidebar-foreground)]/60">⌘K</kbd>
        </div>
      </div>

      <nav className="mt-2 flex-1 overflow-y-auto px-2 scrollbar-thin">
        <div className="px-2 pb-1 pt-3 text-[10px] font-medium uppercase tracking-wider text-[var(--color-sidebar-foreground)]/50">
          Workspace
        </div>
        {items.map((item) => {
          const active = item.end ? pathname === item.to : pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-gradient-brand text-primary-foreground shadow-elegant"
                  : "text-[var(--color-sidebar-foreground)]/80 hover:bg-[var(--color-sidebar-accent)] hover:text-[var(--color-sidebar-foreground)]"
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span className="flex-1">{item.label}</span>
              {item.label === "Notifications" && unreadCount > 0 && (
                <Badge className="h-5 bg-destructive px-1.5 text-[10px]">{unreadCount}</Badge>
              )}
            </Link>
          );
        })}

        <div className="px-2 pb-1 pt-5 text-[10px] font-medium uppercase tracking-wider text-[var(--color-sidebar-foreground)]/50">
          Quick filters
        </div>
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--color-sidebar-foreground)]/80 hover:bg-[var(--color-sidebar-accent)]">
          <Pin className="h-4 w-4" /> Pinned
        </button>
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--color-sidebar-foreground)]/80 hover:bg-[var(--color-sidebar-accent)]">
          <Archive className="h-4 w-4" /> Archived
        </button>
      </nav>

      <div className="border-t border-[var(--color-sidebar-border)] p-3">
        <button onClick={handleSignOut} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--color-sidebar-foreground)]/70 hover:bg-[var(--color-sidebar-accent)]">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-[var(--color-sidebar-foreground)]/70 hover:bg-[var(--color-sidebar-accent)]">
          <Settings className="h-4 w-4" /> Settings
        </button>
      </div>
    </aside>
  );
}
