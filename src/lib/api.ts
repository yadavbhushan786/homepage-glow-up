/**
 * Mock API layer — mirrors a REST/Mongoose backend.
 *
 * Replace each function body with `fetch("/api/...")` once your
 * Node + Express + MongoDB backend is live. Method/path mapping
 * is documented in /BACKEND.md.
 */

import type {
  Settings,
  PortfolioCompany,
  TeamMember,
  NewsItem,
  PageContent,
  AdminUser,
} from "./types";

// ---------- storage helpers ----------
const KEY = (k: string) => `asvf:${k}`;

function read<T>(k: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = window.localStorage.getItem(KEY(k));
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write<T>(k: string, v: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY(k), JSON.stringify(v));
}
const uid = () => Math.random().toString(36).slice(2, 10);
const now = () => new Date().toISOString();

// ---------- seeds ----------
const SEED_PORTFOLIO: PortfolioCompany[] = [
  { _id: "p1", name: "NovaIQ", logo: "", description: "Applied AI stack for enterprise.", sector: "AI", website: "#", createdAt: now() },
  { _id: "p2", name: "AetherGrid", logo: "", description: "Resilient digital infrastructure.", sector: "Infra", website: "#", createdAt: now() },
  { _id: "p3", name: "FreshToHome", logo: "", description: "Supply chain intelligence platform.", sector: "Logistics", website: "#", createdAt: now() },
  { _id: "p4", name: "Strata Labs", logo: "", description: "Mission-critical workflow SaaS.", sector: "SaaS", website: "#", createdAt: now() },
  { _id: "p5", name: "Orange HealthLabs", logo: "", description: "Doorstep diagnostics across major cities.", sector: "Health", website: "#", createdAt: now() },
  { _id: "p6", name: "Lumina Robotics", logo: "", description: "Autonomous last-mile logistics.", sector: "Robotics", website: "#", createdAt: now() },
];

const SEED_TEAM: TeamMember[] = [
  { _id: "t1", name: "Aarav Mehta", role: "Managing Partner", image: "", bio: "20 years in cross-border venture and product scaling.", order: 1, createdAt: now() },
  { _id: "t2", name: "Priya Iyer", role: "Partner, Growth", image: "", bio: "Former product leader at three unicorn-scale startups.", order: 2, createdAt: now() },
  { _id: "t3", name: "Rahul Banerjee", role: "Principal", image: "", bio: "Deep-tech investing and applied AI.", order: 3, createdAt: now() },
  { _id: "t4", name: "Sara Kapoor", role: "Head of Platform", image: "", bio: "Operating support, hiring, and GTM for portfolio.", order: 4, createdAt: now() },
];

const SEED_NEWS: NewsItem[] = [
  { _id: "n1", title: "ASVF closes $120M Fund III", date: now(), excerpt: "Continuing our long-term commitment to category-defining founders.", body: "Full press release content goes here.", createdAt: now() },
  { _id: "n2", title: "NovaIQ raises Series B led by ASVF", date: now(), excerpt: "Doubling down on applied AI for the enterprise.", body: "Full body...", createdAt: now() },
  { _id: "n3", title: "Welcoming Sara Kapoor as Head of Platform", date: now(), excerpt: "Strengthening operating support across the portfolio.", body: "Full body...", createdAt: now() },
];

const SEED_PAGES: Record<string, PageContent> = {
  about: {
    _id: "about",
    slug: "about",
    title: "About ASVF",
    sections: [
      { heading: "Our Mission", body: "Partner with bold founders building products that matter, and help them scale globally with focused long-term execution." },
      { heading: "Focus Areas", body: "AI, Infrastructure, SaaS, Logistics, Health, and Robotics — across early to growth stage." },
    ],
    updatedAt: now(),
  },
};

const SEED_SETTINGS: Settings = {
  _id: "settings",
  brandName: "ASVF",
  contactEmail: "contact@asvf.com",
  social: { twitter: "https://twitter.com/asvf", linkedin: "https://linkedin.com/company/asvf" },
  logoUrl: "",
};

// init seeds once
function init() {
  if (read("init", false)) return;
  write("portfolio", SEED_PORTFOLIO);
  write("team", SEED_TEAM);
  write("news", SEED_NEWS);
  write("pages", SEED_PAGES);
  write("settings", SEED_SETTINGS);
  write("init", true);
}
init();

