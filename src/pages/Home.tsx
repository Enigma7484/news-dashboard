// src/pages/Home.tsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { fetchArticles } from '../api';
import ArticleCard from '../components/ArticleCard';

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

const Home: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    offset: 0,
    page_size: 10,
    has_more: false,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(
    (localStorage.getItem('defaultSort') as 'asc' | 'desc') || 'desc'
  );
  const [category, setCategory] = useState<string>(
    localStorage.getItem('defaultSentiment') || ''
  );
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const didInitialLoad = useRef(false);

  const loadArticles = useCallback(
    async (
      offset = 0,
      query = '',
      sort: 'asc' | 'desc' = 'desc',
      cat = ''
    ) => {
      setIsLoading(true);
      setLoadError('');
      try {
        const r = await fetchArticles({
          offset,
          keyword: query,
          sort,
          category: cat as any,
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
        setLoadError('Could not load articles. The backend may still be waking up.');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Initial load
  useEffect(() => {
    if (didInitialLoad.current) return;
    didInitialLoad.current = true;
    loadArticles(0, searchQuery, sortOrder, category);
  }, [category, loadArticles, searchQuery, sortOrder]);

  // Dark mode toggle effect on body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header & Toggle */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Latest News
        </h2>
        <button
          onClick={() => setDarkMode((dm) => !dm)}
          className="mt-4 md:mt-0 inline-flex items-center px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          {darkMode ? '☀ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Search Bar */}
        <div className="col-span-1 md:col-span-2 flex">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200"
          />
          <button
            onClick={() => loadArticles(0, searchQuery, sortOrder, category)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-r-lg transition"
          >
            Search
          </button>
        </div>

        {/* Filters */}
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            loadArticles(0, searchQuery, sortOrder, e.target.value);
          }}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Sentiments</option>
          <option value="positive">Positive</option>
          <option value="neutral">Neutral</option>
          <option value="negative">Negative</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value as 'asc' | 'desc');
            loadArticles(0, searchQuery, e.target.value as any, category);
          }}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      {/* Article Grid */}
      {isLoading ? (
        <div className="text-center py-10">
          <svg
            className="animate-spin h-10 w-10 text-blue-600 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Loading…</p>
        </div>
      ) : loadError ? (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400">{loadError}</p>
          <button
            onClick={() => loadArticles(0, searchQuery, sortOrder, category)}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
          >
            Retry
          </button>
        </div>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((a) => (
            <ArticleCard key={a._id} {...a} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No articles found.
        </p>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center mt-8 space-x-4">
        <button
          onClick={() =>
            loadArticles(
              Math.max(0, pagination.offset - pagination.page_size),
              searchQuery,
              sortOrder,
              category
            )
          }
          disabled={pagination.offset === 0}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            pagination.offset === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          ◀ Prev
        </button>
        <span className="text-gray-700 dark:text-gray-300">
          Page{' '}
          <span className="font-semibold">
            {Math.floor(pagination.offset / pagination.page_size) + 1}
          </span>{' '}
          of{' '}
          <span className="font-semibold">
            {Math.ceil(pagination.total / pagination.page_size) || 1}
          </span>
        </span>
        <button
          onClick={() =>
            loadArticles(
              pagination.offset + pagination.page_size,
              searchQuery,
              sortOrder,
              category
            )
          }
          disabled={!pagination.has_more}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            !pagination.has_more
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          Next ▶
        </button>
      </div>
    </div>
  );
};

export default Home;
