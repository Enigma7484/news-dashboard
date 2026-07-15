import React from 'react';

const SignalLogo: React.FC = () => (
  <span
    className="signal-mark signal-grid relative inline-flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--panel)] text-[var(--accent)]"
    aria-hidden="true"
  >
    <svg
      viewBox="0 0 44 44"
      className="relative z-10 h-9 w-9"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M9.5 31.5v-19l12.5 19v-19l12.5 19v-19"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9.5" cy="12.5" r="2.2" fill="currentColor" />
      <circle cx="34.5" cy="12.5" r="2.2" fill="currentColor" />
    </svg>
    <span className="signal-mark-scan absolute inset-x-1 top-1/2 h-px" />
  </span>
);

export default SignalLogo;
