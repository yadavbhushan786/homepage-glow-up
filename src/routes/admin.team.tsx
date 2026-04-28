import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import { teamApi } from "@/lib/api";
import type { TeamMember } from "@/lib/types";
import { Field, MediaUpload } from "@/components/admin/Fields";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/team")({
  component: AdminTeam,
});

const empty = { name: "", role: "", image: "", bio: "", order: 99 };

function AdminTeam() {
  const [items, setItems] = useState<TeamMember[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<typeof empty>(empty);
  const [open, setOpen] = useState(false);

  const load = () => teamApi.list().then(setItems);
  useEffect(() => { load(); }, []);

  const startEdit = (m: TeamMember) => {
    setEditing(m._id);
    setForm({ name: m.name, role: m.role, image: m.image, bio: m.bio, order: m.order });
    setOpen(true);
  };
  const startNew = () => { setEditing(null); setForm(empty); setOpen(true); };
  const reset = () => { setEditing(null); setForm(empty); setOpen(false); };

  const save = async () => {
    if (!form.name.trim()) return toast.error("Name is required");
    if (editing) await teamApi.update(editing, form);
    else await teamApi.create(form);
    toast.success(editing ? "Updated" : "Created");
    reset(); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this member?")) return;
    await teamApi.remove(id);
    toast.success("Deleted");
    load();
  };

  return (
    <div className="space-y-6">
      <div className="a-card p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-[var(--a-text-soft)]">{items.length} team members</p>
        </div>
        <button onClick={startNew} className="a-btn a-btn-primary"><Plus className="size-4" /> Add member</button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((m, i) => (
          <div key={m._id} className="a-card a-card-hover p-5 group a-fade-in" style={{ animationDelay: `${i * 40}ms` }}>
            <div className="flex items-start gap-4">
              {m.image ? (
                <img src={m.image} alt={m.name} className="size-16 rounded-full object-cover border-2 border-[var(--a-border)]" />
              ) : (
                <div className="size-16 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0" style={{ background: "var(--a-grad)" }}>
                  {m.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="font-bold tracking-tight truncate">{m.name}</h3>
                <p className="text-xs text-[var(--a-accent)] font-semibold mt-0.5">{m.role}</p>
                <p className="text-xs text-[var(--a-text-muted)] mt-2 line-clamp-2 leading-relaxed">{m.bio}</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-1 mt-4 pt-4 border-t border-[var(--a-border)] opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => startEdit(m)} className="size-8 rounded-lg flex items-center justify-center hover:bg-[var(--a-accent-soft)] hover:text-[var(--a-accent)] transition-colors" title="Edit">
                <Pencil className="size-3.5" />
              </button>
              <button onClick={() => remove(m._id)} className="size-8 rounded-lg flex items-center justify-center hover:bg-[oklch(0.62_0.22_25/0.1)] hover:text-[var(--a-danger)] transition-colors" title="Delete">
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="a-card p-12 text-center">
          <Users className="size-10 mx-auto text-[var(--a-text-muted)] opacity-50" />
          <p className="mt-3 text-sm text-[var(--a-text-muted)]">No team members yet.</p>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex" onClick={reset}>
          <div className="flex-1 bg-black/40 backdrop-blur-sm a-fade-in" />
          <div className="w-full max-w-lg bg-[var(--a-surface)] border-l border-[var(--a-border)] p-6 overflow-y-auto a-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold tracking-tight">{editing ? "Edit member" : "Add member"}</h2>
              <button onClick={reset} className="size-8 rounded-lg hover:bg-[var(--a-surface-2)] flex items-center justify-center text-[var(--a-text-muted)]">✕</button>
            </div>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                <Field label="Role" value={form.role} onChange={(v) => setForm({ ...form, role: v })} />
              </div>
              <Field label="Order" type="number" value={String(form.order)} onChange={(v) => setForm({ ...form, order: Number(v) || 99 })} />
              <MediaUpload label="Photo" value={form.image} onChange={(v) => setForm({ ...form, image: v })} />
              <Field label="Bio" value={form.bio} onChange={(v) => setForm({ ...form, bio: v })} textarea rows={5} />
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
