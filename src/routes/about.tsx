import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — ASVF Venture Fund" },
      { name: "description", content: "A legacy of conviction in the unseen and the unrelenting — ASVF partners with founders building category-defining companies." },
      { property: "og:title", content: "About — ASVF" },
      { property: "og:description", content: "Mission, strategy, vision and approach of ASVF." },
    ],
  }),
  component: AboutPage,
});

const principles = [
  {
    no: "01",
    tag: "Mission",
    title: "Back conviction with capital.",
    body: "We partner with bold founders building category-defining companies. We invest early, stay long, and compound advantage with patience.",
  },
  {
    no: "02",
    tag: "Strategy",
    title: "Concentrated, high-conviction bets.",
    body: "Twenty to twenty-five companies per fund. Meaningful checks. Meaningful ownership. Hands-on operating support across hiring and go-to-market.",
  },
  {
    no: "03",
    tag: "Vision",
    title: "A globally-scaled portfolio.",
    body: "Built from India and the US, deployed everywhere. We help founders cross borders, hire globally, and ship for the world from day one.",
  },
  {
    no: "04",
    tag: "Approach",
    title: "Low-ego, high-velocity.",
    body: "We move fast, decide clearly, and stay out of the way once aligned. Operating partners on demand, never in the way of the founder.",
  },
];

const stats = [
  { k: "Founded", v: "2014" },
  { k: "Stage", v: "Seed — Series B" },
  { k: "AUM", v: "$420M+" },
  { k: "Sectors", v: "AI · SaaS · Infra" },
];

function AboutPage() {
  return (
    <main className="min-h-dvh obsidian-scope">
      <SiteHeader />

      {/* Hero */}
      <header className="max-w-7xl mx-auto px-6 md:px-12 pt-20 md:pt-32 pb-24 md:pb-32">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px w-8 bg-brass" />
          <span className="text-[11px] uppercase tracking-[0.4em] text-brass">Institutional Capital</span>
        </div>
        <h1 className="font-display text-5xl md:text-7xl xl:text-[5.5rem] leading-[0.98] tracking-tight max-w-[900px] text-sand">
          A legacy of conviction in the{" "}
          <span className="italic">unseen</span> and the{" "}
          <span className="text-brass">unrelenting</span>.
        </h1>
        <p className="text-lg md:text-xl text-sand/55 font-light max-w-[56ch] leading-relaxed mt-10">
          ASVF is an operator-led venture firm partnering with founders for the long arc — from first product to global scale.
        </p>

        <div className="flex flex-wrap gap-4 mt-12">
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 border border-brass/40 bg-brass/10 text-brass px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-brass hover:text-obsidian-deep transition-all duration-500"
          >
            Request Introduction
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform duration-500" />
          </Link>
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 border border-white/15 text-sand/80 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] hover:border-white/40 transition-colors duration-500"
          >
            View Portfolio
          </Link>
        </div>
      </header>

      {/* Stats row */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 border-t border-b obsidian-hairline">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-white/5">
          {stats.map((s) => (
            <div key={s.k} className="p-6 md:p-8 first:border-l-0">
              <p className="text-[10px] uppercase tracking-[0.3em] text-sand/45 mb-3">{s.k}</p>
              <p className="font-display text-3xl md:text-4xl text-brass">{s.v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Principles */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32">
        <div className="flex justify-between items-end mb-16 border-b obsidian-hairline pb-8">
          <h2 className="font-display text-3xl md:text-4xl text-sand">The Mandate</h2>
          <span className="text-[11px] tracking-[0.3em] uppercase text-sand/45 tabular-nums">01 — 04</span>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-white/5 border border-white/5">
          {principles.map((p) => (
            <article
              key={p.no}
              className="group bg-obsidian p-10 md:p-14 min-h-[340px] flex flex-col justify-between transition-colors duration-700 hover:bg-obsidian-deep"
            >
              <div className="flex justify-between items-start">
                <span className="font-display text-5xl text-brass/40 group-hover:text-brass transition-colors duration-700">{p.no}</span>
                <span className="text-[10px] uppercase tracking-[0.3em] px-3 py-1 border border-brass/30 text-brass">
                  {p.tag}
                </span>
              </div>
              <div className="max-w-[42ch] mt-16">
                <h3 className="font-display text-2xl md:text-3xl text-sand leading-snug group-hover:text-brass transition-colors duration-700">
                  {p.title}
                </h3>
                <p className="text-sand/55 font-light leading-relaxed mt-5">{p.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Closing quote */}
      <section className="max-w-5xl mx-auto px-6 md:px-12 py-24 md:py-32 text-center">
        <div className="h-px w-16 bg-brass mx-auto mb-10" />
        <p className="font-display italic text-3xl md:text-5xl text-sand leading-[1.2]">
          "We do not chase cycles. We cultivate enduring narratives."
        </p>
        <p className="text-[11px] uppercase tracking-[0.4em] text-sand/45 mt-10">— ASVF Partners</p>
      </section>

      <SiteFooter />
    </main>
  );
}
