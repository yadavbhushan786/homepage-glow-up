import { createFileRoute, Link, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { authApi } from "@/lib/api";

export const Route = createFileRoute("/admin")({
  beforeLoad: ({ location }) => {
    if (location.pathname === "/admin/login") return;
    if (!authApi.getCurrent()) {
      throw redirect({ to: "/admin/login" });
    }
  },
  component: AdminShell,
});

const navItems: ReadonlyArray<{ to: "/admin" | "/admin/portfolio" | "/admin/team" | "/admin/news" | "/admin/settings"; label: string; exact?: boolean }> = [
  { to: "/admin", label: "Dashboard", exact: true },
  { to: "/admin/portfolio", label: "Portfolio" },
  { to: "/admin/team", label: "Team" },
  { to: "/admin/news", label: "News" },
  { to: "/admin/settings", label: "Settings" },
];

function AdminShell() {
  const navigate = useNavigate();
  const isLogin = typeof window !== "undefined" && window.location.pathname === "/admin/login";

  if (isLogin) return <Outlet />;

  const logout = () => {
    authApi.logout();
    navigate({ to: "/admin/login" });
  };

  return (
    <div className="min-h-dvh grid md:grid-cols-[240px_1fr]">
      <aside className="bg-navy-ink text-cream-warm p-6 md:min-h-dvh">
        <Link to="/" className="font-heading font-bold text-lg block mb-8">ASVF <span className="text-amber-brand">/admin</span></Link>
        <nav className="space-y-1">
          {navItems.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.exact ?? false }}
              activeProps={{ className: "bg-amber-brand text-navy-ink" }}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-cream-warm/80 hover:bg-cream-warm/10 transition-colors"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <button onClick={logout} className="mt-8 text-xs text-cream-warm/60 hover:text-amber-brand">
          Sign out
        </button>
      </aside>
      <main className="p-6 md:p-10 max-w-5xl">
        <Outlet />
      </main>
    </div>
  );
}
