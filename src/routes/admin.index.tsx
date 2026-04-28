import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Briefcase,
  Users,
  Newspaper,
  FileText,
  TrendingUp,
  Plus,
  Upload,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import { portfolioApi, teamApi, newsApi } from "@/lib/api";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const [counts, setCounts] = useState({ portfolio: 0, team: 0, news: 0, pages: 3 });
  const [activity, setActivity] = useState<{ label: string; meta: string; tone: string }[]>([]);

  useEffect(() => {
    Promise.all([portfolioApi.list(), teamApi.list(), newsApi.list()]).then(([p, t, n]) => {
      setCounts({ portfolio: p.length, team: t.length, news: n.length, pages: 3 });
      const items: { label: string; meta: string; tone: string }[] = [];
      n.slice(0, 3).forEach((x) => items.push({ label: `News published — ${x.title}`, meta: new Date(x.date).toLocaleDateString(), tone: "var(--a-accent)" }));
      t.slice(0, 2).forEach((x) => items.push({ label: `Team member updated — ${x.name}`, meta: x.role, tone: "var(--a-success)" }));
      p.slice(0, 2).forEach((x) => items.push({ label: `Portfolio entry — ${x.name}`, meta: x.sector, tone: "var(--a-warn)" }));
      setActivity(items);
    });
  }, []);

  const cards = [
    { label: "Total Pages", value: counts.pages, icon: FileText, trend: "+2 this mo", grad: "linear-gradient(135deg, oklch(0.62 0.21 275), oklch(0.65 0.2 245))" },
    { label: "Portfolio Items", value: counts.portfolio, icon: Briefcase, trend: "+3 added", grad: "linear-gradient(135deg, oklch(0.65 0.2 245), oklch(0.7 0.18 200))" },
    { label: "Team Members", value: counts.team, icon: Users, trend: "Stable", grad: "linear-gradient(135deg, oklch(0.7 0.18 200), oklch(0.72 0.16 175))" },
    { label: "News & Events", value: counts.news, icon: Newspaper, trend: "Live", grad: "linear-gradient(135deg, oklch(0.72 0.16 175), oklch(0.78 0.15 75))" },
  ];

  const quickActions: { to: "/admin/portfolio" | "/admin/team" | "/admin/news"; label: string; icon: typeof Plus; desc: string }[] = [
    { to: "/admin/portfolio", label: "Add Portfolio", icon: Plus, desc: "New investment" },
    { to: "/admin/news", label: "Publish News", icon: Newspaper, desc: "Announcement or event" },
    { to: "/admin/team", label: "Invite Member", icon: Upload, desc: "Add to team page" },
  ];

  return (
    <div className="space-y-8">
      {/* Hero greeting */}
      <div className="a-card p-6 md:p-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{ background: "var(--a-grad)" }} />
        <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="a-chip mb-3"><TrendingUp className="size-3" /> Performance up 12%</div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Good to see you, Admin 👋</h2>
            <p className="text-sm text-[var(--a-text-soft)] mt-1.5 max-w-lg">
              Here's a snapshot of your CMS activity. Everything is healthy and ready to publish.
            </p>
          </div>
          <Link to="/admin/news" className="a-btn a-btn-primary">
            <Plus className="size-4" /> New post
          </Link>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <div key={c.label} className="a-card a-card-hover p-5 a-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-start justify-between">
              <div className="size-10 rounded-xl flex items-center justify-center text-white" style={{ background: c.grad }}>
                <c.icon className="size-5" strokeWidth={2.2} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--a-success)] inline-flex items-center gap-1">
                <ArrowUpRight className="size-3" /> {c.trend}
              </span>
            </div>
            <div className="mt-5">
              <div className="text-3xl font-bold tabular-nums tracking-tight">{c.value}</div>
              <div className="text-xs text-[var(--a-text-muted)] mt-1 font-medium">{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Lower grid: quick actions + activity */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 a-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold tracking-tight">Quick Actions</h3>
              <p className="text-xs text-[var(--a-text-muted)] mt-0.5">Most common workflows</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {quickActions.map((a) => (
              <Link
                key={a.label}
                to={a.to}
                className="group a-card a-card-hover p-4 flex flex-col gap-3"
              >
                <div className="size-10 rounded-xl flex items-center justify-center text-[var(--a-accent)] group-hover:text-white transition-colors" style={{ background: "var(--a-accent-soft)" }}>
                  <a.icon className="size-5" strokeWidth={2.2} />
                </div>
                <div>
                  <div className="font-semibold text-sm">{a.label}</div>
                  <div className="text-xs text-[var(--a-text-muted)] mt-0.5">{a.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="a-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold tracking-tight flex items-center gap-2">
                <Activity className="size-4 text-[var(--a-accent)]" /> Recent Activity
              </h3>
              <p className="text-xs text-[var(--a-text-muted)] mt-0.5">Latest events</p>
            </div>
          </div>
          <ol className="space-y-3.5">
            {activity.length === 0 && (
              <li className="text-xs text-[var(--a-text-muted)]">No recent activity.</li>
            )}
            {activity.map((it, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="mt-1.5 size-2 rounded-full flex-shrink-0" style={{ background: it.tone }} />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{it.label}</div>
                  <div className="text-[11px] text-[var(--a-text-muted)] mt-0.5">{it.meta}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
