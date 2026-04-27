import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { teamApi } from "@/lib/api";
import type { TeamMember } from "@/lib/types";
import { TrendingUp, Wallet, Handshake, ChevronDown, X, Activity } from "lucide-react";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Team — ASVF Operating System" },
      { name: "description", content: "The cross-functional units behind ASVF — investment, finance, business development." },
      { property: "og:title", content: "Team — ASVF" },
      { property: "og:description", content: "Our operating teams driving execution and growth." },
    ],
  }),
  component: TeamPage,
});

type ModuleDef = {
  id: string;
  icon: typeof TrendingUp;
  name: string;
  tagline: string;
  metrics: { label: string; value: string; delta?: string }[];
  accent: string;
};

const MODULES: ModuleDef[] = [
  {
    id: "investment",
    icon: TrendingUp,
    name: "Investment Team",
    tagline: "Capital deployment & portfolio construction",
    accent: "from-amber-brand/20 to-gold-deep/10",
    metrics: [
      { label: "Capital deployed", value: "$320M", delta: "+18%" },
      { label: "Active deals", value: "27", delta: "+4" },
      { label: "Portfolio growth", value: "2.4x", delta: "YoY" },
    ],
  },
  {
    id: "finance",
    icon: Wallet,
    name: "Finance Team",
    tagline: "Budget control, compliance & forecasting",
    accent: "from-navy-ink/10 to-navy-ink/5",
    metrics: [
      { label: "Budget variance", value: "1.2%", delta: "on target" },
      { label: "Compliance score", value: "100%", delta: "Q4" },
      { label: "Forecast accuracy", value: "96.8%", delta: "+2.1%" },
    ],
  },
  {
    id: "bd",
    icon: Handshake,
    name: "Business Development",
    tagline: "Pipeline, partnerships & ecosystem",
    accent: "from-amber-glow/25 to-amber-brand/10",
    metrics: [
      { label: "Active pipeline", value: "84", delta: "+12" },
      { label: "Partner network", value: "210+", delta: "+18 QoQ" },
      { label: "Intros made", value: "1.4k", delta: "this year" },
    ],
  },
];

