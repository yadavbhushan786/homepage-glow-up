import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { newsApi } from "@/lib/api";
import type { NewsItem } from "@/lib/types";
import { Search, TrendingUp, Sparkles, X, ArrowUpRight, Activity } from "lucide-react";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "Updates — ASVF Activity Feed" },
      { name: "description", content: "Real-time activity stream from ASVF — investments, partnerships, and announcements." },
      { property: "og:title", content: "Updates — ASVF" },
      { property: "og:description", content: "Live updates from ASVF and the portfolio." },
    ],
  }),
  component: NewsPage,
});

type Cat = "All" | "Investment" | "Finance" | "Partnerships" | "Announcement";
const CATS: Cat[] = ["All", "Investment", "Finance", "Partnerships", "Announcement"];

function categorize(n: NewsItem): Cat {
  const t = n.title.toLowerCase();
  if (t.includes("series") || t.includes("raises") || t.includes("invest")) return "Investment";
  if (t.includes("fund") || t.includes("close")) return "Finance";
  if (t.includes("partner")) return "Partnerships";
  return "Announcement";
}

function status(n: NewsItem): "LIVE" | "UPDATED" | "ARCHIVED" {
  const days = (Date.now() - +new Date(n.date)) / 86400000;
  if (days < 2) return "LIVE";
  if (days < 14) return "UPDATED";
  return "ARCHIVED";
}

function group(items: NewsItem[]) {
  const today: NewsItem[] = [], week: NewsItem[] = [], earlier: NewsItem[] = [];
  items.forEach((n) => {
    const days = (Date.now() - +new Date(n.date)) / 86400000;
    if (days < 1) today.push(n);
    else if (days < 7) week.push(n);
    else earlier.push(n);
  });
  return { today, week, earlier };
}

const STATUS_STYLES: Record<string, string> = {
  LIVE: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  UPDATED: "bg-amber-brand/15 text-gold-deep border-amber-brand/30",
  ARCHIVED: "bg-navy-ink/5 text-navy-ink/50 border-navy-ink/10",
};

