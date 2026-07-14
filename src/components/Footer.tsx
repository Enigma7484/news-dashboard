// src/components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-12 border-t border-[var(--line)] bg-[var(--panel)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 font-mono text-xs text-zinc-600 dark:text-zinc-500 sm:px-6 lg:px-8">
        <span>NEWSNOW / {new Date().getFullYear()}</span>
        <span>
          BUILT BY{' '}
          <span className="font-bold text-[var(--accent)]">
          EN1GMA
          </span>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
