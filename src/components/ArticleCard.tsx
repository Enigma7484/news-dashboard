import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowTopRightOnSquareIcon,
  CalendarDaysIcon,
  NewspaperIcon,
} from '@heroicons/react/24/outline';
import { getLookupKeywords, linkifyKeywords } from '../utils/keywordLinkifier';
import { getArticleSource } from '../utils/source';
import { Density, ViewMode } from '../utils/preferences';
import { cleanDisplaySummary } from '../utils/text';
import BiasMeter, { BiasLabel, BiasSignal } from './BiasMeter';

interface ArticleProps {
  _id: string;
  headline: string;
  url: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  summary: string;
  image?: string | null;
  timestamp?: string;
  entities?: string[];
  viewMode: ViewMode;
  density: Density;
  showImages: boolean;
  highlightEntities: boolean;
  source_name?: string;
  source_url?: string;
  bias?: BiasLabel | null;
  bias_is_political?: boolean | null;
  bias_score?: number | null;
  bias_confidence?: number | null;
  bias_signals?: BiasSignal[];
  bias_rationale?: string | null;
}

const sentimentStyles: Record<string, string> = {
  positive: 'bg-emerald-50 text-emerald-800 ring-emerald-200 dark:bg-white/5 dark:text-[var(--accent-soft)] dark:ring-[var(--accent)]/30',
  neutral: 'bg-amber-100 text-amber-800 ring-amber-200 dark:bg-amber-400/15 dark:text-amber-100 dark:ring-amber-400/20',
  negative: 'bg-rose-100 text-rose-800 ring-rose-200 dark:bg-rose-400/15 dark:text-rose-100 dark:ring-rose-400/20',
};

function formatDate(timestamp?: string) {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const ArticleCard: React.FC<ArticleProps> = ({
  _id,
  headline,
  url,
  sentiment,
  summary,
  image,
  timestamp,
  entities = [],
  viewMode,
  density,
  showImages,
  highlightEntities,
  source_name,
  source_url,
  bias,
  bias_is_political,
  bias_score,
  bias_confidence,
  bias_signals,
  bias_rationale,
}) => {
  const displaySummary = cleanDisplaySummary(summary, headline);
  const displayEntities = getLookupKeywords(entities);
  const linkedSummary = linkifyKeywords(displaySummary, entities, highlightEntities);
  const source = getArticleSource(url, source_name, source_url);
  const isCompact = viewMode === 'compact' || density === 'compact';
  const isSpotlight = viewMode === 'spotlight';
  const hasImage = Boolean(image && showImages);

  return (
    <article
      className={[
        'group overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--panel)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-[0_18px_60px_rgba(15,118,110,0.13)] dark:hover:shadow-[0_18px_60px_rgba(20,30,10,0.12)]',
        isCompact ? 'grid grid-cols-[96px,1fr]' : 'flex flex-col',
        isSpotlight ? 'lg:grid lg:grid-cols-[minmax(260px,0.9fr),1.1fr]' : '',
      ].join(' ')}
    >
      {hasImage ? (
        <div
          className={[
            'relative overflow-hidden bg-zinc-200 dark:bg-[#151916]',
            isCompact ? 'h-full min-h-[150px]' : isSpotlight ? 'h-72 lg:h-full' : 'h-52',
          ].join(' ')}
        >
          <img
            src={image || ''}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      ) : (
        !isCompact && (
          <div className="signal-grid flex h-36 items-center justify-center bg-[var(--panel-muted)]">
            <NewspaperIcon className="h-10 w-10 text-zinc-400 dark:text-[#5b655d]" />
          </div>
        )
      )}

      <div className={isCompact ? 'flex min-w-0 flex-col p-4' : 'flex flex-1 flex-col p-5'}>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className={`rounded px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.1em] ring-1 ${sentimentStyles[sentiment]}`}>
            {sentiment}
          </span>
          <span className="inline-flex min-w-0 items-center gap-1.5 rounded bg-black/[0.04] px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-zinc-700 dark:bg-white/[0.05] dark:text-zinc-300">
            {source.logoUrl ? (
              <img src={source.logoUrl} alt="" className="h-4 w-4 rounded-sm" loading="lazy" />
            ) : (
              <NewspaperIcon className="h-4 w-4" />
            )}
            <span className="truncate">{source.name}</span>
          </span>
          {timestamp && (
            <span className="ml-auto inline-flex items-center gap-1 font-mono text-[10px] font-medium uppercase tracking-[0.05em] text-zinc-500">
              <CalendarDaysIcon className="h-4 w-4" />
              {formatDate(timestamp)}
            </span>
          )}
        </div>

        <h3 className={isSpotlight ? 'mb-3 text-2xl font-bold leading-tight text-[var(--text)]' : 'mb-2 text-lg font-bold leading-snug text-[var(--text)]'}>
          {headline}
        </h3>

        <p
          className={[
            'text-sm leading-6 text-zinc-600 dark:text-zinc-400',
            isCompact ? 'line-clamp-2' : isSpotlight ? 'line-clamp-5' : 'line-clamp-4',
          ].join(' ')}
          dangerouslySetInnerHTML={{ __html: linkedSummary }}
        />

        <BiasMeter
          bias={bias}
          isPolitical={bias_is_political}
          score={bias_score}
          confidence={bias_confidence}
          signals={bias_signals}
          rationale={bias_rationale}
          compact
        />

        {displayEntities.length > 0 && !isCompact && (
          <div className="mt-4 flex flex-wrap gap-2">
            {displayEntities.slice(0, 4).map((entity) => (
              <span
                key={entity}
                className="rounded border border-[var(--line)] px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.05em] text-zinc-500"
              >
                {entity}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex gap-2 pt-5">
          <Link
            to={`/article/${_id}`}
            className="inline-flex flex-1 items-center justify-center rounded-md bg-[var(--accent)] px-3 py-2.5 text-sm font-black text-[var(--accent-contrast)] transition hover:bg-[var(--accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/40"
          >
            View Details
          </Link>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border border-[var(--line)] bg-transparent px-3 py-2.5 text-sm font-bold text-zinc-700 transition hover:border-[var(--accent)] hover:text-black focus:outline-none dark:text-zinc-300 dark:hover:text-[var(--text)]"
          >
            Read Original
            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