function NewsCard({ n, onOpen }: { n: NewsItem; onOpen: (n: NewsItem) => void }) {
  const cat = categorize(n);
  const st = status(n);
  return (
    <button
      onClick={() => onOpen(n)}
      className="group relative w-full text-left overflow-hidden rounded-2xl border border-navy-ink/8 bg-card/75 backdrop-blur-sm p-5 md:p-6 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-amber-brand/35 hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]"
    >
      <div
        className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
        style={{ background: "radial-gradient(circle, var(--amber-glow) 0%, transparent 65%)" }}
      />
      <div className="relative">
        <div className="flex items-center gap-2 flex-wrap mb-3">
          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-navy-ink text-cream-warm">
            {cat}
          </span>
          <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${STATUS_STYLES[st]} inline-flex items-center gap-1`}>
            {st === "LIVE" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
            {st}
          </span>
          <span className="ml-auto text-xs text-navy-ink/50 tabular-nums">
            {new Date(n.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
          </span>
        </div>
        <h3 className="text-lg md:text-xl font-bold leading-snug group-hover:text-amber-brand transition-colors duration-500">
          {n.title}
        </h3>
        <p className="text-sm text-navy-ink/65 mt-2 leading-relaxed line-clamp-2">{n.excerpt}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-navy-ink/50 group-hover:text-amber-brand transition-all duration-500 opacity-60 group-hover:opacity-100">
            View details
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform duration-500" />
          </span>
        </div>
      </div>
    </button>
  );
}

function GroupHeader({ label, count }: { label: string; count: number }) {
  if (count === 0) return null;
  return (
    <div className="flex items-center gap-3 mt-8 mb-3 first:mt-0">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-navy-ink/45">{label}</p>
      <span className="h-px flex-1 bg-navy-ink/10" />
      <span className="text-[10px] text-navy-ink/40 tabular-nums">{count}</span>
    </div>
  );
}

function Drawer({ n, onClose }: { n: NewsItem; onClose: () => void }) {
  const cat = categorize(n);
  return (
    <div className="fixed inset-0 z-50 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-navy-ink/40 backdrop-blur-sm" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-lg bg-card shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-500">
        <div className="sticky top-0 bg-card/90 backdrop-blur border-b border-navy-ink/8 p-5 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-navy-ink text-cream-warm">{cat}</span>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-navy-ink/5 flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-xs text-navy-ink/50 tabular-nums">
            {new Date(n.date).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </p>
          <h2 className="text-2xl md:text-3xl font-bold leading-tight">{n.title}</h2>
          <p className="text-base text-navy-ink/70 leading-relaxed">{n.excerpt}</p>
          <div className="pt-2 border-t border-navy-ink/8 text-sm text-navy-ink/65 leading-relaxed whitespace-pre-line">
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

  const grouped = useMemo(() => group(filtered), [filtered]);

  const counts = useMemo(() => {
    const c: Record<Cat, number> = { All: all.length, Investment: 0, Finance: 0, Partnerships: 0, Announcement: 0 };
    all.forEach((n) => { c[categorize(n)]++; });
    return c;
  }, [all]);

  return (
    <main className="min-h-dvh">
      <SiteHeader />

      {/* Sticky app bar */}
      <div className="sticky top-16 z-30 backdrop-blur-xl bg-cream-warm/75 border-b border-navy-ink/8">
        <div className="max-w-7xl mx-auto px-6 py-4 space-y-3">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <h1 className="text-lg md:text-xl font-bold">Latest Updates</h1>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live feed
              </span>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-ink/40" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search updates..."
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-navy-ink/10 bg-card/80 focus:outline-none focus:border-amber-brand/50 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mb-1">
            {CATS.map((c) => {
              const active = c === cat;
              return (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border transition-all duration-500 ${
                    active
                      ? "bg-navy-ink text-cream-warm border-navy-ink"
                      : "bg-card/60 border-navy-ink/10 hover:border-amber-brand/40"
                  }`}
                >
                  {c}
                  <span className={`tabular-nums text-[10px] ${active ? "text-cream-warm/70" : "text-navy-ink/40"}`}>{counts[c]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Two column feed */}
      <section className="max-w-7xl mx-auto px-6 pt-8 pb-24">
        <div className="grid lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] gap-6 lg:gap-8">
          {/* Feed */}
          <div>
            <GroupHeader label="Today" count={grouped.today.length} />
            <div className="space-y-3">
              {grouped.today.map((n) => <NewsCard key={n._id} n={n} onOpen={setOpen} />)}
            </div>
            <GroupHeader label="This Week" count={grouped.week.length} />
            <div className="space-y-3">
              {grouped.week.map((n) => <NewsCard key={n._id} n={n} onOpen={setOpen} />)}
            </div>
            <GroupHeader label="Earlier" count={grouped.earlier.length} />
            <div className="space-y-3">
              {grouped.earlier.map((n) => <NewsCard key={n._id} n={n} onOpen={setOpen} />)}
            </div>
            {filtered.length === 0 && (
              <p className="text-center text-navy-ink/50 py-16">No updates match your filters.</p>
            )}
          </div>

          {/* Insight panel */}
          <aside className="lg:sticky lg:top-44 self-start space-y-4">
            <div className="rounded-2xl border border-navy-ink/8 bg-card/75 backdrop-blur-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-amber-brand" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-navy-ink/55">Top Highlights</p>
              </div>
              <ul className="space-y-3">
                {all.slice(0, 3).map((n) => (
                  <li key={n._id} className="text-sm leading-snug">
                    <button onClick={() => setOpen(n)} className="text-left hover:text-amber-brand transition-colors">
                      {n.title}
                    </button>
                    <p className="text-[10px] text-navy-ink/45 mt-0.5">{categorize(n)}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-navy-ink/8 bg-card/75 backdrop-blur-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-amber-brand" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-navy-ink/55">Activity Stats</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(["Investment", "Finance", "Partnerships", "Announcement"] as Cat[]).map((c) => (
                  <div key={c} className="rounded-lg bg-navy-ink/[0.04] p-3">
                    <p className="text-[9px] uppercase tracking-widest text-navy-ink/45 truncate">{c}</p>
                    <p className="font-bold mt-1 tabular-nums">{counts[c]}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-amber-brand/30 bg-gradient-to-br from-amber-brand/10 to-gold-deep/5 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-gold-deep" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-gold-deep">This week</p>
              </div>
              <p className="text-sm leading-relaxed text-navy-ink/75">
                {grouped.today.length + grouped.week.length} new updates across the portfolio. Stay tuned for our quarterly memo.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
