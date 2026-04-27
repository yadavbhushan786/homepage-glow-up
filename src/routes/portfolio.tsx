import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { portfolioApi } from "@/lib/api";
import type { PortfolioCompany } from "@/lib/types";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — ASVF Venture Fund" },
      { name: "description", content: "Companies we've invested in across AI, infrastructure, SaaS, logistics, health, and robotics." },
      { property: "og:title", content: "Portfolio — ASVF" },
      { property: "og:description", content: "Companies we've backed across categories." },
    ],
  }),
  component: PortfolioPage,
});

function Initials({ name }: { name: string }) {
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div className="size-14 rounded-2xl bg-gradient-to-br from-amber-brand to-gold-deep text-cream-warm flex items-center justify-center font-heading font-bold text-lg shrink-0">
      {initials}
    </div>
  );
}

function PortfolioPage() {
  const [items, setItems] = useState<PortfolioCompany[]>([]);
  const [filter, setFilter] = useState<string>("All");

  useEffect(() => {
    portfolioApi.list().then(setItems);
  }, []);

  const sectors = ["All", ...Array.from(new Set(items.map((i) => i.sector)))];
  const visible = filter === "All" ? items : items.filter((i) => i.sector === filter);

  return (
    <main className="min-h-dvh">
      <SiteHeader />

      <section className="max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-12">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-gold-deep mb-4">Portfolio</p>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-3xl">
          Building the <span className="text-amber-brand italic">next chapter</span> of category leaders.
        </h1>
        <p className="mt-6 text-lg text-navy-ink/70 max-w-2xl">
          A curated set of high-conviction companies we partner with across stage and sector.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-6">
        <div className="flex flex-wrap gap-2">
          {sectors.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all ${
                filter === s ? "bg-navy-ink text-cream-warm" : "bg-card border border-navy-ink/10 hover:border-amber-brand"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((c) => (
            <a
              key={c._id}
              href={c.website || "#"}
              target="_blank"
              rel="noreferrer"
              className="bg-card rounded-2xl p-6 border border-navy-ink/5 shadow-[var(--shadow-soft)] hover:-translate-y-1 transition-all flex gap-4 group animate-in fade-in"
            >
              {c.logo ? (
                <img src={c.logo} alt={c.name} className="size-14 rounded-2xl object-cover shrink-0" />
              ) : (
                <Initials name={c.name} />
              )}
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gold-deep">{c.sector}</span>
                <h3 className="font-heading font-bold text-lg mt-1 group-hover:text-amber-brand transition-colors">{c.name}</h3>
                <p className="text-sm text-navy-ink/60 mt-1 leading-relaxed">{c.description}</p>
              </div>
            </a>
          ))}
        </div>
        {visible.length === 0 && (
          <p className="text-center text-navy-ink/50 py-12">No companies found.</p>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
