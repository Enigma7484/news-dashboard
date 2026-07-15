import React from 'react';

export type BiasLabel = 'left' | 'centrist' | 'right';

export interface BiasSignal {
  phrase: string;
  lean: BiasLabel;
}

interface BiasMeterProps {
  bias?: BiasLabel | null;
  isPolitical?: boolean | null;
  score?: number | null;
  confidence?: number | null;
  signals?: BiasSignal[];
  rationale?: string | null;
  compact?: boolean;
}

const biasTone: Record<BiasLabel, string> = {
  left: 'bg-[#7788ff]/15 text-[#aab4ff] ring-[#7788ff]/30',
  centrist: 'bg-[var(--accent)]/10 text-[#658b00] ring-[var(--accent)]/30 dark:text-[var(--accent-soft)]',
  right: 'bg-[#ff906b]/15 text-[#b64b2b] ring-[#ff906b]/30 dark:text-[#ffb199]',
};

const segmentTone: Record<BiasLabel, string> = {
  left: 'bg-[#7788ff] shadow-[0_0_14px_rgba(119,136,255,0.45)]',
  centrist: 'bg-[var(--accent)] shadow-[0_0_14px_rgba(185,255,44,0.35)]',
  right: 'bg-[#ff906b] shadow-[0_0_14px_rgba(255,144,107,0.42)]',
};

function clampScore(score?: number | null) {
  if (typeof score !== 'number' || Number.isNaN(score)) return 0;
  return Math.max(-1, Math.min(1, score));
}

const BiasMeter: React.FC<BiasMeterProps> = ({
  bias,
  isPolitical,
  score,
  confidence,
  signals = [],
  rationale,
  compact = false,
}) => {
  const normalizedScore = clampScore(score);
  const label = bias || 'centrist';
  const isPending = !bias;
  const isApolitical = !isPending && isPolitical === false;
  const confidencePercent =
    typeof confidence === 'number'
      ? Math.round(Math.max(0, Math.min(1, confidence)) * 100)
      : null;

  return (
    <section
      className={compact ? 'mt-4' : 'mt-8 rounded-lg border border-[var(--line)] bg-[var(--panel-muted)] p-4 sm:p-5'}
      aria-label={
        isPending
          ? 'Political bias analysis pending'
          : isApolitical
            ? 'Article perspective: apolitical'
            : `Political bias: ${label}`
      }
    >
      <div className="mb-2.5 flex items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500">
            Perspective
          </p>
          {!compact && (
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              AI estimate from the complete article's framing
            </p>
          )}
        </div>
        <span
          className={`rounded px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.1em] ring-1 ${
            isPending
              ? 'bg-white/[0.04] text-zinc-500 ring-white/10'
              : isApolitical
                ? 'bg-zinc-500/10 text-zinc-600 ring-zinc-500/25 dark:text-zinc-300'
                : biasTone[label]
          }`}
        >
          {isPending ? 'Awaiting analysis' : isApolitical ? 'Apolitical' : label}
        </span>
      </div>

      <div
        className="grid grid-cols-3 gap-1.5"
        role={isPending || isApolitical ? 'group' : 'meter'}
        aria-valuemin={isPending || isApolitical ? undefined : -1}
        aria-valuemax={isPending || isApolitical ? undefined : 1}
        aria-valuenow={isPending || isApolitical ? undefined : normalizedScore}
      >
        {(['left', 'centrist', 'right'] as BiasLabel[]).map((segment) => (
          <span
            key={segment}
            className={`h-2 rounded-sm transition ${
              !isPending && !isApolitical && label === segment
                ? segmentTone[segment]
                : 'bg-zinc-200 dark:bg-white/[0.07]'
            }`}
          />
        ))}
      </div>

      <div className="mt-1.5 flex justify-between font-mono text-[9px] font-bold uppercase tracking-[0.08em] text-zinc-500">
        <span className={!isPending && !isApolitical && label === 'left' ? 'text-[#8e9cff]' : ''}>Left</span>
        <span className={!isPending && !isApolitical && label === 'centrist' ? 'text-[var(--accent)]' : ''}>Center</span>
        <span className={!isPending && !isApolitical && label === 'right' ? 'text-[#ff9f7d]' : ''}>Right</span>
      </div>

      {!compact && (
        <div className="mt-4 border-t border-[var(--line)] pt-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-zinc-500 dark:text-zinc-400">
            {confidencePercent !== null && (
              <span>{confidencePercent}% confidence</span>
            )}
            <span>{isApolitical ? 'No meaningful political framing detected' : 'Framing estimate, not a fact-check'}</span>
          </div>
          {rationale && (
            <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              {rationale}
            </p>
          )}
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
