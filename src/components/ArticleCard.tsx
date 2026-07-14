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

interface ArticleProps {
  _id: string;
  headline: string;
  url: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  summary: string;
  image?: string | null;
  timestamp?: string;
  entities: string[];
  viewMode: ViewMode;
  density: Density;
  showImages: boolean;
  highlightEntities: boolean;
  source_name?: string;
  source_url?: string;
}

const sentimentStyles: Record<string, string> = {
  positive: 'bg-emerald-100 text-emerald-800 ring-emerald-200 dark:bg-emerald-400/15 dark:text-emerald-200 dark:ring-emerald-400/20',
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
  entities,
  viewMode,
  density,
  showImages,
  highlightEntities,
  source_name,
  source_url,
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
        'group overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-xl dark:border-slate-700/70 dark:bg-slate-900/80 dark:hover:border-blue-400/50',
        isCompact ? 'grid grid-cols-[96px,1fr]' : 'flex flex-col',
        isSpotlight ? 'lg:grid lg:grid-cols-[minmax(260px,0.9fr),1.1fr]' : '',
      ].join(' ')}
    >
      {hasImage ? (
        <div
          className={[
            'relative overflow-hidden bg-slate-200 dark:bg-slate-800',
            isCompact ? 'h-full min-h-[150px]' : isSpotlight ? 'h-72 lg:h-full' : 'h-52',
          ].join(' ')}
        >
          <img
            src={image || ''}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/40 to-transparent" />
        </div>
      ) : (
        !isCompact && (
          <div className="flex h-36 items-center justify-center bg-slate-100 dark:bg-slate-800">
            <NewspaperIcon className="h-10 w-10 text-slate-400" />
          </div>
        )
      )}

      <div className={isCompact ? 'flex min-w-0 flex-col p-4' : 'flex flex-1 flex-col p-5'}>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ${sentimentStyles[sentiment]}`}>
            {sentiment}
          </span>
          <span className="inline-flex min-w-0 items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {source.logoUrl ? (
              <img src={source.logoUrl} alt="" className="h-4 w-4 rounded-sm" loading="lazy" />
            ) : (
              <NewspaperIcon className="h-4 w-4" />
            )}
            <span className="truncate">{source.name}</span>
          </span>
          {timestamp && (
            <span className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
              <CalendarDaysIcon className="h-4 w-4" />
              {formatDate(timestamp)}
            </span>
          )}
        </div>

        <h3 className={isSpotlight ? 'mb-3 text-2xl font-bold leading-tight text-slate-950 dark:text-white' : 'mb-2 text-lg font-bold leading-snug text-slate-950 dark:text-white'}>
          {headline}
        </h3>

        <p
          className={[
            'text-sm leading-6 text-slate-600 dark:text-slate-300',
            isCompact ? 'line-clamp-2' : isSpotlight ? 'line-clamp-5' : 'line-clamp-4',
          ].join(' ')}
          dangerouslySetInnerHTML={{ __html: linkedSummary }}
        />

        {displayEntities.length > 0 && !isCompact && (
          <div className="mt-4 flex flex-wrap gap-2">
            {displayEntities.slice(0, 4).map((entity) => (
              <span
                key={entity}
                className="rounded-full border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-500 dark:border-slate-700 dark:text-slate-400"
              >
                {entity}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex gap-2 pt-5">
          <Link
            to={`/article/${_id}`}
            className="inline-flex flex-1 items-center justify-center rounded-md bg-blue-600 px-3 py-2.5 text-sm font-bold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            View Details
          </Link>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-slate-100 px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
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
