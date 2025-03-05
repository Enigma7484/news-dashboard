import React from "react";
import { useNavigate } from "react-router-dom";

interface ArticleProps {
    id: string;
    headline: string;
    url: string;
    sentiment: string;
    summary: string;
}

const ArticleCard: React.FC<ArticleProps> = ({ id, headline, url, sentiment, summary }) => {
    const navigate = useNavigate();

    return (
        <div className={`card ${sentiment}`} onClick={() => navigate(`/article/${id}`)}>
            <h3>{headline}</h3>
            <p>{summary}</p>
            <a href={url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                Read More
            </a>
        </div>
    );
};

export default ArticleCard;