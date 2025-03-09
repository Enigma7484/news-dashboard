import React from "react";

interface ArticleProps {
    headline: string;
    url: string;
    sentiment: string;
    summary: string;
    image?: string;
}

const ArticleCard: React.FC<ArticleProps> = ({ headline, url, sentiment, summary, image }) => {
    return (
        <div className={`card ${sentiment}`}>
            {image && <img src={image} alt="Article thumbnail" className="article-image" />}  {/* Display Image */}
            <h3>{headline}</h3>
            <p>{summary}</p>
            <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: 'white', backgroundColor: 'black', padding: '10px 20px', borderRadius: '5px', textDecoration: 'none', display: 'inline-block' }}>Read More</a>
        </div>
    );
};

export default ArticleCard;