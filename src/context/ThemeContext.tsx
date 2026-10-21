import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "khelgrid-theme";

function computeTheme(currentTheme: Theme): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  if (currentTheme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return currentTheme;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Always initialize with identical static defaults on both server and client
  // so the SSR HTML and initial client hydration DOM are guaranteed to match.
  const [theme, setThemeState] = useState<Theme>("light");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");
  const [mounted, setMounted] = useState(false);

  // Once mounted on the client, read persisted preferences and sync DOM
  useEffect(() => {
    let activeTheme: Theme = "light";
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) || localStorage.getItem("theme");
      if (saved === "light" || saved === "dark" || saved === "system") {
        activeTheme = saved as Theme;
        setThemeState(activeTheme);
      }
    } catch {
      // Ignore localStorage access errors
    }

    const nextResolved = computeTheme(activeTheme);
    setResolvedTheme(nextResolved);

    const root = document.documentElement;
    if (nextResolved === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
      root.style.colorScheme = "light";
    }

    setMounted(true);
  }, []);

  // Update theme when changed after mount
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    const nextResolved = computeTheme(theme);
    setResolvedTheme(nextResolved);

    if (nextResolved === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
      root.style.colorScheme = "light";
    }

    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
      localStorage.setItem("theme", theme);
    } catch {
      // Ignore localStorage access errors
    }

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        const sysResolved: ResolvedTheme = e.matches ? "dark" : "light";
        setResolvedTheme(sysResolved);
        if (sysResolved === "dark") {
          root.classList.add("dark");
          root.classList.remove("light");
          root.style.colorScheme = "dark";
        } else {
          root.classList.remove("dark");
          root.classList.add("light");
          root.style.colorScheme = "light";
        }
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => {
      const current = prev === "system" ? resolvedTheme : prev;
      return current === "dark" ? "light" : "dark";
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

const defaultThemeContext: ThemeContextType = {
  theme: "system",
  resolvedTheme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
  mounted: false,
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return defaultThemeContext;
  }
  return context;
}
