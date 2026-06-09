import { useMemo, useState } from "react";
import { useLeads } from "../../context/LeadsContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { users } from "../../data/mockData";
import { Link } from "react-router-dom";
import { Plus, Phone, Scale, User as UserIcon, Trash2, Pencil } from "lucide-react";

const statusColor = {
  New: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  Contacted: "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300",
  "Follow-up": "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  Converted: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  Lost: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
};

export default function LeadsList({ basePath }) {
  const { user } = useAuth();
  const { leads, deleteLead } = useLeads();
  const [filter, setFilter] = useState("All");
  const isAdmin = user?.role === "admin";

  const visible = useMemo(() => {
    const list = isAdmin ? leads : leads.filter((l) => l.assignedTo === user?.id);
    return filter === "All" ? list : list.filter((l) => l.status === filter);
  }, [leads, isAdmin, user, filter]);

  const staffName = (id) => users.find((u) => u.id === id)?.name || "—";

  return (
    <div className="mx-auto w-full max-w-6xl p-4 sm:p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-400 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
            {isAdmin ? "All Leads" : "My Assigned Leads"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{visible.length} lead{visible.length !== 1 && "s"}</p>
        </div>
        {isAdmin && (
          <Link to={`${basePath}/new`}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-500 px-4 text-sm font-semibold text-white shadow-lg shadow-amber-500/30 hover:opacity-95">
            <Plus className="h-4 w-4" /> New Lead
          </Link>
        )}
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {["All", "New", "Contacted", "Follow-up", "Converted", "Lost"].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              filter === s ? "bg-amber-500 text-white shadow" : "border border-border bg-background hover:bg-muted"
            }`}>{s}</button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-amber-300/60 bg-amber-50/30 p-12 text-center dark:bg-amber-500/5">
          <p className="text-muted-foreground">No leads to display.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((l) => (
            <div key={l.id} className="group overflow-hidden rounded-2xl border border-amber-200/60 bg-card shadow-sm transition hover:shadow-lg dark:border-amber-500/20">
              <div className="h-1 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600" />
              <div className="flex gap-3 p-4">
                {l.image ? (
                  <img src={l.image} alt={l.customerName} className="h-16 w-16 shrink-0 rounded-xl object-cover" />
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-yellow-200 text-amber-700">
                    <UserIcon className="h-6 w-6" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="truncate font-semibold">{l.customerName}</h3>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusColor[l.status] || ""}`}>
                      {l.status}
                    </span>
                  </div>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <Phone className="h-3 w-3" /> {l.mobile}
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
                    <Scale className="h-3 w-3" /> {l.quantity} {l.unit}
                  </p>
                </div>
              </div>
              <div className="border-t border-amber-100/60 bg-amber-50/30 px-4 py-2.5 text-xs dark:border-amber-500/10 dark:bg-amber-500/5">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Assigned: <span className="font-medium text-foreground">{staffName(l.assignedTo)}</span></span>
                  {isAdmin && (
                    <div className="flex gap-1">
                      <Link to={`${basePath}/${l.id}`} className="rounded p-1 hover:bg-amber-100 dark:hover:bg-amber-500/20"><Pencil className="h-3.5 w-3.5" /></Link>
                      <button onClick={() => deleteLead(l.id)} className="rounded p-1 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-500/20"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  )}
                </div>
                {l.remarks && <p className="mt-1.5 line-clamp-2 text-muted-foreground">{l.remarks}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