// ---------- Portfolio ----------
export const portfolioApi = {
  list: async (): Promise<PortfolioCompany[]> => read("portfolio", SEED_PORTFOLIO),
  create: async (input: Omit<PortfolioCompany, "_id" | "createdAt">) => {
    const list = read<PortfolioCompany[]>("portfolio", []);
    const item: PortfolioCompany = { ...input, _id: uid(), createdAt: now() };
    write("portfolio", [item, ...list]);
    return item;
  },
  update: async (id: string, patch: Partial<PortfolioCompany>) => {
    const list = read<PortfolioCompany[]>("portfolio", []).map((x) => (x._id === id ? { ...x, ...patch } : x));
    write("portfolio", list);
  },
  remove: async (id: string) => {
    write("portfolio", read<PortfolioCompany[]>("portfolio", []).filter((x) => x._id !== id));
  },
};

// ---------- Team ----------
export const teamApi = {
  list: async (): Promise<TeamMember[]> => read<TeamMember[]>("team", SEED_TEAM).sort((a, b) => a.order - b.order),
  create: async (input: Omit<TeamMember, "_id" | "createdAt">) => {
    const list = read<TeamMember[]>("team", []);
    const item: TeamMember = { ...input, _id: uid(), createdAt: now() };
    write("team", [item, ...list]);
    return item;
  },
  update: async (id: string, patch: Partial<TeamMember>) => {
    write("team", read<TeamMember[]>("team", []).map((x) => (x._id === id ? { ...x, ...patch } : x)));
  },
  remove: async (id: string) => {
    write("team", read<TeamMember[]>("team", []).filter((x) => x._id !== id));
  },
};

// ---------- News ----------
export const newsApi = {
  list: async (): Promise<NewsItem[]> => read<NewsItem[]>("news", SEED_NEWS).sort((a, b) => +new Date(b.date) - +new Date(a.date)),
  create: async (input: Omit<NewsItem, "_id" | "createdAt">) => {
    const list = read<NewsItem[]>("news", []);
    const item: NewsItem = { ...input, _id: uid(), createdAt: now() };
    write("news", [item, ...list]);
    return item;
  },
  update: async (id: string, patch: Partial<NewsItem>) => {
    write("news", read<NewsItem[]>("news", []).map((x) => (x._id === id ? { ...x, ...patch } : x)));
  },
  remove: async (id: string) => {
    write("news", read<NewsItem[]>("news", []).filter((x) => x._id !== id));
  },
};

// ---------- Pages ----------
export const pagesApi = {
  get: async (slug: string): Promise<PageContent | null> => {
    const all = read<Record<string, PageContent>>("pages", SEED_PAGES);
    return all[slug] ?? null;
  },
  update: async (slug: string, patch: Partial<PageContent>) => {
    const all = read<Record<string, PageContent>>("pages", SEED_PAGES);
    all[slug] = { ...(all[slug] ?? { _id: slug, slug, title: slug, sections: [], updatedAt: now() }), ...patch, updatedAt: now() };
    write("pages", all);
  },
};

// ---------- Settings ----------
export const settingsApi = {
  get: async (): Promise<Settings> => read("settings", SEED_SETTINGS),
  update: async (patch: Partial<Settings>) => {
    write("settings", { ...read("settings", SEED_SETTINGS), ...patch });
  },
};

// ---------- Auth (mock) ----------
const ADMIN_SEED: AdminUser = {
  _id: "admin",
  email: "admin@asvf.com",
  // mock hash; real backend uses bcrypt
  passwordHash: "demo123",
  mfaEnabled: true,
  // mock TOTP — real backend uses speakeasy / otplib. Code "123456" always works in mock.
  mfaSecret: "DEMO",
};

export const authApi = {
  getCurrent: (): { email: string } | null => read("session", null),
  login: async (email: string, password: string) => {
    if (email !== ADMIN_SEED.email || password !== ADMIN_SEED.passwordHash) {
      throw new Error("Invalid email or password");
    }
    // returns a "challenge" requiring MFA next
    return { mfaRequired: ADMIN_SEED.mfaEnabled, challengeId: uid() };
  },
  verifyMfa: async (_challengeId: string, code: string) => {
    if (code !== "123456") throw new Error("Invalid authenticator code");
    write("session", { email: ADMIN_SEED.email });
    return { token: "mock-jwt-" + uid() };
  },
  logout: () => {
    if (typeof window !== "undefined") window.localStorage.removeItem(KEY("session"));
  },
};

// ---------- Media (mock upload) ----------
export const mediaApi = {
  upload: async (file: File): Promise<string> => {
    // returns a data URL; real backend would return /uploads/<id>
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },
};
