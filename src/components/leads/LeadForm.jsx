import { useState, useRef, useCallback } from "react";
import { useLeads } from "../../context/LeadsContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { users } from "../../data/mockData";
import { Upload, X, User, Phone, Scale, UserCheck, FileText, Save, Send, RotateCcw, Image as ImageIcon } from "lucide-react";

const STATUSES = ["New", "Contacted", "Follow-up", "Converted", "Lost"];
const UNITS = ["MG", "GRAM", "KG"];

const empty = {
  image: "", customerName: "", mobile: "",
  quantity: "", unit: "GRAM",
  assignedTo: [], status: "New", remarks: "",
};

export default function LeadForm({ initial = null, onSaved }) {
  const { user } = useAuth();
  const { saveLead } = useLeads();
  const normalized = initial
    ? { ...initial, assignedTo: Array.isArray(initial.assignedTo) ? initial.assignedTo : (initial.assignedTo ? [initial.assignedTo] : []) }
    : empty;
  const [form, setForm] = useState(normalized);
  const [errors, setErrors] = useState({});
  const [drag, setDrag] = useState(false);
  const [toast, setToast] = useState("");
  const fileRef = useRef(null);

  const isAdmin = user?.role === "admin";
  const retailStaff = users.filter((u) => u.role === "retail");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors((e) => ({ ...e, image: "Image must be under 5MB" }));
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      set("image", ev.target.result);
      setErrors((e) => ({ ...e, image: undefined }));
    };
    reader.readAsDataURL(file);
  }, []);

  const onDrop = (e) => {
    e.preventDefault(); setDrag(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const validate = () => {
    setErrors({});
    return true;
  };

  const toggleStaff = (id) => {
    setForm((f) => ({
      ...f,
      assignedTo: f.assignedTo.includes(id)
        ? f.assignedTo.filter((s) => s !== id)
        : [...f.assignedTo, id],
    }));
  };

  const submit = (assign) => (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    const id = saveLead({ ...form, status: assign && form.assignedTo.length && form.status === "New" ? "Contacted" : form.status });
    setToast(assign ? "Lead assigned successfully" : "Lead saved");
    setTimeout(() => setToast(""), 2400);
    if (!initial) setForm(empty);
    onSaved?.(id);
  };

  const reset = () => { setForm(empty); setErrors({}); };

  return (
    <div className="mx-auto w-full max-w-4xl p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-400 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
          Lead Assignment
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isAdmin ? "Create and assign gold purchase leads to retail staff." : "Review your assigned leads."}
        </p>
      </div>

      <form className="space-y-5">
        {/* Section 1 */}
        <Card title="Lead Information" accent>
          <div className="grid gap-5 md:grid-cols-[220px_1fr]">
            <div>
              <Label>Lead Image</Label>
              <div
                onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={onDrop}
                onClick={() => fileRef.current?.click()}
                className={`group relative flex h-44 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-colors ${
                  drag ? "border-amber-500 bg-amber-50/60 dark:bg-amber-500/10" : "border-amber-300/60 bg-amber-50/30 hover:border-amber-400 dark:bg-amber-500/5"
                }`}
              >
                {form.image ? (
                  <>
                    <img src={form.image} alt="Lead preview" className="h-full w-full object-cover" />
                    <button type="button" onClick={(e) => { e.stopPropagation(); set("image", ""); }}
                      className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 px-3 text-center text-amber-700/80 dark:text-amber-300/80">
                    <Upload className="h-7 w-7" />
                    <div className="text-sm font-medium">Drop image or click</div>
                    <div className="text-[11px] text-muted-foreground">PNG, JPG · max 5MB</div>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0])} />
              </div>
              {errors.image && <Err>{errors.image}</Err>}
            </div>

            <div className="space-y-4">
              <Input icon={User} label="Customer Name" value={form.customerName}
                onChange={(v) => set("customerName", v)} error={errors.customerName}
                placeholder="e.g. Rajesh Kumar" />
              <Input icon={Phone} label="Mobile Number" value={form.mobile} type="tel"
                onChange={(v) => set("mobile", v)} error={errors.mobile}
                placeholder="+91 98765 43210" />
            </div>
          </div>
        </Card>

        {/* Section 2 */}
        <Card title="Gold Requirement" accent icon={Scale}>
          <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
            <div>
              <Label>Quantity</Label>
              <input type="number" min="0" step="any" value={form.quantity}
                onChange={(e) => set("quantity", e.target.value)}
                placeholder="500"
                className="h-11 w-full rounded-lg border border-amber-200/70 bg-background px-4 text-base shadow-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 dark:border-amber-500/30" />
              {errors.quantity && <Err>{errors.quantity}</Err>}
            </div>
            <div>
              <Label>Unit</Label>
              <select value={form.unit} onChange={(e) => set("unit", e.target.value)}
                className="h-11 w-full cursor-pointer rounded-lg border border-amber-200/70 bg-background px-4 text-base font-medium shadow-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 dark:border-amber-500/30">
                {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          {form.quantity && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 px-4 py-1.5 text-sm font-semibold text-white shadow">
              {form.quantity} {form.unit}
            </div>
          )}
        </Card>

        {/* Section 3 */}
        <Card title="Lead Assignment" accent icon={UserCheck}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Assigned Retail Staff {!isAdmin && <span className="text-xs font-normal text-muted-foreground">(view only)</span>}</Label>
              <select value={form.assignedTo} onChange={(e) => set("assignedTo", e.target.value)}
                disabled={!isAdmin}
                className="h-11 w-full cursor-pointer rounded-lg border border-amber-200/70 bg-background px-4 text-sm shadow-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 disabled:cursor-not-allowed disabled:opacity-60 dark:border-amber-500/30">
                <option value="">— Select staff —</option>
                {retailStaff.map((s) => <option key={s.id} value={s.id}>{s.name} · {s.dept}</option>)}
              </select>
              {errors.assignedTo && <Err>{errors.assignedTo}</Err>}
            </div>
            <div>
              <Label>Lead Status</Label>
              <select value={form.status} onChange={(e) => set("status", e.target.value)}
                className="h-11 w-full cursor-pointer rounded-lg border border-amber-200/70 bg-background px-4 text-sm shadow-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 dark:border-amber-500/30">
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </Card>

        {/* Section 4 */}
        <Card title="Notes" accent icon={FileText}>
          <Label>Remarks</Label>
          <textarea rows={4} value={form.remarks} onChange={(e) => set("remarks", e.target.value)}
            placeholder="Additional notes about this lead…"
            className="w-full resize-y rounded-lg border border-amber-200/70 bg-background px-4 py-3 text-sm shadow-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 dark:border-amber-500/30" />
        </Card>

        {/* Buttons */}
        <div className="sticky bottom-2 z-10 flex flex-col gap-2 rounded-xl border border-amber-200/60 bg-background/80 p-3 shadow-lg backdrop-blur sm:flex-row sm:justify-end dark:border-amber-500/20">
          <button type="button" onClick={reset}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-background px-5 text-sm font-medium hover:bg-muted">
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
          <button type="button" onClick={submit(false)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-amber-500 bg-background px-5 text-sm font-medium text-amber-700 hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-amber-500/10">
            <Save className="h-4 w-4" /> Save Lead
          </button>
          {isAdmin && (
            <button type="button" onClick={submit(true)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-500 px-6 text-sm font-semibold text-white shadow-lg shadow-amber-500/30 transition hover:opacity-95">
              <Send className="h-4 w-4" /> Assign Lead
            </button>
          )}
        </div>
      </form>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-600 to-yellow-500 px-5 py-2.5 text-sm font-medium text-white shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
}

function Card({ title, icon: Icon = ImageIcon, accent, children }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-amber-200/60 bg-card shadow-sm dark:border-amber-500/20">
      {accent && <div className="h-1 w-full bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600" />}
      <div className="border-b border-amber-100/60 bg-amber-50/40 px-5 py-3 dark:border-amber-500/10 dark:bg-amber-500/5">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-300">
          <Icon className="h-4 w-4" /> {title}
        </h2>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}
function Label({ children }) {
  return <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">{children}</label>;
}
function Err({ children }) {
  return <p className="mt-1 text-xs font-medium text-destructive">{children}</p>;
}
function Input({ icon: Icon, label, error, onChange, ...props }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className={`flex h-11 items-center gap-2 rounded-lg border bg-background px-3 shadow-sm transition focus-within:ring-2 focus-within:ring-amber-500/30 ${error ? "border-destructive" : "border-amber-200/70 focus-within:border-amber-500 dark:border-amber-500/30"}`}>
        <Icon className="h-4 w-4 text-amber-600/80" />
        <input {...props} onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
      </div>
      {error && <Err>{error}</Err>}
    </div>
  );
}
