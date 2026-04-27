import { createFileRoute, Link } from "@tanstack/react-router";
import heroCollab from "@/assets/hero-collab.jpg";
import aspirationalHealth from "@/assets/aspirational-health.jpg";
import portfolioAi from "@/assets/portfolio-ai.jpg";
import portfolioGrid from "@/assets/portfolio-grid.jpg";
import portfolioOffice from "@/assets/portfolio-office.jpg";
import portfolioTeam from "@/assets/portfolio-team.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Smbhav Venture Fund — Scaling Visionary Teams Across Markets" },
      {
        name: "description",
        content:
          "We partner with bold founders and help them scale globally with capital, mentorship, and an unmatched ecosystem.",
      },
      { property: "og:title", content: "Smbhav Venture Fund" },
      {
        property: "og:description",
        content: "Capital, mentorship, and ecosystem access for visionary teams.",
      },
    ],
  }),
});

const stats = [
  { value: "$350M+", label: "Capital Deployed", note: "+18% YoY" },
  { value: "40+", label: "Portfolio Companies", note: "8 new this year" },
  { value: "18", label: "Global Presence", note: "Across key markets" },
  { value: "12", label: "Active Sectors", note: "Diversified exposure" },
];

const portfolio = [
  { name: "NovaIQ", desc: "Applied AI stack for enterprise.", img: portfolioAi, tag: "AI / Series B" },
  { name: "AetherGrid", desc: "Resilient digital infrastructure.", img: portfolioGrid, tag: "Infra / Series A" },
  { name: "FreshToHome", desc: "Supply chain intelligence platform.", img: portfolioOffice, tag: "Logistics / Series C" },
  { name: "Strata Labs", desc: "Mission-critical workflow SaaS.", img: portfolioTeam, tag: "SaaS / Seed" },
];

const offerings = [
  {
    title: "Global reach & scaled VC team",
    desc: "Tap a broad network, deep domain expertise, and seasoned venture operators across the world.",
  },
  {
    title: "Dedicated portfolio managers",
    desc: "Work with partners who help accelerate collaboration and internal alignment with key teams.",
  },
  {
    title: "PR & marketing opportunities",
    desc: "Amplify your brand through strategic communication and growth marketing support.",
  },
  {
    title: "Product & beta access",
    desc: "Get early access to innovation programs and closed beta environments for product advantage.",
  },
  {
    title: "Mentorship from product leaders",
    desc: "Learn from seasoned product leaders to sharpen strategy, execution, and scale readiness.",
  },
];

