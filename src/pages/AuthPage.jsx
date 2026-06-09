import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Sparkles, Mail, Lock, User, ShieldCheck, ShoppingCart, Warehouse, Store } from "lucide-react";

const roleOptions = [
  { value: "admin", label: "Admin", icon: ShieldCheck },
  { value: "purchase", label: "Purchase", icon: ShoppingCart },
  { value: "wholesale", label: "Wholesale", icon: Warehouse },
  { value: "retail", label: "Retail", icon: Store },
];

const homeFor = (role) => `/${role}`;

export default function AuthPage() {
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("signin");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "retail" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={homeFor(user.role)} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      const u = mode === "signin"
        ? await signIn(form.email, form.password)
        : await signUp(form);
      navigate(homeFor(u.role), { replace: true });
    } catch (err) {
      setError(err.message);
    } finally { setBusy(false); }
  };

  const quickFill = (email) => setForm((f) => ({ ...f, email, password: "password" }));

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 -z-10 bg-gradient-brand opacity-[0.08]" />
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand shadow-elegant">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <div className="text-lg font-semibold leading-tight">ImamiHub</div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Gold Retail Management</div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-elegant glass-panel">
          <div className="mb-5 flex gap-1 rounded-lg bg-muted p-1 text-sm">
            {["signin", "signup"].map((t) => (
              <button key={t} onClick={() => { setMode(t); setError(""); }}
                className={`flex-1 rounded-md px-3 py-1.5 font-medium transition-colors ${
                  mode === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                }`}>
                {t === "signin" ? "Sign in" : "Sign up"}
              </button>
            ))}
          </div>

          <h1 className="text-xl font-semibold">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "signin" ? "Sign in to access your workspace." : "Pick a role to get started."}
          </p>

          <form onSubmit={submit} className="mt-5 space-y-3">
            {mode === "signup" && (
              <Field icon={User} placeholder="Full name" value={form.name}
                onChange={(v) => setForm({ ...form, name: v })} required />
            )}
            <Field icon={Mail} type="email" placeholder="Email" value={form.email}
              onChange={(v) => setForm({ ...form, email: v })} required />
            <Field icon={Lock} type="password" placeholder="Password" value={form.password}
              onChange={(v) => setForm({ ...form, password: v })} required minLength={4} />

            {mode === "signup" && (
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Role</label>
                <div className="grid grid-cols-2 gap-2">
                  {roleOptions.map((r) => (
                    <button type="button" key={r.value}
                      onClick={() => setForm({ ...form, role: r.value })}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                        form.role === r.value
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border bg-background text-muted-foreground hover:text-foreground"
                      }`}>
                      <r.icon className="h-4 w-4" /> {r.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</div>}

            <button type="submit" disabled={busy}
              className="flex w-full items-center justify-center rounded-lg bg-gradient-brand px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-elegant transition-opacity disabled:opacity-60">
              {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          {mode === "signin" && (
            <div className="mt-5 rounded-lg border border-dashed border-border bg-muted/40 p-3 text-xs">
              <div className="mb-1.5 font-medium text-foreground">Demo accounts (password: <code>password</code>)</div>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  ["Admin", "alex.morgan@imamihub.com"],
                  ["Purchase", "sara.chen@imamihub.com"],
                  ["Wholesale", "northwind.supply@imamihub.com"],
                  ["Retail", "maya.reeves@imamihub.com"],
                ].map(([l, e]) => (
                  <button key={e} type="button" onClick={() => quickFill(e)}
                    className="rounded-md border border-border bg-card px-2 py-1.5 text-left hover:bg-accent">
                    <div className="font-medium text-foreground">{l}</div>
                    <div className="truncate text-[10px] text-muted-foreground">{e}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ icon: Icon, ...props }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-ring">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <input {...props} onChange={(e) => props.onChange(e.target.value)}
        className="w-full bg-transparent outline-none placeholder:text-muted-foreground" />
    </div>
  );
}
