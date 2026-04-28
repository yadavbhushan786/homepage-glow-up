import { useState } from "react";
import { Upload, X } from "lucide-react";
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
      <label className="a-label">{label}</label>
      <div className="mt-2 flex items-center gap-3">
        {value ? (
          <img src={value} alt="" className="size-16 rounded-xl object-cover border border-[var(--a-border)]" />
        ) : (
          <div className="size-16 rounded-xl bg-[var(--a-surface-2)] border border-dashed border-[var(--a-border)] flex items-center justify-center text-[var(--a-text-muted)]">
            <Upload className="size-5" />
          </div>
        )}
        <label className="a-btn a-btn-ghost cursor-pointer">
          <Upload className="size-3.5" />
          {busy ? "Uploading…" : value ? "Replace" : "Upload"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handle(e.target.files[0])}
          />
        </label>
        {value && (
          <button onClick={() => onChange("")} className="text-xs text-[var(--a-text-muted)] hover:text-[var(--a-danger)] inline-flex items-center gap-1 transition-colors">
            <X className="size-3" /> Remove
          </button>
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
  placeholder?: string;
}

export function Field({ label, value, onChange, type = "text", textarea, rows = 3, placeholder }: FieldProps) {
  return (
    <div>
      <label className="a-label">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          className="a-input mt-2 resize-none leading-relaxed"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="a-input mt-2"
        />
      )}
    </div>
  );
}
