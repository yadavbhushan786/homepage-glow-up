import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { portfolioApi, teamApi, newsApi } from "@/lib/api";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const [counts, setCounts] = useState({ portfolio: 0, team: 0, news: 0 });

  useEffect(() => {
    Promise.all([portfolioApi.list(), teamApi.list(), newsApi.list()]).then(([p, t, n]) =>
      setCounts({ portfolio: p.length, team: t.length, news: n.length })
    );
  }, []);

  const cards = [
    { label: "Portfolio Companies", value: counts.portfolio },
    { label: "Team Members", value: counts.team },
    { label: "News Items", value: counts.news },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-navy-ink/60 mb-8">Overview of your content.</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-card rounded-2xl p-6 border border-navy-ink/5 shadow-[var(--shadow-soft)]">
            <p className="text-xs font-bold uppercase tracking-widest text-navy-ink/50">{c.label}</p>
            <p className="text-4xl font-heading font-bold mt-2 tabular-nums">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
