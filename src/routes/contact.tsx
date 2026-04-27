import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — ASVF Venture Fund" },
      { name: "description", content: "Get in touch with the ASVF team." },
      { property: "og:title", content: "Contact — ASVF" },
      { property: "og:description", content: "Get in touch with the ASVF team." },
    ],
  }),
  component: ContactPage,
});

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  message: z.string().trim().min(10, "Tell us a bit more").max(1000),
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const e: Record<string, string> = {};
      result.error.issues.forEach((i) => (e[i.path[0] as string] = i.message));
      setErrors(e);
      return;
    }
    setErrors({});
    setSubmitting(true);
    // TODO: POST to /api/contact when backend is wired
    setTimeout(() => {
      setSubmitting(false);
      setForm({ name: "", email: "", message: "" });
      toast.success("Thanks — we'll be in touch shortly.");
    }, 600);
  };

  return (
    <main className="min-h-dvh">
      <SiteHeader />

      <section className="max-w-5xl mx-auto px-6 pt-16 md:pt-24 pb-24 grid md:grid-cols-5 gap-12">
        <div className="md:col-span-2">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-gold-deep mb-4">Contact</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Let's <span className="text-amber-brand italic">talk</span>.
          </h1>
          <p className="mt-6 text-navy-ink/70 leading-relaxed">
            Pitching us? Press inquiry? Looking to co-invest? Drop us a note and the right person will reply.
          </p>
          <a href="mailto:contact@asvf.com" className="block mt-8 text-amber-brand font-bold border-b-2 border-amber-brand/40 hover:border-amber-brand transition-colors">
            contact@asvf.com
          </a>
        </div>

        <form onSubmit={submit} className="md:col-span-3 bg-card rounded-3xl p-8 md:p-10 shadow-[var(--shadow-soft)] border border-navy-ink/5 space-y-5">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-navy-ink/60">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              maxLength={100}
              className="mt-2 w-full px-4 py-3 rounded-xl border border-navy-ink/10 bg-cream-warm/50 focus:outline-none focus:border-amber-brand transition-colors"
            />
            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-navy-ink/60">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              maxLength={255}
              className="mt-2 w-full px-4 py-3 rounded-xl border border-navy-ink/10 bg-cream-warm/50 focus:outline-none focus:border-amber-brand transition-colors"
            />
            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-navy-ink/60">Message</label>
            <textarea
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              maxLength={1000}
              className="mt-2 w-full px-4 py-3 rounded-xl border border-navy-ink/10 bg-cream-warm/50 focus:outline-none focus:border-amber-brand transition-colors resize-none"
            />
            {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="bg-amber-brand text-navy-ink px-8 py-3 rounded-full font-bold hover:bg-amber-glow transition-colors shadow-[var(--shadow-amber)] disabled:opacity-60"
          >
            {submitting ? "Sending..." : "Send message →"}
          </button>
        </form>
      </section>

      <SiteFooter />
    </main>
  );
}
