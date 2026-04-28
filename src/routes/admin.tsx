import { createFileRoute, Link, Outlet, redirect, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Users,
  Newspaper,
  Image as ImageIcon,
  Settings,
  Shield,
  Search,
  Bell,
  Sun,
  Moon,
  LogOut,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import { authApi } from "@/lib/api";
import { useAdminTheme } from "@/hooks/use-admin-theme";

export const Route = createFileRoute("/admin")({
  beforeLoad: ({ location }) => {
    if (location.pathname === "/admin/login") return;
    if (!authApi.getCurrent()) {
      throw redirect({ to: "/admin/login" });
    }
  },
  component: AdminShell,
});

type NavTo = "/admin" | "/admin/portfolio" | "/admin/team" | "/admin/news" | "/admin/settings";

const navItems: ReadonlyArray<{ to: NavTo; label: string; icon: typeof LayoutDashboard; exact?: boolean }> = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/portfolio", label: "Portfolio", icon: Briefcase },
  { to: "/admin/team", label: "Team", icon: Users },
  { to: "/admin/news", label: "News & Events", icon: Newspaper },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

const labelMap: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/portfolio": "Portfolio",
  "/admin/team": "Team",
  "/admin/news": "News & Events",
  "/admin/settings": "Settings",
};

function AdminShell() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLogin = pathname === "/admin/login";
  const [theme, toggleTheme] = useAdminTheme();
  const [collapsed, setCollapsed] = useState(false);

  if (isLogin) {
    return (
      <div className={`admin-scope ${theme === "dark" ? "dark" : ""} min-h-dvh`}>
        <Outlet />
      </div>
    );
  }

  const logout = () => {
    authApi.logout();
    navigate({ to: "/admin/login" });
  };

  const pageTitle = labelMap[pathname] ?? "Admin";

  return (
    <div className={`admin-scope ${theme === "dark" ? "dark" : ""} min-h-dvh`}>
      <div className={`grid min-h-dvh ${collapsed ? "md:grid-cols-[80px_1fr]" : "md:grid-cols-[260px_1fr]"} transition-[grid-template-columns] duration-300`}>
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col border-r border-[var(--a-border)] bg-[var(--a-surface)]/80 backdrop-blur-xl sticky top-0 h-dvh">
          <div className="flex items-center justify-between px-5 py-5">
            <Link to="/" className="flex items-center gap-2.5 min-w-0">
              <div className="size-9 rounded-xl flex items-center justify-center" style={{ background: "var(--a-grad)" }}>
                <Sparkles className="size-4.5 text-white" strokeWidth={2.5} />
              </div>
              {!collapsed && (
                <div className="min-w-0">
                  <div className="font-bold text-sm tracking-tight truncate">ASVF Admin</div>
                  <div className="text-[10px] uppercase tracking-widest text-[var(--a-text-muted)]">Console</div>
                </div>
              )}
            </Link>
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="size-7 rounded-lg flex items-center justify-center text-[var(--a-text-muted)] hover:bg-[var(--a-surface-2)] hover:text-[var(--a-text)] transition-colors"
              aria-label="Toggle sidebar"
            >
              <ChevronLeft className={`size-4 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} />
            </button>
          </div>

          <div className="px-3 mt-2">
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-[var(--a-text-muted)]">
              {!collapsed && "Workspace"}
            </div>
            <nav className="space-y-1">
              {navItems.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  activeOptions={{ exact: n.exact ?? false }}
                  activeProps={{ className: "is-active" }}
                  className="a-nav-item"
                  title={collapsed ? n.label : undefined}
                >
                  <n.icon className="size-[18px]" strokeWidth={2} />
                  {!collapsed && <span className="truncate">{n.label}</span>}
                </Link>
              ))}
            </nav>

            <div className="px-3 mt-6 mb-2 text-[10px] font-bold uppercase tracking-widest text-[var(--a-text-muted)]">
              {!collapsed && "System"}
            </div>
            <nav className="space-y-1">
              <div className="a-nav-item opacity-60 cursor-not-allowed" title="Coming soon">
                <FileText className="size-[18px]" strokeWidth={2} />
                {!collapsed && <span>Pages</span>}
              </div>
              <div className="a-nav-item opacity-60 cursor-not-allowed" title="Coming soon">
                <ImageIcon className="size-[18px]" strokeWidth={2} />
                {!collapsed && <span>Media Library</span>}
              </div>
              <div className="a-nav-item opacity-60 cursor-not-allowed" title="Coming soon">
                <Shield className="size-[18px]" strokeWidth={2} />
                {!collapsed && <span>Users & Roles</span>}
              </div>
            </nav>
          </div>

          {/* Profile bottom */}
          <div className="mt-auto p-3 border-t border-[var(--a-border)]">
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-[var(--a-surface-2)] transition-colors">
              <div
                className="size-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ background: "var(--a-grad)" }}
              >
                AD
              </div>
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold truncate">Admin</div>
                  <div className="text-[11px] text-[var(--a-text-muted)] truncate">admin@asvf.com</div>
                </div>
              )}
              {!collapsed && (
                <button onClick={logout} className="text-[var(--a-text-muted)] hover:text-[var(--a-danger)] transition-colors" title="Sign out">
                  <LogOut className="size-4" />
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Main column */}
        <div className="flex flex-col min-w-0">
          {/* Header */}
          <header className="sticky top-0 z-20 a-glass border-b border-[var(--a-border)]">
            <div className="flex items-center gap-4 px-5 md:px-8 h-16">
              <div className="min-w-0 flex-1">
                <h1 className="text-base md:text-lg font-bold tracking-tight truncate">{pageTitle}</h1>
                <p className="text-[11px] text-[var(--a-text-muted)] hidden sm:block">
                  Manage your content with ease
                </p>
              </div>

              <div className="hidden md:flex items-center gap-2 a-input max-w-xs flex-1" style={{ padding: "0.5rem 0.8rem" }}>
                <Search className="size-4 text-[var(--a-text-muted)]" />
                <input
                  placeholder="Search anything…"
                  className="bg-transparent border-0 outline-none text-sm flex-1 placeholder:text-[var(--a-text-muted)]"
                />
                <kbd className="text-[10px] px-1.5 py-0.5 rounded border border-[var(--a-border)] text-[var(--a-text-muted)]">⌘K</kbd>
              </div>

              <button
                onClick={toggleTheme}
                className="size-9 rounded-xl flex items-center justify-center border border-[var(--a-border)] text-[var(--a-text-soft)] hover:text-[var(--a-accent)] hover:border-[var(--a-accent)] transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "light" ? <Moon className="size-4" /> : <Sun className="size-4" />}
              </button>

              <button
                className="size-9 rounded-xl flex items-center justify-center border border-[var(--a-border)] text-[var(--a-text-soft)] hover:text-[var(--a-accent)] hover:border-[var(--a-accent)] transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="size-4" />
                <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-[var(--a-danger)] ring-2 ring-[var(--a-surface)]" />
              </button>

              <div
                className="size-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 cursor-pointer hover:scale-105 transition-transform"
                style={{ background: "var(--a-grad)" }}
                title="Admin"
              >
                AD
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 px-5 md:px-8 py-6 md:py-8 a-fade-in" key={pathname}>
            <div className="max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
