import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, Plus, Pencil, Trash2, LayoutGrid, List, Briefcase, ExternalLink } from "lucide-react";
import { portfolioApi } from "@/lib/api";
import type { PortfolioCompany } from "@/lib/types";
import { Field, MediaUpload } from "@/components/admin/Fields";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/portfolio")({
  component: AdminPortfolio,
});

const empty = { name: "", logo: "", description: "", sector: "", website: "" };

function AdminPortfolio() {
  const [items, setItems] = useState<PortfolioCompany[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState<string>("all");

  const load = () => portfolioApi.list().then(setItems);
  useEffect(() => { load(); }, []);

  const sectors = useMemo(() => ["all", ...Array.from(new Set(items.map((i) => i.sector).filter(Boolean)))], [items]);
  const filtered = useMemo(() =>
    items.filter((i) =>
      (sector === "all" || i.sector === sector) &&
      (i.name.toLowerCase().includes(query.toLowerCase()) || i.description.toLowerCase().includes(query.toLowerCase()))
    ), [items, query, sector]);

  const startEdit = (c: PortfolioCompany) => {
    setEditing(c._id);
    setForm({ name: c.name, logo: c.logo, description: c.description, sector: c.sector, website: c.website });
    setOpen(true);
  };
  const startNew = () => { setEditing(null); setForm(empty); setOpen(true); };
  const reset = () => { setEditing(null); setForm(empty); setOpen(false); };

  const save = async () => {
    if (!form.name.trim()) return toast.error("Name is required");
    if (editing) await portfolioApi.update(editing, form);
    else await portfolioApi.create(form);
    toast.success(editing ? "Updated" : "Created");
    reset();
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this company?")) return;
    await portfolioApi.remove(id);
    toast.success("Deleted");
    load();
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="a-card p-4 flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="relative flex-1 min-w-0 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--a-text-muted)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search portfolio…"
              className="a-input pl-10"
            />
          </div>
          <select value={sector} onChange={(e) => setSector(e.target.value)} className="a-input w-auto">
            {sectors.map((s) => <option key={s} value={s}>{s === "all" ? "All sectors" : s}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-[var(--a-border)] p-1">
            <button onClick={() => setView("grid")} className={`p-1.5 rounded-lg transition-colors ${view === "grid" ? "bg-[var(--a-accent-soft)] text-[var(--a-accent)]" : "text-[var(--a-text-muted)]"}`}>
              <LayoutGrid className="size-4" />
            </button>
            <button onClick={() => setView("list")} className={`p-1.5 rounded-lg transition-colors ${view === "list" ? "bg-[var(--a-accent-soft)] text-[var(--a-accent)]" : "text-[var(--a-text-muted)]"}`}>
              <List className="size-4" />
            </button>
          </div>
          <button onClick={startNew} className="a-btn a-btn-primary"><Plus className="size-4" /> Add company</button>
        </div>
      </div>

      {/* Items */}
      {view === "grid" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c, i) => (
            <div key={c._id} className="a-card a-card-hover p-5 a-fade-in group" style={{ animationDelay: `${i * 40}ms` }}>
              <div className="flex items-start justify-between">
                {c.logo ? (
                  <img src={c.logo} alt={c.name} className="size-12 rounded-xl object-cover border border-[var(--a-border)]" />
                ) : (
                  <div className="size-12 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: "var(--a-grad)" }}>
                    {c.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <span className="a-chip">{c.sector || "—"}</span>
              </div>
              <h3 className="mt-4 font-bold tracking-tight">{c.name}</h3>
              <p className="text-sm text-[var(--a-text-soft)] mt-1.5 line-clamp-2 leading-relaxed">{c.description}</p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--a-border)]">
                <a href={c.website || "#"} target="_blank" rel="noreferrer" className="text-xs font-semibold text-[var(--a-accent)] inline-flex items-center gap-1 hover:gap-1.5 transition-all">
                  Visit <ExternalLink className="size-3" />
                </a>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => startEdit(c)} className="size-8 rounded-lg flex items-center justify-center hover:bg-[var(--a-accent-soft)] hover:text-[var(--a-accent)] transition-colors" title="Edit">
                    <Pencil className="size-3.5" />
                  </button>
                  <button onClick={() => remove(c._id)} className="size-8 rounded-lg flex items-center justify-center hover:bg-[oklch(0.62_0.22_25/0.1)] hover:text-[var(--a-danger)] transition-colors" title="Delete">
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="a-card overflow-hidden">
          {filtered.map((c) => (
            <div key={c._id} className="flex items-center gap-4 p-4 border-b border-[var(--a-border)] last:border-b-0 hover:bg-[var(--a-surface-2)] transition-colors">
              <div className="size-10 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: "var(--a-grad)" }}>
                {c.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold truncate">{c.name}</div>
                <div className="text-xs text-[var(--a-text-muted)] truncate">{c.sector} · {c.description}</div>
              </div>
              <button onClick={() => startEdit(c)} className="a-btn a-btn-ghost"><Pencil className="size-3.5" /> Edit</button>
              <button onClick={() => remove(c._id)} className="text-xs font-semibold text-[var(--a-danger)] hover:underline">Delete</button>
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="a-card p-12 text-center">
          <Briefcase className="size-10 mx-auto text-[var(--a-text-muted)] opacity-50" />
          <p className="mt-3 text-sm text-[var(--a-text-muted)]">No companies match your filters.</p>
        </div>
      )}

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex" onClick={reset}>
          <div className="flex-1 bg-black/40 backdrop-blur-sm a-fade-in" />
          <div className="w-full max-w-lg bg-[var(--a-surface)] border-l border-[var(--a-border)] p-6 overflow-y-auto a-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold tracking-tight">{editing ? "Edit company" : "Add company"}</h2>
              <button onClick={reset} className="size-8 rounded-lg hover:bg-[var(--a-surface-2)] flex items-center justify-center text-[var(--a-text-muted)]">✕</button>
            </div>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                <Field label="Sector" value={form.sector} onChange={(v) => setForm({ ...form, sector: v })} />
              </div>
              <Field label="Website" value={form.website} onChange={(v) => setForm({ ...form, website: v })} placeholder="https://" />
              <MediaUpload label="Logo" value={form.logo} onChange={(v) => setForm({ ...form, logo: v })} />
              <Field label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} textarea />
              <div className="flex gap-2 pt-2">
                <button onClick={save} className="a-btn a-btn-primary flex-1">{editing ? "Save changes" : "Create"}</button>
                <button onClick={reset} className="a-btn a-btn-ghost">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
