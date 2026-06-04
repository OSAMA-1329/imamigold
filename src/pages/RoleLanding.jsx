import { Link } from "react-router-dom";
import { ShieldCheck, ShoppingCart, Warehouse, Store, ArrowRight } from "lucide-react";

const roles = [
  { to: "/admin", label: "Admin", desc: "Full system access, analytics & moderation", icon: ShieldCheck, tint: "from-primary to-secondary" },
  { to: "/purchase", label: "Purchase Staff", desc: "Bridge between wholesale & retail teams", icon: ShoppingCart, tint: "from-secondary to-primary" },
  { to: "/wholesale", label: "Wholesale", desc: "Coordinate with purchase team only", icon: Warehouse, tint: "from-primary to-success" },
  { to: "/retail", label: "Retail", desc: "Work with purchase staff & retail groups", icon: Store, tint: "from-warning to-secondary" },
];

export default function RoleLanding() {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-brand opacity-[0.08]" />
        <div className="mx-auto max-w-6xl px-6 pt-20 pb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs text-muted-foreground glass-panel">
            <span className="h-2 w-2 rounded-full bg-success" />
            Live demo · Frontend only
          </div>
          <h1 className="text-balance text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
            Business Communication Hub
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
            Enterprise chat connecting admin, purchase, wholesale and retail teams — with role-based access, groups and analytics.
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-5 px-6 pb-24 sm:grid-cols-2 lg:grid-cols-4">
        {roles.map((r) => (
          <Link
            key={r.to}
            to={r.to}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-elegant"
          >
            <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${r.tint} opacity-20 blur-2xl transition-opacity group-hover:opacity-40`} />
            <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${r.tint} text-primary-foreground shadow-elegant`}>
              <r.icon className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">{r.label}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
            <div className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">
              Open workspace <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
