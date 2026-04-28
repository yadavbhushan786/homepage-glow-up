import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Building2, Mail, Share2, Check } from "lucide-react";
import { settingsApi } from "@/lib/api";
import type { Settings } from "@/lib/types";
import { Field, MediaUpload } from "@/components/admin/Fields";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

type Tab = "general" | "contact" | "social";

function AdminSettings() {
  const [s, setS] = useState<Settings | null>(null);
  const [tab, setTab] = useState<Tab>("general");
  const [saved, setSaved] = useState(false);

  useEffect(() => { settingsApi.get().then(setS); }, []);

  if (!s) return <p className="text-sm text-[var(--a-text-muted)]">Loading…</p>;

  const save = async () => {
    await settingsApi.update(s);
    toast.success("Settings saved");
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const tabs: { key: Tab; label: string; icon: typeof Building2 }[] = [
    { key: "general", label: "General", icon: Building2 },
    { key: "contact", label: "Contact Info", icon: Mail },
    { key: "social", label: "Social Links", icon: Share2 },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="a-card p-2 flex gap-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === t.key
                ? "text-white shadow-md"
                : "text-[var(--a-text-soft)] hover:bg-[var(--a-surface-2)]"
            }`}
            style={tab === t.key ? { background: "var(--a-grad)" } : undefined}
          >
            <t.icon className="size-4" />
            {t.label}
          </button>
        ))}
      </div>

      <div className="a-card p-6 a-fade-in" key={tab}>
        {tab === "general" && (
          <div className="space-y-5">
            <div>
              <h3 className="font-bold tracking-tight">General</h3>
              <p className="text-xs text-[var(--a-text-muted)] mt-0.5">Site identity and branding</p>
            </div>
            <Field label="Brand name" value={s.brandName} onChange={(v) => setS({ ...s, brandName: v })} />
            <MediaUpload label="Logo" value={s.logoUrl} onChange={(v) => setS({ ...s, logoUrl: v })} />
          </div>
        )}
        {tab === "contact" && (
          <div className="space-y-5">
            <div>
              <h3 className="font-bold tracking-tight">Contact</h3>
              <p className="text-xs text-[var(--a-text-muted)] mt-0.5">How visitors reach you</p>
            </div>
            <Field label="Contact email" type="email" value={s.contactEmail} onChange={(v) => setS({ ...s, contactEmail: v })} />
          </div>
        )}
        {tab === "social" && (
          <div className="space-y-5">
            <div>
              <h3 className="font-bold tracking-tight">Social</h3>
              <p className="text-xs text-[var(--a-text-muted)] mt-0.5">Public social profiles</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Twitter URL" value={s.social.twitter ?? ""} onChange={(v) => setS({ ...s, social: { ...s.social, twitter: v } })} />
              <Field label="LinkedIn URL" value={s.social.linkedin ?? ""} onChange={(v) => setS({ ...s, social: { ...s.social, linkedin: v } })} />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button onClick={save} className="a-btn a-btn-primary">
          {saved ? (<><Check className="size-4" /> Saved</>) : "Save settings"}
        </button>
      </div>
    </div>
  );
}
