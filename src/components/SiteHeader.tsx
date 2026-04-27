import { Link } from "@tanstack/react-router";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/team", label: "Team" },
  { to: "/news", label: "News" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  return (
    <nav className="sticky top-0 z-50 bg-cream-warm/70 backdrop-blur-xl border-b border-navy-ink/5">
      <div className="max-w-7xl mx-auto px-6 h-16 md:h-20 flex items-center justify-between gap-6">
        <Link to="/" className="flex items-baseline gap-1.5 shrink-0">
          <span className="font-heading font-bold text-lg md:text-xl tracking-tight text-navy-ink">ASVF</span>
          <span className="hidden sm:inline font-heading font-medium text-sm tracking-tight text-navy-ink/60">venture fund</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeProps={{ className: "text-amber-brand" }}
              activeOptions={{ exact: l.to === "/" }}
              className="hover:text-amber-brand transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>
        <Link
          to="/contact"
          className="bg-amber-brand text-navy-ink px-4 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-semibold rounded-full hover:bg-amber-glow transition-all"
        >
          Speak to us
        </Link>
      </div>
    </nav>
  );
}
