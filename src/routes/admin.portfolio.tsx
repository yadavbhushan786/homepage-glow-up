import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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

  const load = () => portfolioApi.list().then(setItems);
  useEffect(() => { load(); }, []);

  const startEdit = (c: PortfolioCompany) => {
    setEditing(c._id);
    setForm({ name: c.name, logo: c.logo, description: c.description, sector: c.sector, website: c.website });
  };
  const reset = () => { setEditing(null); setForm(empty); };

  const save = async () => {
    if (!form.name.trim()) return toast.error("Name is required");
    if (editing) {
      await portfolioApi.update(editing, form);
      toast.success("Updated");
    } else {
      await portfolioApi.create(form);
      toast.success("Created");
    }
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
    <div>
      <h1 className="text-3xl font-bold mb-2">Portfolio</h1>
      <p className="text-navy-ink/60 mb-8">Manage portfolio companies.</p>

      <div className="bg-card rounded-2xl p-6 border border-navy-ink/5 shadow-[var(--shadow-soft)] space-y-4 mb-8">
        <h2 className="font-bold">{editing ? "Edit company" : "New company"}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Field label="Sector" value={form.sector} onChange={(v) => setForm({ ...form, sector: v })} />
          <Field label="Website" value={form.website} onChange={(v) => setForm({ ...form, website: v })} />
          <MediaUpload label="Logo" value={form.logo} onChange={(v) => setForm({ ...form, logo: v })} />
        </div>
        <Field label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} textarea />
        <div className="flex gap-2">
          <button onClick={save} className="bg-amber-brand text-navy-ink px-5 py-2 rounded-full text-sm font-bold hover:bg-amber-glow">
            {editing ? "Save changes" : "Create"}
          </button>
          {editing && (
            <button onClick={reset} className="px-5 py-2 rounded-full text-sm font-bold border border-navy-ink/15">Cancel</button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {items.map((c) => (
          <div key={c._id} className="bg-card rounded-xl p-4 border border-navy-ink/5 flex items-center gap-4">
            <div className="size-10 rounded-lg bg-amber-brand/15 flex items-center justify-center font-bold text-sm text-gold-deep">
              {c.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold truncate">{c.name}</p>
              <p className="text-xs text-navy-ink/60 truncate">{c.sector} · {c.description}</p>
            </div>
            <button onClick={() => startEdit(c)} className="text-xs font-bold text-amber-brand hover:underline">Edit</button>
            <button onClick={() => remove(c._id)} className="text-xs font-bold text-destructive hover:underline">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
