import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { teamApi } from "@/lib/api";
import type { TeamMember } from "@/lib/types";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Team — ASVF Venture Fund" },
      { name: "description", content: "Meet the partners and operators behind ASVF." },
      { property: "og:title", content: "Team — ASVF" },
      { property: "og:description", content: "The investors and operators behind ASVF." },
    ],
  }),
  component: TeamPage,
});

function Avatar({ name, image }: { name: string; image: string }) {
  if (image) return <img src={image} alt={name} className="w-full aspect-square rounded-2xl object-cover" />;
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-navy-ink via-gold-deep to-amber-brand text-cream-warm flex items-center justify-center font-heading font-bold text-5xl">
      {initials}
    </div>
  );
}

function TeamPage() {
  const [items, setItems] = useState<TeamMember[]>([]);
  useEffect(() => {
    teamApi.list().then(setItems);
  }, []);

  return (
    <main className="min-h-dvh">
      <SiteHeader />

      <section className="max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-12">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-gold-deep mb-4">Our Team</p>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-3xl">
          Operators and investors who've <span className="text-amber-brand italic">built before</span>.
        </h1>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((m) => (
            <div key={m._id} className="group animate-in fade-in">
              <div className="overflow-hidden rounded-2xl shadow-[var(--shadow-soft)]">
                <Avatar name={m.name} image={m.image} />
              </div>
              <h3 className="font-heading font-bold text-lg mt-4">{m.name}</h3>
              <p className="text-sm text-amber-brand font-semibold">{m.role}</p>
              <p className="text-sm text-navy-ink/60 mt-2 leading-relaxed">{m.bio}</p>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
