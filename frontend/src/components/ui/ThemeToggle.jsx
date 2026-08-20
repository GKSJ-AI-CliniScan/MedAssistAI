import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle({ className = '', compact = false }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} theme`}
      className={`
        inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 select-none
        ${isDark 
          ? 'bg-clinical-bgDarkSec text-clinical-tealDark border border-clinical-tealDark/30 hover:bg-clinical-cardDark hover:border-clinical-tealDark/60 shadow-aurora-dark' 
          : 'bg-white text-clinical-green border border-clinical-mint hover:bg-clinical-mint/40 shadow-sm'
        }
        ${className}
      `}
    >
      {isDark ? (
        <>
          <Moon className="w-3.5 h-3.5 text-clinical-tealDark" />
          {!compact && <span>🌙 Dark</span>}
        </>
      ) : (
        <>
          <Sun className="w-3.5 h-3.5 text-amber-500" />
          {!compact && <span>☀ Light</span>}
        </>
      )}
    </button>
  );
}
