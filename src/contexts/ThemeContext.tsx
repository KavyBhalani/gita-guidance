"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "theme-cosmic" | "theme-pure-light" | "theme-forest" | "theme-sunset";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "theme-cosmic",
  setTheme: () => {},
});

const ALL_THEMES = ["theme-cosmic", "theme-pure-light", "theme-forest", "theme-sunset"];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("theme-cosmic");

  useEffect(() => {
    const savedTheme = localStorage.getItem("gita-theme") as Theme;
    if (savedTheme && ALL_THEMES.includes(savedTheme)) {
      setThemeState(savedTheme);
      document.documentElement.classList.remove(...ALL_THEMES);
      document.documentElement.classList.add(savedTheme);
    } else {
      document.documentElement.classList.add("theme-cosmic");
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("gita-theme", newTheme);
    document.documentElement.classList.remove(...ALL_THEMES);
    document.documentElement.classList.add(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
