// src/pages/ArticleDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchArticleById } from '../api';

interface Article {
  _id: string;
  headline: string;
  url: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  summary: string;
  image: string | null;
  timestamp: string;
}

const sentimentLabels: Record<string, string> = {
  positive: 'text-green-600 bg-green-100',
  neutral: 'text-yellow-600 bg-yellow-100',
  negative: 'text-red-600 bg-red-100',
};

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticle = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await fetchArticleById(id);
        if (data) {
          setArticle(data);
        } else {
          setError('Article not found');
        }
      } catch (err) {
        setError('Failed to load article');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <svg
          className="animate-spin h-10 w-10 text-blue-600"
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
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="text-center text-red-600 mt-12">
        Error: {error || 'Article not found'}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Back Link */}
      <Link
        to="/"
        className="inline-flex items-center text-blue-600 hover:underline dark:text-blue-400 transition"
      >
        ← Back to Home
      </Link>

      {/* Headline */}
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight">
        {article.headline}
      </h1>

      {/* Meta + Sentiment */}
      <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
        <span>
          Published:{' '}
          <span className="font-medium">
            {new Date(article.timestamp).toLocaleDateString(undefined, {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </span>
        <span
          className={`px-3 py-1 text-sm font-medium rounded-full ${sentimentLabels[article.sentiment]}`}
        >
          {article.sentiment.charAt(0).toUpperCase() +
            article.sentiment.slice(1)}
        </span>
      </div>

      {/* Image */}
      {article.image && (
        <div className="w-full h-64 overflow-hidden rounded-lg shadow-lg">
          <img
            src={article.image}
            alt={article.headline}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Summary */}
      <div className="prose dark:prose-dark max-w-none text-gray-800 dark:text-gray-200">
        <p>{article.summary}</p>
      </div>

      {/* Read Full Article */}
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
      >
        Read Full Article
      </a>
    </div>
  );
};

export default ArticleDetail;