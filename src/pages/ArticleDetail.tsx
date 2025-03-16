import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchArticleById } from "../api";

interface Article {
    _id: string;
    headline: string;
    url: string;
    sentiment: string;
    summary: string;
    image: string | null;
    timestamp: string;
}

const ArticleDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Extract ID from URL
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
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
                    setError("Article not found");
                }
            } catch (err) {
                setError("Failed to load article");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        
        loadArticle();
    }, [id]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error || !article) {
        return <p>Error: {error || "Article not found"}</p>;
    }

    return (
        <div className="article-detail">
            <h2>{article.headline}</h2>
            <p className="timestamp">Published: {new Date(article.timestamp).toLocaleDateString()}</p>
            {article.image && (
                <img 
                    src={article.image} 
                    alt={article.headline} 
                    className="article-image"
                />
            )}
            <p><strong>Sentiment:</strong> {article.sentiment}</p>
            <p><strong>Summary:</strong> {article.summary}</p>
            <a href={article.url} target="_blank" rel="noopener noreferrer" className="read-more">
                Read Full Article
            </a>
        </div>
    );
};

export default ArticleDetail;