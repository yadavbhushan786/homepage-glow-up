import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-navy-ink/10 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-8 md:grid-cols-3">
        <div>
          <p className="font-heading font-bold text-lg">ASVF</p>
          <p className="text-sm text-navy-ink/60 mt-2 max-w-xs">
            Partnering with visionary founders to scale category-defining companies globally.
          </p>
        </div>
        <div className="text-sm">
          <p className="font-bold mb-3">Explore</p>
          <ul className="space-y-2 text-navy-ink/70">
            <li><Link to="/about" className="hover:text-amber-brand">About</Link></li>
            <li><Link to="/portfolio" className="hover:text-amber-brand">Portfolio</Link></li>
            <li><Link to="/team" className="hover:text-amber-brand">Team</Link></li>
            <li><Link to="/news" className="hover:text-amber-brand">News</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="font-bold mb-3">Contact</p>
          <a href="mailto:contact@asvf.com" className="text-amber-brand font-semibold">contact@asvf.com</a>
          <p className="text-navy-ink/50 mt-6 text-xs">© {new Date().getFullYear()} ASVF Venture Fund</p>
        </div>
      </div>
    </footer>
  );
}
