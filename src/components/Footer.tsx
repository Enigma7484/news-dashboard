// src/components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
        📢 NewsNow &copy; {new Date().getFullYear()} | Built by{' '}
        <span className="text-blue-600 dark:text-blue-400 font-semibold">
          EN1GMA
        </span>
      </div>
    </footer>
  );
};

export default Footer;