import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ArrowTopRightOnSquareIcon,
  CalendarDaysIcon,
  NewspaperIcon,
} from '@heroicons/react/24/outline';
import { Article, fetchArticleById } from '../api';
import { getLookupKeywords, linkifyKeywords } from '../utils/keywordLinkifier';
import { getArticleSource } from '../utils/source';
import { getPreferences } from '../utils/preferences';
import { cleanDisplaySummary } from '../utils/text';
import BiasMeter from '../components/BiasMeter';

const sentimentLabels: Record<string, string> = {
  positive: 'bg-emerald-100 text-emerald-800 ring-emerald-200 dark:bg-emerald-400/15 dark:text-emerald-200 dark:ring-emerald-400/20',
  neutral: 'bg-amber-100 text-amber-800 ring-amber-200 dark:bg-amber-400/15 dark:text-amber-100 dark:ring-amber-400/20',
  negative: 'bg-rose-100 text-rose-800 ring-rose-200 dark:bg-rose-400/15 dark:text-rose-100 dark:ring-rose-400/20',
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
      setError(null);
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
      <div className="flex h-72 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[var(--line)] border-t-[var(--accent)]" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="mx-auto mt-12 max-w-xl rounded-lg border border-rose-200 bg-rose-50 p-8 text-center font-semibold text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-200">
        {error || 'Article not found'}
      </div>
    );
  }

  const source = getArticleSource(
    article.url,
    article.source_name,
    article.source_url
  );
  const preferences = getPreferences();
  const displaySummary = cleanDisplaySummary(article.summary, article.headline);
  const displayEntities = getLookupKeywords(article.entities || []);
  const linkedSummary = linkifyKeywords(
    displaySummary,
    displayEntities,
    preferences.highlightEntities
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-2 rounded-md border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-[var(--accent)] dark:text-slate-200"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back
      </Link>

      <article className="overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--panel)]">
        {article.image && preferences.showImages && (
          <div className="h-80 overflow-hidden bg-slate-200 dark:bg-slate-800">
            <img
              src={article.image}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="p-5 sm:p-8">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ring-1 ${sentimentLabels[article.sentiment]}`}>
              {article.sentiment}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {source.logoUrl ? (
                <img src={source.logoUrl} alt="" className="h-4 w-4 rounded-sm" />
              ) : (
                <NewspaperIcon className="h-4 w-4" />
              )}
              {source.name}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <CalendarDaysIcon className="h-4 w-4" />
              {new Date(article.timestamp).toLocaleDateString(undefined, {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>

          <h1 className="max-w-4xl text-3xl font-black leading-tight text-[var(--text)] sm:text-5xl">
            {article.headline}
          </h1>

          <p
            className="mt-6 max-w-3xl text-lg leading-8 text-slate-700 dark:text-slate-200"
            dangerouslySetInnerHTML={{ __html: linkedSummary }}
          />

          <div className="max-w-3xl">
            <BiasMeter
              bias={article.bias}
              score={article.bias_score}
              confidence={article.bias_confidence}
              signals={article.bias_signals}
            />
          </div>

          {displayEntities.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {displayEntities.slice(0, 8).map((entity) => (
                <span
                  key={entity}
                  className="rounded border border-[var(--line)] px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.05em] text-slate-500 dark:text-slate-400"
                >
                  {entity}
                </span>
              ))}
            </div>
          )}

          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-5 py-3 text-sm font-black text-[var(--accent-contrast)] transition hover:bg-[var(--accent-hover)]"
          >
            Read Full Article
            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
          </a>
        </div>
      </article>
    </div>
  );
};

export default ArticleDetail;
