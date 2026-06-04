import { useApp } from "../../context/AppContext.jsx";
import Sidebar from "../layout/Sidebar.jsx";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users, MessageSquare, Hash, Activity, Bell, Wifi, TrendingUp, ArrowUpRight,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from "recharts";
import { chartData, activityFeed } from "../../data/mockData";
import { formatDistanceToNowStrict } from "date-fns";

const stat = (label, value, icon, delta, tint) => ({ label, value, icon, delta, tint });

const palette = ["hsl(217 91% 60%)", "hsl(263 78% 60%)", "hsl(142 71% 45%)", "hsl(38 92% 50%)", "hsl(0 84% 60%)"];

export default function AdminDashboard() {
  const { users, chats, notifs } = useApp();
  const groups = chats.filter((c) => c.type === "group");
  const direct = chats.filter((c) => c.type === "direct");
  const online = users.filter((u) => u.online);
  const messagesToday = chats.reduce((sum, c) => sum + c.messages.length, 0);

  const stats = [
    stat("Total Users", users.length, Users, "+3 this week", "from-primary to-secondary"),
    stat("Total Groups", groups.length, Hash, `${groups.length} active`, "from-secondary to-primary"),
    stat("Active Chats", direct.length + groups.length, MessageSquare, "+12% vs last wk", "from-success to-primary"),
    stat("Online Users", online.length, Wifi, `${Math.round((online.length / users.length) * 100)}% of team`, "from-primary to-warning"),
    stat("Messages Today", messagesToday, Activity, "+248 since 8am", "from-warning to-secondary"),
    stat("Pending Notifs", notifs.filter((n) => n.unread).length, Bell, "Needs review", "from-destructive to-secondary"),
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="mx-auto max-w-7xl p-6 lg:p-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Real-time overview of communication activity.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs">
              <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
              All systems operational
            </div>
          </div>

          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {stats.map((s) => (
              <Card key={s.label} className="relative overflow-hidden p-4">
                <div className={`absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${s.tint} opacity-15 blur-2xl`} />
                <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${s.tint} text-primary-foreground shadow-elegant`}>
                  <s.icon className="h-4 w-4" />
                </div>
                <div className="text-2xl font-semibold tabular-nums">{s.value}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{s.label}</div>
                <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-success">
                  <TrendingUp className="h-3 w-3" /> {s.delta}
                </div>
              </Card>
            ))}
          </div>

          <div className="mb-6 grid gap-4 lg:grid-cols-3">
            <Card className="p-4 lg:col-span-2">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold">User Activity</h3>
                <span className="text-xs text-muted-foreground">Last 7 days</span>
              </div>
              <div className="h-56">
                <ResponsiveContainer>
                  <AreaChart data={chartData.activity}>
                    <defs>
                      <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(217 91% 60%)" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="hsl(217 91% 60%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Area type="monotone" dataKey="messages" stroke="hsl(217 91% 60%)" fill="url(#g1)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold">Group Usage</h3>
              </div>
              <div className="h-56">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={chartData.groups} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70}>
                      {chartData.groups.map((_, i) => <Cell key={i} fill={palette[i % palette.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="p-4 lg:col-span-2">
              <h3 className="mb-3 text-sm font-semibold">Chat Volume by Hour</h3>
              <div className="h-56">
                <ResponsiveContainer>
                  <BarChart data={chartData.volume}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" />
                    <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="direct" stackId="a" fill="hsl(217 91% 60%)" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="group" stackId="a" fill="hsl(263 78% 60%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold">Recent Activity</h3>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="space-y-3">
                {activityFeed.map((a) => (
                  <div key={a.id} className="flex items-start gap-3">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${a.actor}`} />
                      <AvatarFallback>{a.actor.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1 text-xs">
                      <div className="text-foreground">
                        <span className="font-medium">{a.actor}</span>{" "}
                        <span className="text-muted-foreground">{a.action}</span>{" "}
                        <span className="font-medium">{a.target}</span>
                      </div>
                      <div className="mt-0.5 text-[10px] text-muted-foreground">
                        {formatDistanceToNowStrict(new Date(a.time))} ago
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
