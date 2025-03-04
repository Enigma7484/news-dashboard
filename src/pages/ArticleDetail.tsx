import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchArticleById } from "../api";

interface Article {
    id: string;
    headline: string;
    url: string;
    sentiment: string;
    summary: string;
    content: string;
}

const ArticleDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Extract ID from URL
    const [article, setArticle] = useState<Article | null>(null);

    useEffect(() => {
        if (id) {
            fetchArticleById(id).then(setArticle);
        }
    }, [id]);

    if (!article) {
        return <p>Loading...</p>;
    }

    return (
        <div className="article-detail">
            <h2>{article.headline}</h2>
            <p><strong>Sentiment:</strong> {article.sentiment}</p>
            <p><strong>Summary:</strong> {article.summary}</p>
            <p><strong>Content:</strong></p>
            <p>{article.content}</p>
            <a href={article.url} target="_blank" rel="noopener noreferrer">
                Read Full Article
            </a>
        </div>
    );
};

export default ArticleDetail;