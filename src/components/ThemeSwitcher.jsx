import React, { useContext } from 'react';
import { ThemeContext } from '../App';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <button
      className="theme-switcher"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      aria-label="Switch theme"
      style={{
        position: 'fixed', top: 18, right: 18, zIndex: 1000
      }}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}
