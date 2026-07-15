import React from 'react';

export type BiasLabel = 'left' | 'centrist' | 'right';

export interface BiasSignal {
  phrase: string;
  lean: 'left' | 'right';
}

interface BiasMeterProps {
  bias?: BiasLabel | null;
  score?: number | null;
  confidence?: number | null;
  signals?: BiasSignal[];
  compact?: boolean;
}

const biasTone: Record<BiasLabel, string> = {
  left: 'bg-blue-100 text-blue-800 ring-blue-200 dark:bg-blue-400/15 dark:text-blue-200 dark:ring-blue-400/25',
  centrist: 'bg-zinc-100 text-zinc-700 ring-zinc-200 dark:bg-white/[0.06] dark:text-zinc-200 dark:ring-white/10',
  right: 'bg-red-100 text-red-800 ring-red-200 dark:bg-red-400/15 dark:text-red-200 dark:ring-red-400/25',
};

function clampScore(score?: number | null) {
  if (typeof score !== 'number' || Number.isNaN(score)) return 0;
  return Math.max(-1, Math.min(1, score));
}

const BiasMeter: React.FC<BiasMeterProps> = ({
  bias,
  score,
  confidence,
  signals = [],
  compact = false,
}) => {
  const normalizedScore = clampScore(score);
  const markerPosition = `${2 + ((normalizedScore + 1) / 2) * 96}%`;
  const label = bias || 'centrist';
  const isPending = !bias;
  const confidencePercent =
    typeof confidence === 'number'
      ? Math.round(Math.max(0, Math.min(1, confidence)) * 100)
      : null;

  return (
    <section
      className={compact ? 'mt-4' : 'mt-8 rounded-lg border border-[var(--line)] bg-[var(--panel-muted)] p-4 sm:p-5'}
      aria-label={isPending ? 'Political bias analysis pending' : `Political bias: ${label}`}
    >
      <div className="mb-2.5 flex items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500">
            Bias meter / article framing
          </p>
          {!compact && (
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Estimated from the language used across the article
            </p>
          )}
        </div>
        <span
          className={`rounded px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.1em] ring-1 ${biasTone[label]}`}
        >
          {isPending ? 'Pending' : label}
        </span>
      </div>

      <div className="relative pt-1">
        <div className="h-2 overflow-hidden rounded-full bg-gradient-to-r from-blue-500 via-zinc-300 to-red-500 dark:via-zinc-600">
          <div className="absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-[var(--text)]/40" />
        </div>
        <span
          className="absolute top-0 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-white bg-[var(--text)] shadow-sm transition-[left] dark:border-slate-900"
          style={{ left: markerPosition }}
          aria-hidden="true"
        />
      </div>

      <div className="mt-1.5 flex justify-between font-mono text-[9px] font-bold uppercase tracking-[0.08em] text-zinc-500">
        <span>Left</span>
        <span>Centrist</span>
        <span>Right</span>
      </div>

      {!compact && (
        <div className="mt-4 border-t border-[var(--line)] pt-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-zinc-500 dark:text-zinc-400">
            {confidencePercent !== null && (
              <span>{confidencePercent}% confidence</span>
            )}
            <span>Framing estimate, not a fact-check</span>
          </div>
          {signals.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2" aria-label="Framing signals">
              {signals.slice(0, 5).map((signal) => (
                <span
                  key={`${signal.lean}-${signal.phrase}`}
                  className="rounded border border-[var(--line)] bg-[var(--panel)] px-2 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.05em] text-zinc-500"
                >
                  {signal.phrase}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default BiasMeter;
