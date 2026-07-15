import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Cog6ToothIcon, HomeIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import SignalLogo from './SignalLogo';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode }) => {
  const location = useLocation();

  const linkClasses = (path: string) =>
    `inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold transition ${
      location.pathname === path
        ? 'bg-[var(--accent)] text-[var(--accent-contrast)]'
        : 'text-zinc-600 hover:bg-black/5 hover:text-black dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-[var(--text)]'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--app-bg)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <SignalLogo />
          <div className="hidden sm:block">
            <div className="text-base font-black leading-none text-[var(--text)]">
              NewsNow<span className="text-[var(--accent)]">.</span>
            </div>
            <div className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-500">
              Signal Dashboard
            </div>
          </div>
        </Link>

        <nav className="flex items-center gap-1 rounded-lg border border-[var(--line)] bg-[var(--panel)] p-1">
          <Link to="/" className={linkClasses('/')}>
            <HomeIcon className="h-4 w-4" />
            Home
          </Link>
          <Link to="/settings" className={linkClasses('/settings')}>
            <Cog6ToothIcon className="h-4 w-4" />
            Settings
          </Link>
        </nav>

        <button
          onClick={toggleDarkMode}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--panel)] text-zinc-700 transition hover:border-[var(--accent)] hover:text-[var(--accent)] dark:text-zinc-300"
          aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
          title={darkMode ? 'Light theme' : 'Dark theme'}
        >
          {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
        </button>
      </div>
    </header>
  );
};

export default Header;
