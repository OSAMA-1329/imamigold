import { Link, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  MessageSquare, Users, Bell, LayoutDashboard, Hash, LogOut,
} from "lucide-react";

const navByRole = {
  admin: [
    { to: "/admin", icon: LayoutDashboard, label: "Home", end: true },
    { to: "/admin/chats", icon: MessageSquare, label: "Chats" },
    { to: "/admin/groups", icon: Hash, label: "Groups" },
    { to: "/admin/users", icon: Users, label: "Users" },
    { to: "/admin/notifications", icon: Bell, label: "Alerts" },
  ],
  purchase: [
    { to: "/purchase", icon: MessageSquare, label: "Chats", end: true },
    { to: "/purchase/groups", icon: Hash, label: "Groups" },
    { to: "/purchase/notifications", icon: Bell, label: "Alerts" },
  ],
  wholesale: [
    { to: "/wholesale", icon: MessageSquare, label: "Chats", end: true },
    { to: "/wholesale/notifications", icon: Bell, label: "Alerts" },
  ],
  retail: [
    { to: "/retail", icon: MessageSquare, label: "Chats", end: true },
    { to: "/retail/groups", icon: Hash, label: "Groups" },
    { to: "/retail/notifications", icon: Bell, label: "Alerts" },
  ],
};

export default function MobileBottomNav() {
  const { role, notifs } = useApp();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const items = navByRole[role] || [];
  const unread = notifs.filter((n) => n.unread).length;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-border bg-card/95 px-2 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden"
      aria-label="Primary"
    >
      {items.map((item) => {
        const active = item.end ? pathname === item.to : pathname.startsWith(item.to);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`relative flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 text-[10px] font-medium transition-colors ${
              active ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="truncate">{item.label}</span>
            {item.label === "Alerts" && unread > 0 && (
              <span className="absolute right-2 top-1 h-1.5 w-1.5 rounded-full bg-destructive" />
            )}
            {active && (
              <span className="absolute -top-1 h-0.5 w-8 rounded-full bg-gradient-brand" />
            )}
          </Link>
        );
      })}
      <button
        onClick={() => { signOut(); navigate("/auth", { replace: true }); }}
        className="flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 text-[10px] font-medium text-muted-foreground hover:text-foreground"
        aria-label="Sign out"
      >
        <LogOut className="h-5 w-5" />
        <span>Exit</span>
      </button>
    </nav>
  );
}
