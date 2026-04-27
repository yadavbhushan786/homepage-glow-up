import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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

  const load = () => teamApi.list().then(setItems);
  useEffect(() => { load(); }, []);

  const startEdit = (m: TeamMember) => {
    setEditing(m._id);
    setForm({ name: m.name, role: m.role, image: m.image, bio: m.bio, order: m.order });
  };
  const reset = () => { setEditing(null); setForm(empty); };

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
    <div>
      <h1 className="text-3xl font-bold mb-2">Team</h1>
      <p className="text-navy-ink/60 mb-8">Manage team members.</p>

      <div className="bg-card rounded-2xl p-6 border border-navy-ink/5 shadow-[var(--shadow-soft)] space-y-4 mb-8">
        <h2 className="font-bold">{editing ? "Edit member" : "New member"}</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Field label="Role" value={form.role} onChange={(v) => setForm({ ...form, role: v })} />
          <Field label="Order" type="number" value={String(form.order)} onChange={(v) => setForm({ ...form, order: Number(v) || 99 })} />
          <MediaUpload label="Photo" value={form.image} onChange={(v) => setForm({ ...form, image: v })} />
        </div>
        <Field label="Bio" value={form.bio} onChange={(v) => setForm({ ...form, bio: v })} textarea />
        <div className="flex gap-2">
          <button onClick={save} className="bg-amber-brand text-navy-ink px-5 py-2 rounded-full text-sm font-bold hover:bg-amber-glow">
            {editing ? "Save changes" : "Create"}
          </button>
          {editing && <button onClick={reset} className="px-5 py-2 rounded-full text-sm font-bold border border-navy-ink/15">Cancel</button>}
        </div>
      </div>

      <div className="space-y-2">
        {items.map((m) => (
          <div key={m._id} className="bg-card rounded-xl p-4 border border-navy-ink/5 flex items-center gap-4">
            <div className="size-10 rounded-lg bg-navy-ink text-cream-warm flex items-center justify-center font-bold text-sm">
              {m.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold truncate">{m.name}</p>
              <p className="text-xs text-navy-ink/60 truncate">{m.role}</p>
            </div>
            <button onClick={() => startEdit(m)} className="text-xs font-bold text-amber-brand hover:underline">Edit</button>
            <button onClick={() => remove(m._id)} className="text-xs font-bold text-destructive hover:underline">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
