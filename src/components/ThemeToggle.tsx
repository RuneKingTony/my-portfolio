"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

/** Switches between dark (default) and light; the choice is remembered on this device. */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);

  const flip = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage can be unavailable (private mode); the switch still works for this visit.
    }
  };

  const isDark = theme === "dark";
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={flip}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <svg viewBox="0 0 20 20" aria-hidden="true">
        {isDark ? (
          <>
            <circle cx="10" cy="10" r="4" />
            <path d="M10 1.5v2.5M10 16v2.5M1.5 10H4M16 10h2.5M4 4l1.8 1.8M14.2 14.2 16 16M4 16l1.8-1.8M14.2 5.8 16 4" />
          </>
        ) : (
          <path d="M15.5 12.5A6.5 6.5 0 0 1 7.5 4.5a6.5 6.5 0 1 0 8 8Z" />
        )}
      </svg>
      <span>{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}
