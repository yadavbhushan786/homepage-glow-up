import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — ASVF Venture Fund" },
      { name: "description", content: "Our mission and focus areas — partnering with founders shaping the next decade." },
      { property: "og:title", content: "About — ASVF" },
      { property: "og:description", content: "Mission and focus areas of ASVF Venture Fund." },
    ],
  }),
  component: AboutPage,
});

const focusAreas = [
  { tag: "AI", desc: "Foundation models, applied AI, and the tooling layer." },
  { tag: "Infra", desc: "Cloud, data, and developer infrastructure." },
  { tag: "SaaS", desc: "Vertical and horizontal workflow software." },
  { tag: "Logistics", desc: "Supply chain and last-mile innovation." },
  { tag: "Health", desc: "Diagnostics, care delivery, and health-tech." },
  { tag: "Robotics", desc: "Autonomy, manufacturing, and physical AI." },
];

function AboutPage() {
  return (
    <main className="min-h-dvh">
      <SiteHeader />

      <section className="max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-16">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-gold-deep mb-4">About ASVF</p>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-3xl">
          We back <span className="text-amber-brand italic">conviction</span> with capital, network, and operating depth.
        </h1>
        <p className="mt-8 text-lg text-navy-ink/70 max-w-2xl leading-relaxed">
          ASVF partners with founders building category-defining companies. We invest early, stay long, and bring the operating support that turns
          ambitious ideas into globally-scaled outcomes.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20 grid md:grid-cols-2 gap-8">
        <div className="bg-card rounded-3xl p-8 md:p-10 shadow-[var(--shadow-soft)] border border-navy-ink/5">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-navy-ink/70 leading-relaxed">
            Partner with bold founders, help them scale globally with focused long-term execution, and stand alongside them through every phase
            from product-market fit to category leadership.
          </p>
        </div>
        <div className="bg-navy-ink text-cream-warm rounded-3xl p-8 md:p-10 shadow-[var(--shadow-soft)]">
          <h2 className="text-2xl font-bold mb-4 text-amber-brand">How we partner</h2>
          <p className="text-cream-warm/80 leading-relaxed">
            Hands-on, low-ego, and high-conviction. We move quickly, write meaningful checks, and dedicate operating partners across hiring,
            GTM, and product to help portfolio teams compound advantage.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <h2 className="text-3xl md:text-4xl font-bold mb-10">Focus Areas</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {focusAreas.map((f) => (
            <div key={f.tag} className="bg-card rounded-2xl p-6 border border-navy-ink/5 shadow-[var(--shadow-soft)] hover:-translate-y-1 transition-transform">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold-deep">{f.tag}</span>
              <p className="mt-3 text-sm text-navy-ink/70 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
