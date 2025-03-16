import React from "react";
import { Link } from "react-router-dom";

interface ArticleProps {
    _id: string;
    headline: string;
    url: string;
    sentiment: string;
    summary: string;
    image?: string | null;
    timestamp?: string;
}

const ArticleCard: React.FC<ArticleProps> = ({ 
    _id, 
    headline, 
    url, 
    sentiment, 
    summary, 
    image,
    timestamp 
}) => {
    return (
        <div className={`card ${sentiment}`}>
            {image && <img src={image} alt="Article thumbnail" className="article-image" />}
            <h3>{headline}</h3>
            {timestamp && (
                <p className="timestamp">
                    {new Date(timestamp).toLocaleDateString()}
                </p>
            )}
            <p className="summary">{summary}</p>
            <div className="card-actions">
                <Link 
                    to={`/article/${_id}`} 
                    className="view-details"
                >
                    View Details
                </Link>
                <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="read-more"
                >
                    Read Original
                </a>
            </div>
        </div>
    );
};

export default ArticleCard;