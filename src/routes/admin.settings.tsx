import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { settingsApi } from "@/lib/api";
import type { Settings } from "@/lib/types";
import { Field, MediaUpload } from "@/components/admin/Fields";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  const [s, setS] = useState<Settings | null>(null);

  useEffect(() => { settingsApi.get().then(setS); }, []);

  if (!s) return <p>Loading...</p>;

  const save = async () => {
    await settingsApi.update(s);
    toast.success("Settings saved");
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Settings</h1>
      <p className="text-navy-ink/60 mb-8">Brand, contact, and social links.</p>

      <div className="bg-card rounded-2xl p-6 border border-navy-ink/5 shadow-[var(--shadow-soft)] space-y-4 max-w-2xl">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Brand name" value={s.brandName} onChange={(v) => setS({ ...s, brandName: v })} />
          <Field label="Contact email" type="email" value={s.contactEmail} onChange={(v) => setS({ ...s, contactEmail: v })} />
        </div>
        <MediaUpload label="Logo" value={s.logoUrl} onChange={(v) => setS({ ...s, logoUrl: v })} />
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Twitter URL" value={s.social.twitter ?? ""} onChange={(v) => setS({ ...s, social: { ...s.social, twitter: v } })} />
          <Field label="LinkedIn URL" value={s.social.linkedin ?? ""} onChange={(v) => setS({ ...s, social: { ...s.social, linkedin: v } })} />
        </div>
        <button onClick={save} className="bg-amber-brand text-navy-ink px-5 py-2 rounded-full text-sm font-bold hover:bg-amber-glow">
          Save settings
        </button>
      </div>
    </div>
  );
}
