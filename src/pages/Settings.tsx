// src/pages/Settings.tsx
import React, { useState, useEffect } from 'react';

const Settings: React.FC = () => {
  const [defaultSentiment, setDefaultSentiment] = useState(
    () => localStorage.getItem('defaultSentiment') || 'all'
  );
  const [defaultSort, setDefaultSort] = useState(
    () => localStorage.getItem('defaultSort') || 'desc'
  );
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('darkMode') === 'true'
  );

  useEffect(() => {
    localStorage.setItem('defaultSentiment', defaultSentiment);
  }, [defaultSentiment]);

  useEffect(() => {
    localStorage.setItem('defaultSort', defaultSort);
  }, [defaultSort]);

  useEffect(() => {
    localStorage.setItem('darkMode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Settings
      </h2>

      {/* Dark Mode Toggle */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mb-4">
        <span className="text-gray-800 dark:text-gray-200">Dark Mode</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode((dm) => !dm)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer peer-checked:bg-blue-600 transition" />
          <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white peer-checked:translate-x-5 rounded-full transition-shadow shadow-md" />
        </label>
      </div>

      {/* Default Sentiment Filter */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mb-4">
        <span className="text-gray-800 dark:text-gray-200">Default Sentiment</span>
        <select
          value={defaultSentiment}
          onChange={(e) => setDefaultSentiment(e.target.value)}
          className="bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="all">All</option>
          <option value="positive">Positive</option>
          <option value="neutral">Neutral</option>
          <option value="negative">Negative</option>
        </select>
      </div>

      {/* Default Sorting Order */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mb-4">
        <span className="text-gray-800 dark:text-gray-200">Default Sort Order</span>
        <select
          value={defaultSort}
          onChange={(e) => setDefaultSort(e.target.value)}
          className="bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>
    </div>
  );
};

export default Settings;