function Index() {
  return (
    <main className="min-h-dvh bg-cream-warm text-navy-ink selection:bg-amber-brand/30">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-cream-warm/80 backdrop-blur-md border-b border-navy-ink/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-baseline gap-1.5">
            <span className="font-heading font-bold text-xl tracking-tight text-navy-ink">amazon</span>
            <span className="font-heading font-bold text-xl tracking-tight text-amber-brand">smbhav</span>
            <span className="font-heading font-medium text-xl tracking-tight text-navy-ink/70">venture fund</span>
          </Link>
          <div className="hidden md:flex items-center gap-10 text-sm font-medium">
            <a href="#team" className="hover:text-amber-brand transition-colors">Our Team</a>
            <a href="#portfolio" className="hover:text-amber-brand transition-colors">Portfolio</a>
            <a href="#news" className="hover:text-amber-brand transition-colors">News & Events</a>
          </div>
          <button className="bg-amber-brand text-navy-ink px-5 py-2.5 text-sm font-semibold rounded-full hover:bg-amber-glow transition-all duration-300 shadow-[var(--shadow-amber)]">
            Got an idea? Speak to us
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-warm)" }} />
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-brand/15 text-gold-deep text-[11px] font-bold tracking-[0.2em] uppercase mb-8">
              <span className="size-1.5 rounded-full bg-amber-brand animate-pulse" />
              Global Reach
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold leading-[0.95] text-balance mb-8">
              Scaling <span className="text-amber-brand italic font-medium">visionary</span> teams across markets.
            </h1>
            <p className="text-lg md:text-xl text-navy-ink/70 max-w-[55ch] mb-10 leading-relaxed">
              We partner with bold leaders and help them scale products globally with focused long-term execution and an unmatched ecosystem.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-amber-brand text-navy-ink px-8 py-4 rounded-full font-bold flex items-center gap-3 hover:scale-[1.02] transition-transform shadow-[var(--shadow-amber)]">
                Explore Portfolio
                <span>→</span>
              </button>
              <button className="border border-navy-ink/15 bg-cream-warm/60 px-8 py-4 rounded-full font-semibold hover:bg-cream-warm transition-colors">
                Get in Touch
              </button>
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-[var(--shadow-soft)] rotate-2 hover:rotate-0 transition-transform duration-700">
              <img src={heroCollab} alt="Founders collaborating across markets" width={1200} height={1200} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-navy-ink text-cream-warm p-6 rounded-2xl shadow-xl max-w-[14rem]">
              <p className="font-heading font-bold text-3xl mb-1">18 <span className="text-amber-brand text-xl">↗</span></p>
              <p className="text-cream-warm/70 text-xs font-medium leading-tight">markets supported worldwide</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 mb-24 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-card rounded-2xl p-6 shadow-[var(--shadow-soft)] border border-navy-ink/5 group hover:-translate-y-1 transition-transform">
              <div className="flex justify-end">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-amber-brand/15 text-gold-deep px-2 py-1 rounded-full">{s.note}</span>
              </div>
              <p className="font-heading text-4xl font-bold mt-3 tabular-nums">{s.value}</p>
              <p className="text-sm text-navy-ink/60 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Portfolio */}
      <section id="portfolio" className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Portfolio</h2>
            <p className="text-lg text-navy-ink/60">A curated set of high-conviction companies building category leadership.</p>
          </div>
          <a href="#" className="text-gold-deep font-bold flex items-center gap-2 group border-b-2 border-amber-brand/30 pb-1 self-start">
            View all <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {portfolio.map((p) => (
            <div key={p.name} className="group cursor-pointer">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4 shadow-[var(--shadow-soft)]">
                <img src={p.img} alt={p.name} width={800} height={600} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold-deep">{p.tag}</span>
              <h3 className="font-heading font-bold text-xl mt-1">{p.name}</h3>
              <p className="text-sm text-navy-ink/60 mt-1 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Aspirational Companies */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <p className="text-sm text-navy-ink/60 font-medium">Your Passion <span className="text-amber-brand mx-2">+</span> Our Unmatched Experience</p>
          <p className="text-2xl text-amber-brand mt-3">∞</p>
          <h2 className="text-4xl md:text-5xl font-bold mt-3">Aspirational Companies</h2>
        </div>
        <div className="bg-cream-warm rounded-3xl p-8 lg:p-12 shadow-[var(--shadow-soft)] border border-navy-ink/5 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-amber-brand mb-4">Orange HealthLabs</h3>
            <p className="text-navy-ink/70 leading-relaxed mb-8">
              Orange Health Labs is a fast-growing diagnostics company delivering directly to customer doorsteps and accelerating reliable test results across major cities.
            </p>
            <button className="bg-amber-brand text-navy-ink px-7 py-3 rounded-full font-bold hover:bg-amber-glow transition-colors shadow-[var(--shadow-amber)]">
              Read More →
            </button>
          </div>
          <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-[var(--shadow-soft)]">
            <img src={aspirationalHealth} alt="Orange HealthLabs" width={1200} height={900} loading="lazy" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Offerings */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <h2 className="text-4xl md:text-5xl font-bold mb-12">
          In addition to capital <span className="italic text-amber-brand">we offer</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {offerings.map((o, i) => (
            <div
              key={o.title}
              className={`rounded-2xl p-6 border transition-all hover:-translate-y-1 ${
                i === 3
                  ? "bg-navy-ink text-cream-warm border-navy-ink shadow-[var(--shadow-soft)]"
                  : "bg-card border-navy-ink/5 shadow-[var(--shadow-soft)]"
              }`}
            >
              <div className={`size-10 rounded-full flex items-center justify-center mb-5 ${i === 3 ? "bg-amber-brand text-navy-ink" : "bg-amber-brand/15 text-gold-deep"}`}>
                <span className="font-bold text-sm">0{i + 1}</span>
              </div>
              <h4 className="font-heading font-bold text-base mb-3 leading-snug">{o.title}</h4>
              <p className={`text-sm leading-relaxed ${i === 3 ? "text-cream-warm/70" : "text-navy-ink/60"}`}>
                {o.desc}
              </p>
              {i === 3 && (
                <button className="mt-5 bg-amber-brand text-navy-ink px-5 py-2 rounded-full text-xs font-bold hover:bg-amber-glow transition-colors">
                  Get in touch
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="bg-navy-ink rounded-3xl p-12 lg:p-16 text-center relative overflow-hidden">
          <div className="absolute -top-20 -right-20 size-80 rounded-full bg-amber-brand/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 size-80 rounded-full bg-gold-deep/20 blur-3xl" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-cream-warm text-4xl md:text-5xl font-bold mb-6">
              Let's build something <span className="text-amber-brand italic">great</span> together
            </h2>
            <p className="text-cream-warm/70 text-lg mb-10">
              We partner with founders who are ready to scale fast with strategic capital, deep operating support, and a long-term vision.
            </p>
            <button className="bg-amber-brand text-navy-ink px-10 py-4 rounded-full font-bold hover:scale-[1.03] transition-transform shadow-[var(--shadow-amber)]">
              Get in Touch
            </button>
          </div>
        </div>
      </section>

      {/* Final hook */}
      <section className="border-t border-navy-ink/10 py-20" style={{ background: "var(--gradient-warm)" }}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">Ready to create a future?</h2>
          <p className="text-lg text-navy-ink/70">
            Write to us at{" "}
            <a href="mailto:contact-asvf@amazon.com" className="text-amber-brand font-bold border-b-2 border-amber-brand/40 hover:border-amber-brand transition-colors">
              contact-asvf@amazon.com
            </a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-navy-ink/10 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-baseline gap-1.5">
            <span className="font-heading font-bold tracking-tight">amazon</span>
            <span className="font-heading font-bold tracking-tight text-amber-brand">smbhav</span>
          </div>
          <p className="text-xs text-navy-ink/50">
            SMBHAV Venture Fund | Conditions of Use | © 1996–2025
          </p>
        </div>
      </footer>
    </main>
  );
}
