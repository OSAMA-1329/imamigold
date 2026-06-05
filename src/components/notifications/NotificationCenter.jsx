import { useApp } from "../../context/AppContext.jsx";
import Sidebar from "../layout/Sidebar.jsx";
import MobileBottomNav from "../layout/MobileBottomNav.jsx";
import { Card } from "@/components/ui/card";
import { Bell, AtSign, MessageSquare, Megaphone, Hash } from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";

const iconMap = { mention: AtSign, message: MessageSquare, group: Hash, announcement: Megaphone, system: Bell };

export default function NotificationCenter() {
  const { notifs, markNotifsRead } = useApp();
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 pb-24 scrollbar-thin md:p-8 md:pb-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Notifications</h1>
              <p className="text-sm text-muted-foreground">Mentions, messages, and announcements.</p>
            </div>
            <button onClick={markNotifsRead} className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm hover:bg-accent">
              Mark all read
            </button>
          </div>
          <div className="space-y-2">
            {notifs.map((n) => {
              const Icon = iconMap[n.type] || Bell;
              return (
                <Card key={n.id} className={`flex items-start gap-3 p-4 ${n.unread ? "border-primary/30 bg-primary/5" : ""}`}>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-brand text-primary-foreground shadow-elegant">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-foreground">{n.text}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {formatDistanceToNowStrict(new Date(n.time))} ago
                    </div>
                  </div>
                  {n.unread && <span className="mt-1 h-2 w-2 rounded-full bg-primary" />}
                </Card>
              );
            })}
          </div>
        </div>
      </main>
      <MobileBottomNav />
    </div>
  );
}
