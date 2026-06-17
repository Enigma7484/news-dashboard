import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Cog6ToothIcon, HomeIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import Logo from '../assets/logo.png';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode }) => {
  const location = useLocation();

  const linkClasses = (path: string) =>
    `inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold transition ${
      location.pathname === path
        ? 'bg-blue-50 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <img src={Logo} alt="NewsNow" className="h-12 w-12 rounded-md object-cover" />
          <div className="hidden sm:block">
            <div className="text-base font-black leading-none text-slate-950 dark:text-white">
              NewsNow
            </div>
            <div className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">
              Signal Dashboard
            </div>
          </div>
        </Link>

        <nav className="flex items-center gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-900">
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
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
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
