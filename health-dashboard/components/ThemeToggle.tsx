'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export function useTheme() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const isDark = stored ? stored === 'dark' : true;
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
  };

  return { dark, toggle };
}

export default function ThemeToggle() {
  const { dark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-xl transition-all active:scale-90"
      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
      aria-label="Toggle theme"
    >
      {dark
        ? <Sun size={16} style={{ color: 'var(--warning)' }} />
        : <Moon size={16} style={{ color: 'var(--strain)' }} />
      }
    </button>
  );
}
