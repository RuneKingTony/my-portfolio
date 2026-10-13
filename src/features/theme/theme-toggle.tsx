'use client';

import { useSyncExternalStore } from 'react';
import './theme-toggle.css';

type Theme = 'dark' | 'light';

// The theme lives on <html data-theme>, set before first paint by layout.tsx's script.
const readTheme = (): Theme =>
  document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';

const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  return () => {
    observer.disconnect();
  };
};

/** Switches between dark (default) and light; the choice is remembered on this device. */
export function ThemeToggle() {
  const theme = useSyncExternalStore<Theme>(subscribe, readTheme, () => 'dark');

  const flip = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      // Storage can be unavailable (private mode); the switch still works for this visit.
    }
  };

  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={flip}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
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
      <span>{isDark ? 'Light' : 'Dark'}</span>
    </button>
  );
}
