import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Newspaper, Calendar } from "lucide-react";
import { newsApi } from "@/lib/api";
import type { NewsItem } from "@/lib/types";
import { Field } from "@/components/admin/Fields";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/news")({
  component: AdminNews,
});

const empty = { title: "", date: new Date().toISOString().slice(0, 10), excerpt: "", body: "" };

function AdminNews() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");

  const load = () => newsApi.list().then(setItems);
  useEffect(() => { load(); }, []);

  const startEdit = (n: NewsItem) => {
    setEditing(n._id);
    setForm({ title: n.title, date: n.date.slice(0, 10), excerpt: n.excerpt, body: n.body });
    setOpen(true);
  };
  const startNew = () => { setEditing(null); setForm(empty); setOpen(true); };
  const reset = () => { setEditing(null); setForm(empty); setOpen(false); };

  const save = async () => {
    if (!form.title.trim()) return toast.error("Title is required");
    const payload = { ...form, date: new Date(form.date).toISOString() };
    if (editing) await newsApi.update(editing, payload);
    else await newsApi.create(payload);
    toast.success(editing ? "Updated" : "Published");
    reset(); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this news item?")) return;
    await newsApi.remove(id);
    toast.success("Deleted");
    load();
  };

  return (
    <div className="space-y-6">
      <div className="a-card p-4 flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex gap-1 p-1 rounded-xl border border-[var(--a-border)]">
          {(["all", "published", "draft"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${filter === f ? "bg-[var(--a-accent-soft)] text-[var(--a-accent)]" : "text-[var(--a-text-muted)]"}`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <button onClick={startNew} className="a-btn a-btn-primary"><Plus className="size-4" /> New post</button>
      </div>

      <div className="a-card overflow-hidden">
        {items.map((n, i) => (
          <div key={n._id} className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 p-4 border-b border-[var(--a-border)] last:border-b-0 hover:bg-[var(--a-surface-2)] transition-colors a-fade-in" style={{ animationDelay: `${i * 30}ms` }}>
            <div className="size-10 rounded-xl flex items-center justify-center text-[var(--a-accent)] flex-shrink-0" style={{ background: "var(--a-accent-soft)" }}>
              <Newspaper className="size-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold truncate">{n.title}</span>
                <span className="a-chip" style={{ background: "oklch(0.7 0.16 155 / 0.12)", color: "var(--a-success)", borderColor: "oklch(0.7 0.16 155 / 0.2)" }}>
                  Published
                </span>
              </div>
              <div className="text-xs text-[var(--a-text-muted)] mt-0.5 truncate">{n.excerpt}</div>
            </div>
            <div className="text-xs text-[var(--a-text-muted)] inline-flex items-center gap-1.5 whitespace-nowrap">
              <Calendar className="size-3" /> {new Date(n.date).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => startEdit(n)} className="size-8 rounded-lg flex items-center justify-center hover:bg-[var(--a-accent-soft)] hover:text-[var(--a-accent)] transition-colors" title="Edit">
                <Pencil className="size-3.5" />
              </button>
              <button onClick={() => remove(n._id)} className="size-8 rounded-lg flex items-center justify-center hover:bg-[oklch(0.62_0.22_25/0.1)] hover:text-[var(--a-danger)] transition-colors" title="Delete">
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="p-12 text-center">
            <Newspaper className="size-10 mx-auto text-[var(--a-text-muted)] opacity-50" />
            <p className="mt-3 text-sm text-[var(--a-text-muted)]">No news yet.</p>
          </div>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex" onClick={reset}>
          <div className="flex-1 bg-black/40 backdrop-blur-sm a-fade-in" />
          <div className="w-full max-w-2xl bg-[var(--a-surface)] border-l border-[var(--a-border)] p-6 overflow-y-auto a-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold tracking-tight">{editing ? "Edit post" : "New post"}</h2>
              <button onClick={reset} className="size-8 rounded-lg hover:bg-[var(--a-surface-2)] flex items-center justify-center text-[var(--a-text-muted)]">✕</button>
            </div>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-[2fr_1fr] gap-4">
                <Field label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
                <Field label="Date" type="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} />
              </div>
              <Field label="Excerpt" value={form.excerpt} onChange={(v) => setForm({ ...form, excerpt: v })} textarea />
              <Field label="Body" value={form.body} onChange={(v) => setForm({ ...form, body: v })} textarea rows={8} />
              <div className="flex gap-2 pt-2">
                <button onClick={save} className="a-btn a-btn-primary flex-1">{editing ? "Save changes" : "Publish"}</button>
                <button onClick={reset} className="a-btn a-btn-ghost">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
