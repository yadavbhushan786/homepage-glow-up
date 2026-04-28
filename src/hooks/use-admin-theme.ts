import { useEffect, useState } from "react";

const KEY = "asvf:admin-theme";
type Theme = "light" | "dark";

export function useAdminTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = (window.localStorage.getItem(KEY) as Theme | null) ?? "light";
    setTheme(saved);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(KEY, theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));
  return [theme, toggle];
}
