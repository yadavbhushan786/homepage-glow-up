import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Rocket, BarChart3, Globe2, Settings2, ArrowUpRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — ASVF Venture Fund" },
      { name: "description", content: "Who we are — building category-defining companies through long-term partnership." },
      { property: "og:title", content: "About — ASVF" },
      { property: "og:description", content: "Mission, strategy, vision and approach of ASVF." },
    ],
  }),
  component: AboutPage,
});

const cards = [
  {
    icon: Rocket,
    tag: "Mission",
    title: "Back conviction with capital",
    body: "Partner with bold founders building category-defining companies. We invest early, stay long, and compound advantage.",
  },
  {
    icon: BarChart3,
    tag: "Strategy",
    title: "Concentrated, high-conviction bets",
    body: "20–25 companies per fund. Meaningful checks. Meaningful ownership. Hands-on operating support across hiring and GTM.",
  },
  {
    icon: Globe2,
    tag: "Vision",
    title: "A globally-scaled portfolio",
    body: "Built from India and the US, deployed everywhere. We help founders cross borders, hire globally, and ship for the world.",
  },
  {
    icon: Settings2,
    tag: "Approach",
    title: "Low-ego, high-velocity",
    body: "We move fast, decide clearly, and stay out of the way once aligned. Operating partners on demand, never in the way.",
  },
];

const tags = [
  { k: "Founded", v: "2014" },
  { k: "Stage", v: "Seed → Series B" },
  { k: "AUM", v: "$420M+" },
  { k: "Sectors", v: "AI · SaaS · Infra" },
];

function AboutPage() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <main className="min-h-dvh">
      <SiteHeader />

      <section className="max-w-7xl mx-auto px-6 pt-12 md:pt-16 pb-20">
        <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-10 lg:gap-16">
          {/* LEFT — sticky product intro panel */}
          <aside className="lg:sticky lg:top-24 self-start space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-navy-ink/10 bg-card/70 backdrop-blur px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-gold-deep">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-brand animate-pulse" />
              About ASVF
            </div>

            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold leading-[1.05]">
              Building <span className="text-amber-brand italic">category-defining</span> companies.
            </h1>

            <p className="text-base md:text-lg text-navy-ink/65 leading-relaxed max-w-md">
              An operator-led venture fund partnering with founders for the long arc — from first product to global scale.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-navy-ink text-cream-warm px-5 py-3 text-sm font-semibold shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-amber)] transition-all duration-700"
              >
                Get in touch
                <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform duration-500" />
              </Link>
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-2 rounded-full border border-navy-ink/15 bg-card/60 backdrop-blur px-5 py-3 text-sm font-semibold hover:border-amber-brand/60 transition-colors duration-500"
              >
                View portfolio
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 max-w-md">
              {tags.map((t) => (
                <div key={t.k} className="rounded-xl border border-navy-ink/8 bg-card/60 backdrop-blur px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-navy-ink/50">{t.k}</p>
                  <p className="text-sm font-semibold text-navy-ink mt-0.5">{t.v}</p>
                </div>
              ))}
            </div>
          </aside>

          {/* RIGHT — insight cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-navy-ink/50">Operating principles</p>
              <span className="inline-flex items-center gap-1.5 text-[10px] text-navy-ink/40">
                <Sparkles className="w-3 h-3" /> 4 modules
              </span>
            </div>

            {cards.map((c, i) => {
              const Icon = c.icon;
              const isActive = active === i;
              return (
                <button
                  key={c.tag}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  className="group relative w-full text-left overflow-hidden rounded-2xl border border-navy-ink/8 bg-card/75 backdrop-blur-sm p-6 md:p-7 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-amber-brand/40 hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
                >
                  {/* corner glow reveal */}
                  <div
                    className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
                    style={{ background: "radial-gradient(circle, var(--amber-glow) 0%, transparent 65%)" }}
                  />
                  <div className="relative flex items-start gap-5">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-amber-brand/15 to-gold-deep/10 border border-amber-brand/25 flex items-center justify-center text-gold-deep group-hover:scale-110 transition-transform duration-700">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-deep">{c.tag}</span>
                        <span className="h-px flex-1 bg-navy-ink/10" />
                        <ArrowUpRight className="w-3.5 h-3.5 text-navy-ink/30 group-hover:text-amber-brand group-hover:rotate-45 transition-all duration-500" />
                      </div>
                      <h3 className="text-lg md:text-xl font-bold leading-snug">{c.title}</h3>
                      <p
                        className="text-sm text-navy-ink/65 leading-relaxed mt-2 transition-all duration-700"
                        style={{ maxHeight: isActive ? 200 : 80, overflow: "hidden" }}
                      >
                        {c.body}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
