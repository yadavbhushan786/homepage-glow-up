import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { newsApi } from "@/lib/api";
import type { NewsItem } from "@/lib/types";
import { Search, X, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "Dispatches — ASVF" },
      { name: "description", content: "Latest dispatches from ASVF — perspectives, portfolio updates, and firm news." },
      { property: "og:title", content: "Dispatches — ASVF" },
      { property: "og:description", content: "Perspectives and updates from ASVF and the portfolio." },
    ],
  }),
  component: NewsPage,
});

type Cat = "All" | "Perspective" | "Portfolio" | "Firm News" | "Announcement";
const CATS: Cat[] = ["All", "Perspective", "Portfolio", "Firm News", "Announcement"];

function categorize(n: NewsItem): Exclude<Cat, "All"> {
  const t = n.title.toLowerCase();
  if (t.includes("series") || t.includes("raises") || t.includes("invest") || t.includes("acqui")) return "Portfolio";
  if (t.includes("fund") || t.includes("partner") || t.includes("join")) return "Firm News";
  if (t.includes("thesis") || t.includes("perspective") || t.includes("letter")) return "Perspective";
  return "Announcement";
}

function Drawer({ n, onClose }: { n: NewsItem; onClose: () => void }) {
  const cat = categorize(n);
  return (
    <div className="fixed inset-0 z-50 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-obsidian-deep/80 backdrop-blur-sm" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-xl bg-obsidian border-l border-white/10 overflow-y-auto animate-in slide-in-from-right duration-500">
        <div className="sticky top-0 bg-obsidian/95 backdrop-blur border-b border-white/10 p-6 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.3em] px-3 py-1 border border-brass/30 text-brass">{cat}</span>
          <button onClick={onClose} className="w-9 h-9 rounded-full border border-white/10 hover:border-brass/40 flex items-center justify-center text-sand/70">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-8 md:p-12 space-y-6">
          <p className="text-[11px] uppercase tracking-[0.3em] text-sand/45">
            {new Date(n.date).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-sand leading-[1.15]">{n.title}</h2>
          <p className="text-lg text-sand/65 font-light leading-relaxed">{n.excerpt}</p>
          <div className="pt-6 border-t border-white/10 text-sand/55 leading-relaxed whitespace-pre-line font-light">
            {n.body}
          </div>
        </div>
      </aside>
    </div>
  );
}

function NewsPage() {
  const [all, setAll] = useState<NewsItem[]>([]);
  const [cat, setCat] = useState<Cat>("All");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<NewsItem | null>(null);

  useEffect(() => {
    newsApi.list().then(setAll);
  }, []);

  const filtered = useMemo(() => {
    return all.filter((n) => {
      const okCat = cat === "All" || categorize(n) === cat;
      const okQ = !q || (n.title + n.excerpt).toLowerCase().includes(q.toLowerCase());
      return okCat && okQ;
    });
  }, [all, cat, q]);

  const [featured, ...rest] = filtered;

  return (
    <main className="min-h-dvh obsidian-scope">
      <SiteHeader />

      {/* Hero */}
      <header className="max-w-7xl mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-16">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px w-8 bg-brass" />
          <span className="text-[11px] uppercase tracking-[0.4em] text-brass">Dispatches</span>
        </div>
        <h1 className="font-display text-5xl md:text-7xl leading-[0.98] tracking-tight max-w-[900px] text-sand">
          Latest <span className="italic">dispatches</span> from the firm and the portfolio.
        </h1>
        <p className="text-lg text-sand/55 font-light max-w-[56ch] leading-relaxed mt-8">
          Perspectives, portfolio milestones, and firm news — delivered with the rigor of a memo, not a newsfeed.
        </p>
      </header>

      {/* Filter bar */}
      <div className="sticky top-16 z-30 backdrop-blur-xl bg-obsidian/85 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between gap-6 flex-wrap">
          <div className="flex items-center gap-1 overflow-x-auto">
            {CATS.map((c) => {
              const active = c === cat;
              return (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`shrink-0 px-4 py-2 text-[11px] uppercase tracking-[0.2em] border transition-all duration-500 ${
                    active
                      ? "bg-brass text-obsidian-deep border-brass"
                      : "bg-transparent text-sand/70 border-white/10 hover:border-brass/40 hover:text-brass"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sand/40" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search dispatches..."
              className="w-full pl-10 pr-3 py-2.5 text-sm bg-white/5 border border-white/10 text-sand placeholder:text-sand/40 focus:outline-none focus:border-brass/50 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20">
        {filtered.length === 0 ? (
          <p className="text-center text-sand/50 py-24 font-display italic text-2xl">No dispatches match your filters.</p>
        ) : (
          <>
            {/* Featured */}
            {featured && (
              <button
                onClick={() => setOpen(featured)}
                className="group relative w-full text-left border border-white/10 bg-obsidian p-8 md:p-14 overflow-hidden hover:border-brass/30 transition-colors duration-700 min-h-[340px] flex flex-col justify-between"
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] uppercase tracking-[0.3em] px-3 py-1 border border-brass/30 text-brass">
                    {categorize(featured)}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-sand/45">
                    {new Date(featured.date).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <div className="max-w-[640px] mt-16">
                  <h2 className="font-display text-3xl md:text-5xl text-sand leading-[1.1] group-hover:text-brass transition-colors duration-700">
                    {featured.title}
                  </h2>
                  <p className="text-sand/55 font-light leading-relaxed mt-6 max-w-[60ch]">{featured.excerpt}</p>
                  <div className="inline-flex items-center gap-3 mt-8 text-[11px] uppercase tracking-[0.3em] text-brass">
                    <div className="size-1.5 rounded-full bg-brass" />
                    Read Dispatch
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform duration-500" />
                  </div>
                </div>
              </button>
            )}

            {/* Rest */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/5 mt-px">
              {rest.map((n) => {
                const c = categorize(n);
                return (
                  <button
                    key={n._id}
                    onClick={() => setOpen(n)}
                    className="group relative bg-obsidian p-8 md:p-10 min-h-[320px] text-left flex flex-col justify-between hover:bg-obsidian-deep transition-colors duration-700"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] uppercase tracking-[0.3em] px-2.5 py-1 border border-white/15 text-sand/70 group-hover:border-brass/30 group-hover:text-brass transition-colors duration-500">
                        {c}
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.3em] text-sand/45">
                        {new Date(n.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-display text-2xl text-sand leading-snug group-hover:text-brass transition-colors duration-700">
                        {n.title}
                      </h3>
                      <p className="text-sm text-sand/50 font-light leading-relaxed mt-4 line-clamp-3">{n.excerpt}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </section>

      {open && <Drawer n={open} onClose={() => setOpen(null)} />}

      <SiteFooter />
    </main>
  );
}
