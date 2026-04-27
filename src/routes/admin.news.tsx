import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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

  const load = () => newsApi.list().then(setItems);
  useEffect(() => { load(); }, []);

  const startEdit = (n: NewsItem) => {
    setEditing(n._id);
    setForm({ title: n.title, date: n.date.slice(0, 10), excerpt: n.excerpt, body: n.body });
  };
  const reset = () => { setEditing(null); setForm(empty); };

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
    <div>
      <h1 className="text-3xl font-bold mb-2">News</h1>
      <p className="text-navy-ink/60 mb-8">Manage news and announcements.</p>

      <div className="bg-card rounded-2xl p-6 border border-navy-ink/5 shadow-[var(--shadow-soft)] space-y-4 mb-8">
        <h2 className="font-bold">{editing ? "Edit item" : "New item"}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          <Field label="Date" type="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} />
        </div>
        <Field label="Excerpt" value={form.excerpt} onChange={(v) => setForm({ ...form, excerpt: v })} textarea />
        <Field label="Body" value={form.body} onChange={(v) => setForm({ ...form, body: v })} textarea rows={6} />
        <div className="flex gap-2">
          <button onClick={save} className="bg-amber-brand text-navy-ink px-5 py-2 rounded-full text-sm font-bold hover:bg-amber-glow">
            {editing ? "Save changes" : "Publish"}
          </button>
          {editing && <button onClick={reset} className="px-5 py-2 rounded-full text-sm font-bold border border-navy-ink/15">Cancel</button>}
        </div>
      </div>

      <div className="space-y-2">
        {items.map((n) => (
          <div key={n._id} className="bg-card rounded-xl p-4 border border-navy-ink/5 flex items-center gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gold-deep">
                {new Date(n.date).toLocaleDateString()}
              </p>
              <p className="font-bold truncate">{n.title}</p>
            </div>
            <button onClick={() => startEdit(n)} className="text-xs font-bold text-amber-brand hover:underline">Edit</button>
            <button onClick={() => remove(n._id)} className="text-xs font-bold text-destructive hover:underline">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
