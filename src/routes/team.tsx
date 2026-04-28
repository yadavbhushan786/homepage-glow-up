import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { teamApi } from "@/lib/api";
import type { TeamMember } from "@/lib/types";
import { X } from "lucide-react";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "The Collective — ASVF" },
      { name: "description", content: "The partners and operators behind ASVF — stewards of high-conviction capital." },
      { property: "og:title", content: "The Collective — ASVF" },
      { property: "og:description", content: "Our partners and operators." },
    ],
  }),
  component: TeamPage,
});

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("");
}

function MemberDrawer({ m, onClose }: { m: TeamMember; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-obsidian-deep/80 backdrop-blur-sm" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-obsidian border-l border-white/10 overflow-y-auto animate-in slide-in-from-right duration-500">
        <div className="sticky top-0 bg-obsidian/95 backdrop-blur border-b border-white/10 p-6 flex items-center justify-end">
          <button onClick={onClose} className="w-9 h-9 rounded-full border border-white/10 hover:border-brass/40 flex items-center justify-center text-sand/70">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-8 md:p-10">
          <div className="aspect-[4/5] bg-white/5 mb-8 overflow-hidden relative">
            {m.image ? (
              <img src={m.image} alt={m.name} className="w-full h-full object-cover grayscale brightness-75" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-display text-7xl text-brass/30">
                {initials(m.name)}
              </div>
            )}
            <div className="absolute inset-0 outline outline-1 -outline-offset-1 outline-white/10" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl text-brass">{m.name}</h2>
          <p className="text-[11px] uppercase tracking-[0.3em] text-sand/50 mt-3">{m.role}</p>
          <p className="text-sand/65 font-light leading-relaxed mt-8">{m.bio}</p>
        </div>
      </aside>
    </div>
  );
}

function TeamPage() {
  const [items, setItems] = useState<TeamMember[]>([]);
  const [open, setOpen] = useState<TeamMember | null>(null);

  useEffect(() => {
    teamApi.list().then(setItems);
  }, []);

  return (
    <main className="min-h-dvh obsidian-scope">
      <SiteHeader />

      {/* Hero */}
      <header className="max-w-7xl mx-auto px-6 md:px-12 pt-20 md:pt-32 pb-20 md:pb-24">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px w-8 bg-brass" />
          <span className="text-[11px] uppercase tracking-[0.4em] text-brass">The Collective</span>
        </div>
        <div className="grid lg:grid-cols-[1fr_1fr] gap-12 items-end">
          <h1 className="font-display text-5xl md:text-7xl leading-[0.98] tracking-tight text-sand">
            Stewards of <span className="italic">high-conviction</span> capital.
          </h1>
          <p className="text-lg text-sand/55 font-light leading-relaxed max-w-[52ch]">
            Former operators, engineers, and historians — unified by a singular institutional standard and a conviction that the best companies are built over decades, not quarters.
          </p>
        </div>
      </header>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pb-24 md:pb-32">
        <div className="flex justify-between items-end mb-10 border-b obsidian-hairline pb-6">
          <h2 className="font-display text-2xl md:text-3xl text-sand">Partners &amp; Operators</h2>
          <span className="text-[11px] tracking-[0.3em] uppercase text-sand/45 tabular-nums">
            {String(items.length).padStart(2, "0")} — Members
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5 border border-white/5">
          {items.map((m) => (
            <button
              key={m._id}
              onClick={() => setOpen(m)}
              className="group bg-obsidian p-8 md:p-10 text-left hover:bg-obsidian-deep transition-colors duration-700"
            >
              <div className="aspect-[4/5] bg-white/5 mb-6 relative overflow-hidden">
                {m.image ? (
                  <img
                    src={m.image}
                    alt={m.name}
                    className="w-full h-full object-cover grayscale brightness-75 group-hover:scale-105 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-display text-6xl text-brass/25 group-hover:text-brass/60 transition-colors duration-700">
                    {initials(m.name)}
                  </div>
                )}
                <div className="absolute inset-0 outline outline-1 -outline-offset-1 outline-white/10" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brass/0 to-transparent group-hover:via-brass/60 transition-all duration-700" />
              </div>
              <h3 className="font-display text-2xl text-sand group-hover:text-brass transition-colors duration-500">{m.name}</h3>
              <p className="text-[10px] uppercase tracking-[0.3em] text-sand/45 mt-2">{m.role}</p>
            </button>
          ))}
        </div>
      </section>

      {open && <MemberDrawer m={open} onClose={() => setOpen(null)} />}

      <SiteFooter />
    </main>
  );
}
