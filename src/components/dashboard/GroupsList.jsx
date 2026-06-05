import { useApp } from "../../context/AppContext.jsx";
import Sidebar from "../layout/Sidebar.jsx";
import MobileBottomNav from "../layout/MobileBottomNav.jsx";
import { Card } from "@/components/ui/card";
import { Hash, Users, Pin } from "lucide-react";

export default function GroupsList() {
  const { chats, setActiveChatId } = useApp();
  const groups = chats.filter((c) => c.type === "group");
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 pb-24 scrollbar-thin md:p-8 md:pb-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-1 text-2xl font-semibold">Groups</h1>
          <p className="mb-6 text-sm text-muted-foreground">{groups.length} active groups</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((g) => (
              <Card key={g.id} className="p-4">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-brand text-primary-foreground shadow-elegant">
                    <Hash className="h-5 w-5" />
                  </div>
                  {g.pinned && <Pin className="h-4 w-4 text-primary" />}
                </div>
                <h3 className="text-sm font-semibold">{g.name}</h3>
                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{g.description}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" />{g.members.length}</span>
                  <button onClick={() => setActiveChatId(g.id)} className="font-medium text-primary hover:underline">Open</button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <MobileBottomNav />
    </div>
  );
}
