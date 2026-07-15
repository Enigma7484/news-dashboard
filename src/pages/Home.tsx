import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ListBulletIcon,
  RectangleGroupIcon,
} from '@heroicons/react/24/outline';
import { Article, fetchArticles } from '../api';
import ArticleCard from '../components/ArticleCard';
import {
  Preferences,
  SentimentFilter,
  SortOrder,
  ViewMode,
  applyTheme,
  getPreferences,
  savePreferences,
} from '../utils/preferences';

interface Pagination {
  total: number;
  offset: number;
  page_size: number;
  has_more: boolean;
}

const viewOptions: Array<{ value: ViewMode; label: string; icon: React.ElementType }> = [
  { value: 'grid', label: 'Grid', icon: Squares2X2Icon },
  { value: 'compact', label: 'Compact', icon: ListBulletIcon },
  { value: 'spotlight', label: 'Spotlight', icon: RectangleGroupIcon },
];

const Home: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    offset: 0,
    page_size: 15,
    has_more: false,
  });
  const [searchQuery, setSearchQuery] = useState(
    () => localStorage.getItem('newsNowSearch') || ''
  );
  const [preferences, setPreferences] = useState<Preferences>(() => getPreferences());
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const didInitialLoad = useRef(false);

  const updatePreferences = (patch: Partial<Preferences>) => {
    setPreferences((current) => {
      const next = { ...current, ...patch };
      savePreferences(next);
      applyTheme(next.theme);
      window.dispatchEvent(new Event('newsNowPreferencesChanged'));
      return next;
    });
  };

  const loadArticles = useCallback(
    async (
      offset = 0,
      query = searchQuery,
      sort: SortOrder = preferences.sort,
      cat: SentimentFilter = preferences.sentiment
    ) => {
      setIsLoading(true);
      setLoadError('');
      try {
        const r = await fetchArticles({
          offset,
          keyword: query,
          sort,
          category: cat,
          allTime: true,
        });
        setArticles(
          r.articles.map((a: any) => ({
            ...a,
            entities: Array.isArray(a.entities) ? a.entities : [],
          }))
        );
        setPagination(r.pagination);
      } catch (e) {
        console.error(e);
        setArticles([]);
        setPagination({
          total: 0,
          offset,
          page_size: 15,
          has_more: false,
        });
        setLoadError('Could not load articles from Mongo. Try again in a moment.');
      } finally {
        setIsLoading(false);
      }
    },
    [preferences.sentiment, preferences.sort, searchQuery]
  );

  useEffect(() => {
    if (didInitialLoad.current) return;
    didInitialLoad.current = true;
    applyTheme(preferences.theme);
    loadArticles(0, searchQuery, preferences.sort, preferences.sentiment);
  }, [loadArticles, preferences.sentiment, preferences.sort, preferences.theme, searchQuery]);

  useEffect(() => {
    localStorage.setItem('newsNowSearch', searchQuery);
  }, [searchQuery]);

  const sentimentCounts = useMemo(
    () =>
      articles.reduce(
        (acc, article) => {
          acc[article.sentiment] += 1;
          return acc;
        },
        { positive: 0, neutral: 0, negative: 0 }
      ),
    [articles]
  );

  const gridClass =
    preferences.view === 'compact'
      ? 'grid grid-cols-1 gap-4'
      : preferences.view === 'spotlight'
        ? 'grid grid-cols-1 gap-6'
        : 'grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3';

  const page = Math.floor(pagination.offset / pagination.page_size) + 1;
  const totalPages = Math.ceil(pagination.total / pagination.page_size) || 1;

  return (
    <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
      <section className="signal-grid relative mb-6 overflow-hidden border-y border-[var(--line)] bg-[var(--panel-muted)]">
        <div className="absolute left-0 top-0 h-full w-1 bg-[var(--accent)]" />
        <div className="grid gap-6 p-5 lg:grid-cols-[1fr,340px] lg:p-6">
          <div>
            <p className="signal-kicker mb-3 flex items-center gap-2">
              <span className="signal-pulse h-2 w-2 rounded-full" />
              Live digest / Active
            </p>
            <h1 className="text-3xl font-black leading-tight text-[var(--text)] sm:text-4xl">
              The world, reduced to <span className="text-[var(--accent)]">signal.</span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Current reporting across trusted sources, cleaned, classified, and ready to scan.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Metric label="Total" value={pagination.total} />
            <Metric label="Positive" value={sentimentCounts.positive} tone="emerald" />
            <Metric label="Negative" value={sentimentCounts.negative} tone="rose" />
          </div>
        </div>
      </section>

      <section className="mb-6 rounded-lg border border-[var(--line)] bg-[var(--panel)] p-3">
        <div className="grid gap-3 lg:grid-cols-[minmax(260px,1fr),180px,180px,auto]">
          <div className="signal-focus flex min-w-0 overflow-hidden rounded-md border border-[var(--line)] bg-[var(--app-bg)] focus-within:border-[var(--accent)]">
            <div className="flex items-center px-3 text-zinc-500">
              <MagnifyingGlassIcon className="h-5 w-5" />
            </div>
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') loadArticles(0);
              }}
              className="min-w-0 flex-1 bg-transparent px-1 py-3 text-sm font-medium text-[var(--text)] outline-none placeholder:text-zinc-500"
            />
            <button
              onClick={() => loadArticles(0)}
              className="bg-[var(--accent)] px-4 text-sm font-black text-[var(--accent-contrast)] transition hover:bg-[var(--accent-hover)]"
            >
              Search
            </button>
          </div>

          <select
            value={preferences.sentiment}
            onChange={(e) => {
              const sentiment = e.target.value as SentimentFilter;
              updatePreferences({ sentiment });
              loadArticles(0, searchQuery, preferences.sort, sentiment);
            }}
            className="signal-focus rounded-md border border-[var(--line)] bg-[var(--app-bg)] px-3 py-3 text-sm font-bold text-zinc-700 dark:text-zinc-200"
          >
            <option value="">All Sentiments</option>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
          </select>

          <select
            value={preferences.sort}
            onChange={(e) => {
              const sort = e.target.value as SortOrder;
              updatePreferences({ sort });
              loadArticles(0, searchQuery, sort, preferences.sentiment);
            }}
            className="signal-focus rounded-md border border-[var(--line)] bg-[var(--app-bg)] px-3 py-3 text-sm font-bold text-zinc-700 dark:text-zinc-200"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>

          <div className="flex rounded-md border border-[var(--line)] bg-[var(--app-bg)] p-1">
            {viewOptions.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => updatePreferences({ view: value })}
                className={`inline-flex h-10 w-11 items-center justify-center rounded-md transition ${
                  preferences.view === value
                    ? 'bg-[var(--accent)] text-[var(--accent-contrast)]'
                    : 'text-zinc-500 hover:text-black dark:text-zinc-500 dark:hover:text-[var(--text)]'
                }`}
                title={label}
                aria-label={`${label} view`}
              >
                <Icon className="h-5 w-5" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="flex min-h-[360px] flex-col items-center justify-center text-zinc-500">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-[var(--line)] border-t-[var(--accent)]" />
          <p className="mt-3 font-mono text-xs font-semibold uppercase tracking-[0.14em]">Loading signal...</p>
        </div>
      ) : loadError ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-8 text-center dark:border-rose-900/60 dark:bg-rose-950/30">
          <p className="font-semibold text-rose-700 dark:text-rose-200">{loadError}</p>
          <button
            onClick={() => loadArticles(0)}
            className="mt-4 rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-black text-[var(--accent-contrast)] transition hover:bg-[var(--accent-hover)]"
          >
            Retry
          </button>
        </div>
      ) : articles.length > 0 ? (
        <div className={gridClass}>
          {articles.map((article, index) => (
            <ArticleCard
              key={article._id}
              {...article}
              viewMode={preferences.view === 'spotlight' && index > 0 ? 'grid' : preferences.view}
              density={preferences.density}
              showImages={preferences.showImages}
              highlightEntities={preferences.highlightEntities}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-[var(--line)] bg-[var(--panel)] p-10 text-center text-zinc-500">
          No articles found.
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() =>
            loadArticles(Math.max(0, pagination.offset - pagination.page_size))
          }
          disabled={pagination.offset === 0}
          className="rounded-md border border-[var(--line)] bg-[var(--panel)] px-4 py-2 text-sm font-bold text-[var(--text)] transition hover:border-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Prev
        </button>
        <span className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-zinc-600 dark:text-zinc-400">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() =>
            loadArticles(pagination.offset + pagination.page_size)
          }
          disabled={!pagination.has_more}
          className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-black text-[var(--accent-contrast)] transition hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500 dark:disabled:bg-[#1b1f1c] dark:disabled:text-zinc-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

function Metric({
  label,
  value,
  tone = 'slate',
}: {
  label: string;
  value: number;
  tone?: 'slate' | 'emerald' | 'rose';
}) {
  const toneClass = {
    slate: 'text-[var(--accent)]',
    emerald: 'text-emerald-700 dark:text-emerald-300',
    rose: 'text-rose-700 dark:text-rose-300',
  }[tone];

  return (
    <div className="border border-[var(--line)] bg-[var(--app-bg)] p-3 text-center">
      <div className={`text-2xl font-black ${toneClass}`}>{value}</div>
      <div className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </div>
    </div>
  );
}

export default Home;
