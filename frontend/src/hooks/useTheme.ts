import { useState, useEffect } from "react";

export type Theme = "light" | "dark";

export interface UseThemeReturn {
  theme: Theme;
  toggleTheme: () => void;
}

const THEME_STORAGE_KEY = "theme";

const getInitialTheme = (): Theme => {
  try {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return savedTheme === "dark" || savedTheme === "light"
      ? savedTheme
      : "light";
  } catch {
    // If localStorage is unavailable or throws an error, default to light theme
    return "light";
  }
};

const applyThemeToDocument = (theme: Theme): void => {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

export const useTheme = (): UseThemeReturn => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    applyThemeToDocument(theme);
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      try {
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      } catch {
        // If localStorage is unavailable, continue without persisting
      }
      applyThemeToDocument(newTheme);
      return newTheme;
    });
  };

  return { theme, toggleTheme };
};
