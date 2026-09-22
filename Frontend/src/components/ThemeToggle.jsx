import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ className = '', size = 'md' }) {
  const { theme, toggleTheme, isDark } = useTheme();

  const isSmall = size === 'sm';
  const iconSize = isSmall ? 'w-4 h-4' : 'w-4.5 h-4.5';
  const buttonDimensions = isSmall ? 'w-8 h-8' : 'w-9 h-9';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex items-center justify-center rounded-xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-aqua-400 active:scale-95 ${buttonDimensions} ${
        isDark
          ? 'bg-navy-800/90 border border-slate-700/60 text-aqua-400 hover:bg-navy-700 hover:text-aqua-300 hover:border-aqua-500/50 shadow-sm shadow-aqua-950/40'
          : 'bg-white/90 border border-slate-200/80 text-amber-500 hover:bg-slate-50 hover:text-amber-600 hover:border-amber-300 shadow-xs'
      } ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="sr-only">Toggle theme</span>
      {/* Sun icon */}
      <Sun
        className={`${iconSize} transition-all duration-500 transform ${
          isDark
            ? 'scale-0 -rotate-90 opacity-0 absolute'
            : 'scale-100 rotate-0 opacity-100'
        }`}
      />
      {/* Moon icon */}
      <Moon
        className={`${iconSize} transition-all duration-500 transform ${
          isDark
            ? 'scale-100 rotate-0 opacity-100'
            : 'scale-0 rotate-90 opacity-0 absolute'
        }`}
      />
    </button>
  );
}
