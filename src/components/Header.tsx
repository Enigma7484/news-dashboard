// src/components/Header.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../assets/logo.png'; // <-- adjust path to your logo
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid'

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode }) => {
  const location = useLocation();

  const linkClasses = (path: string) =>
    (location.pathname === path
      ? 'text-blue-600 dark:text-blue-400 font-semibold'
      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400') +
    ' px-3 py-2 rounded-md transition';
  
  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/">
          <img src={Logo} alt="NewsNow Logo" className="h-20 w-auto" />
        </Link>

        {/* Nav Links */}
        <nav className="flex space-x-2">
          <Link to="/" className={linkClasses('/')}>
            Home
          </Link>
          <Link to="/settings" className={linkClasses('/settings')}>
            Settings
          </Link>
        </nav>

        {/* Dark/Light Toggle */}
        <button
          onClick={toggleDarkMode}
          className="ml-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          {darkMode ? (
            <SunIcon className="h-5 w-5 text-yellow-400" />
          ) : (
            <MoonIcon className="h-5 w-5 text-gray-800" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;