function Sparkline() {
  return (
    <svg viewBox="0 0 120 32" className="w-full h-8 opacity-60">
      <path
        d="M0 24 L15 20 L30 22 L45 14 L60 18 L75 10 L90 12 L105 6 L120 8"
        fill="none"
        stroke="var(--amber-brand)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ModuleCard({
  mod,
  members,
  onOpen,
}: {
  mod: ModuleDef;
  members: TeamMember[];
  onOpen: (m: ModuleDef) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const Icon = mod.icon;

  return (
    <div
      className="group relative overflow-hidden rounded-3xl border border-navy-ink/8 bg-card/75 backdrop-blur-sm transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-amber-brand/35 hover:shadow-[var(--shadow-soft)]"
    >
      {/* corner reveal */}
      <div
        className="pointer-events-none absolute -top-32 -right-32 w-80 h-80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
        style={{ background: `radial-gradient(circle, var(--amber-glow) 0%, transparent 60%)` }}
      />

      <div className="relative p-6 md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${mod.accent} border border-navy-ink/8 flex items-center justify-center text-gold-deep`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base md:text-lg leading-tight">{mod.name}</h3>
              <p className="text-xs text-navy-ink/55 mt-0.5">{mod.tagline}</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          {mod.metrics.map((m) => (
            <div key={m.label} className="rounded-xl bg-navy-ink/[0.03] border border-navy-ink/5 p-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-navy-ink/45 truncate">{m.label}</p>
              <p className="text-lg md:text-xl font-bold text-navy-ink mt-1 tabular-nums">{m.value}</p>
              {m.delta && <p className="text-[10px] text-amber-brand font-semibold mt-0.5">{m.delta}</p>}
            </div>
          ))}
        </div>

        <div className="mt-4 px-1">
          <Sparkline />
        </div>

        <div className="flex items-center gap-2 mt-4">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-navy-ink/10 bg-card/80 px-3 py-2 text-xs font-semibold hover:border-amber-brand/40 transition-colors duration-500"
          >
            {expanded ? "Hide members" : `View members (${members.length})`}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-500 ${expanded ? "rotate-180" : ""}`} />
          </button>
          <button
            onClick={() => onOpen(mod)}
            className="inline-flex items-center justify-center rounded-lg bg-navy-ink text-cream-warm px-3 py-2 text-xs font-semibold hover:bg-navy-ink/90 transition-colors"
          >
            Open
          </button>
        </div>

        <div
          className="overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ maxHeight: expanded ? 400 : 0, opacity: expanded ? 1 : 0 }}
        >
          <div className="mt-4 pt-4 border-t border-navy-ink/8 space-y-2">
            {members.map((m) => (
              <div key={m._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-navy-ink/[0.03] transition-colors">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-navy-ink to-gold-deep text-cream-warm flex items-center justify-center text-xs font-bold">
                  {m.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{m.name}</p>
                  <p className="text-xs text-amber-brand">{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamDrawer({ mod, members, onClose }: { mod: ModuleDef; members: TeamMember[]; onClose: () => void }) {
  const Icon = mod.icon;
  return (
    <div className="fixed inset-0 z-50 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-navy-ink/40 backdrop-blur-sm" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-card shadow-2xl animate-in slide-in-from-right duration-500 overflow-y-auto">
        <div className="sticky top-0 bg-card/90 backdrop-blur border-b border-navy-ink/8 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${mod.accent} border border-navy-ink/8 flex items-center justify-center text-gold-deep`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold">{mod.name}</h3>
              <p className="text-xs text-navy-ink/55">{mod.tagline}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-navy-ink/5 flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-navy-ink/45 mb-3">Key metrics</p>
            <div className="grid grid-cols-3 gap-2">
              {mod.metrics.map((m) => (
                <div key={m.label} className="rounded-lg bg-navy-ink/[0.04] p-3">
                  <p className="text-[9px] uppercase tracking-widest text-navy-ink/45 truncate">{m.label}</p>
                  <p className="font-bold mt-1 tabular-nums">{m.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-navy-ink/45 mb-3">Team members</p>
            <div className="space-y-2">
              {members.map((m) => (
                <div key={m._id} className="flex gap-3 p-3 rounded-xl border border-navy-ink/8">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-navy-ink to-gold-deep text-cream-warm flex items-center justify-center font-bold">
                    {m.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <p className="font-semibold">{m.name}</p>
                    <p className="text-xs text-amber-brand font-semibold">{m.role}</p>
                    <p className="text-xs text-navy-ink/60 mt-1 leading-relaxed">{m.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function TeamPage() {
  const [items, setItems] = useState<TeamMember[]>([]);
  const [openMod, setOpenMod] = useState<ModuleDef | null>(null);

  useEffect(() => {
    teamApi.list().then(setItems);
  }, []);

  // partition members across modules deterministically
  const groups: Record<string, TeamMember[]> = { investment: [], finance: [], bd: [] };
  items.forEach((m, i) => {
    const k = ["investment", "finance", "bd"][i % 3];
    groups[k].push(m);
  });

  return (
    <main className="min-h-dvh">
      <SiteHeader />

      {/* Sticky section header */}
      <div className="sticky top-16 z-30 backdrop-blur-xl bg-cream-warm/70 border-b border-navy-ink/8">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg md:text-xl font-bold leading-tight">Our Operating Teams</h1>
            <p className="text-xs text-navy-ink/55">Cross-functional units driving execution and growth</p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-navy-ink/55">
            <Activity className="w-3.5 h-3.5 text-amber-brand" />
            <span>3 modules · {items.length} operators</span>
          </div>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-6 pt-10 pb-24">
        <div className="grid lg:grid-cols-2 gap-5">
          {MODULES.map((mod) => (
            <ModuleCard key={mod.id} mod={mod} members={groups[mod.id]} onOpen={setOpenMod} />
          ))}
        </div>
      </section>

      {openMod && (
        <TeamDrawer mod={openMod} members={groups[openMod.id]} onClose={() => setOpenMod(null)} />
      )}

      <SiteFooter />
    </main>
  );
}
