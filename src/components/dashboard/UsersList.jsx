import { useApp } from "../../context/AppContext.jsx";
import Sidebar from "../layout/Sidebar.jsx";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function UsersList() {
  const { users } = useApp();
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8 scrollbar-thin">
        <div className="mx-auto max-w-5xl">
          <h1 className="mb-1 text-2xl font-semibold">Users</h1>
          <p className="mb-6 text-sm text-muted-foreground">{users.length} accounts · {users.filter(u=>u.online).length} online</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {users.map((u) => (
              <Card key={u.id} className="flex items-center gap-3 p-4">
                <div className="relative">
                  <Avatar className="h-11 w-11">
                    <AvatarImage src={u.avatar} />
                    <AvatarFallback>{u.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  {u.online && <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-success" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="truncate text-sm font-medium">{u.name}</div>
                    <Badge variant="secondary" className="capitalize">{u.role}</Badge>
                  </div>
                  <div className="truncate text-xs text-muted-foreground">{u.title} · {u.dept}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
