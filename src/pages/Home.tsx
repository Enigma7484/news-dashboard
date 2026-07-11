import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ListBulletIcon,
  RectangleGroupIcon,
} from '@heroicons/react/24/outline';
import { fetchArticles } from '../api';
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

interface Article {
  _id: string;
  headline: string;
  url: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  summary: string;
  image?: string;
  entities: string[];
  timestamp?: string;
}

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
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <section className="mb-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-6 p-5 lg:grid-cols-[1fr,340px] lg:p-6">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-blue-600 dark:text-blue-300">
              Live digest
            </p>
            <h1 className="text-3xl font-black leading-tight text-slate-950 dark:text-white sm:text-4xl">
              Latest News
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              Fresh articles from the scraper, cleaned for duplicate junk, grouped by sentiment, and enriched with source and entity links.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Metric label="Total" value={pagination.total} />
            <Metric label="Positive" value={sentimentCounts.positive} tone="emerald" />
            <Metric label="Negative" value={sentimentCounts.negative} tone="rose" />
          </div>
        </div>
      </section>

      <section className="mb-6 rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-3 lg:grid-cols-[minmax(260px,1fr),180px,180px,auto]">
          <div className="flex min-w-0 overflow-hidden rounded-md border border-slate-200 bg-slate-50 focus-within:ring-2 focus-within:ring-blue-400 dark:border-slate-700 dark:bg-slate-950">
            <div className="flex items-center px-3 text-slate-400">
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
              className="min-w-0 flex-1 bg-transparent px-1 py-3 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
            />
            <button
              onClick={() => loadArticles(0)}
              className="bg-blue-600 px-4 text-sm font-bold text-white transition hover:bg-blue-500"
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
            className="rounded-md border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
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
            className="rounded-md border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>

          <div className="flex rounded-md bg-slate-100 p-1 dark:bg-slate-950">
            {viewOptions.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => updatePreferences({ view: value })}
                className={`inline-flex h-10 w-11 items-center justify-center rounded-md transition ${
                  preferences.view === value
                    ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-800 dark:text-blue-300'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
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
        <div className="flex min-h-[360px] flex-col items-center justify-center text-slate-500 dark:text-slate-400">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          <p className="mt-3 text-sm font-semibold">Loading articles...</p>
        </div>
      ) : loadError ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-8 text-center dark:border-rose-900/60 dark:bg-rose-950/30">
          <p className="font-semibold text-rose-700 dark:text-rose-200">{loadError}</p>
          <button
            onClick={() => loadArticles(0)}
            className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-500"
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
        <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          No articles found.
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() =>
            loadArticles(Math.max(0, pagination.offset - pagination.page_size))
          }
          disabled={pagination.offset === 0}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
        >
          Prev
        </button>
        <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() =>
            loadArticles(pagination.offset + pagination.page_size)
          }
          disabled={!pagination.has_more}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
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
    slate: 'text-slate-950 dark:text-white',
    emerald: 'text-emerald-700 dark:text-emerald-300',
    rose: 'text-rose-700 dark:text-rose-300',
  }[tone];

  return (
    <div className="rounded-lg bg-slate-100 p-3 text-center dark:bg-slate-950">
      <div className={`text-2xl font-black ${toneClass}`}>{value}</div>
      <div className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </div>
    </div>
  );
}

export default Home;
