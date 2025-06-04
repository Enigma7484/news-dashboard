// src/components/ArticleCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { linkifyKeywords } from '../utils/keywordLinkifier';

interface ArticleProps {
  _id: string;
  headline: string;
  url: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  summary: string;
  image?: string | null;
  timestamp?: string;
  entities: string[];
}

const sentimentColors: Record<string, string> = {
  positive: 'bg-green-100 text-green-800',
  neutral: 'bg-yellow-100 text-yellow-800',
  negative: 'bg-red-100 text-red-800',
};

const ArticleCard: React.FC<ArticleProps> = ({
  _id,
  headline,
  url,
  sentiment,
  summary,
  image,
  timestamp,
  entities,
}) => {
  const linkedSummary = linkifyKeywords(summary, entities);

  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden transform hover:scale-105 transition">
      {image && (
        <div className="h-48 w-full overflow-hidden">
          <img
            src={image}
            alt="Article thumbnail"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="flex-1 p-4 flex flex-col">
        {/* Sentiment badge + date */}
        <div className="flex items-center justify-between mb-2">
          <span
            className={`px-2 py-0.5 text-sm font-medium rounded ${sentimentColors[sentiment]}`}
          >
            {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
          </span>
          {timestamp && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(timestamp).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          )}
        </div>

        {/* Headline */}
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
          {headline}
        </h3>

        {/* Summary */}
        <p
          className="text-sm text-gray-700 dark:text-gray-300 flex-1 mb-4 line-clamp-3"
          dangerouslySetInnerHTML={{ __html: linkedSummary }}
        />

        {/* Action Buttons */}
        <div className="mt-auto flex space-x-2">
          <Link
            to={`/article/${_id}`}
            className="flex-1 text-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition"
          >
            View Details
          </Link>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md font-medium transition"
          >
            Read Original
          </a>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;