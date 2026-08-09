import { useEffect, useState } from 'react';

/**
 * useTheme — toggles `dark` class on <html> and persists to localStorage.
 */
const THEME_KEY = 'medassist_theme';

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    return localStorage.getItem(THEME_KEY) || 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  return {
    theme,
    toggle: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    setTheme,
  };
}
