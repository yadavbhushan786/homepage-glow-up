import { useState } from "react";
import { mediaApi } from "@/lib/api";

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function MediaUpload({ value, onChange, label = "Image" }: Props) {
  const [busy, setBusy] = useState(false);
  const handle = async (file: File) => {
    setBusy(true);
    try {
      const url = await mediaApi.upload(file);
      onChange(url);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-widest text-navy-ink/60">{label}</label>
      <div className="mt-2 flex items-center gap-3">
        {value ? (
          <img src={value} alt="" className="size-16 rounded-xl object-cover border border-navy-ink/10" />
        ) : (
          <div className="size-16 rounded-xl bg-cream-warm border border-dashed border-navy-ink/20" />
        )}
        <label className="px-4 py-2 rounded-full border border-navy-ink/15 text-xs font-bold cursor-pointer hover:border-amber-brand">
          {busy ? "Uploading..." : value ? "Replace" : "Upload"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handle(e.target.files[0])}
          />
        </label>
        {value && (
          <button onClick={() => onChange("")} className="text-xs text-navy-ink/50 hover:text-destructive">Remove</button>
        )}
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  textarea?: boolean;
  rows?: number;
}

export function Field({ label, value, onChange, type = "text", textarea, rows = 3 }: FieldProps) {
  const cls = "mt-2 w-full px-4 py-2.5 rounded-xl border border-navy-ink/10 bg-cream-warm/50 focus:outline-none focus:border-amber-brand text-sm";
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-widest text-navy-ink/60">{label}</label>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className={cls + " resize-none"} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
    </div>
  );
}
