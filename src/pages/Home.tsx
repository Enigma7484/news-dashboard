import React, { useEffect, useState } from "react";
import { fetchAllArticles, fetchArticlesBySentiment, searchArticles } from "../api";
import ArticleCard from "../components/ArticleCard";
import { useNavigate } from "react-router-dom"; // For navigating to settings
import "../App.css";

// Define Article type
interface Article {
    id: string;
    headline: string;
    url: string;
    sentiment: string;
    summary: string;
}

const Home: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [sentimentFilter, setSentimentFilter] = useState(() => {
        return localStorage.getItem("defaultSentiment") || "all";
    });
    const [sortOrder, setSortOrder] = useState(() => {
        return localStorage.getItem("defaultSort") || "newest";
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("darkMode") === "true";
    });

    const articlesPerPage = 6;
    const navigate = useNavigate(); // Navigation hook for settings page

    // Fetch Articles Based on Sentiment Filter
    useEffect(() => {
        if (sentimentFilter === "all") {
            fetchAllArticles().then(setArticles);
        } else {
            fetchArticlesBySentiment(sentimentFilter).then(setArticles);
        }
    }, [sentimentFilter]);

    // Apply Dark Mode Persistence
    useEffect(() => {
        localStorage.setItem("darkMode", String(darkMode));
        if (darkMode) {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }
    }, [darkMode]);

    // Handle Search Input
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    // Perform Search
    const performSearch = async () => {
        if (searchQuery.trim() !== "") {
            const results = await searchArticles(searchQuery);
            setArticles(results);
            setCurrentPage(1);
        } else {
            fetchAllArticles().then(setArticles);
        }
    };

    // Toggle Dark Mode
    const toggleDarkMode = () => {
        setDarkMode((prevMode) => {
            localStorage.setItem("darkMode", String(!prevMode));
            return !prevMode;
        });
    };

    // Sorting Functionality
    const sortedArticles = [...articles].sort((a, b) => {
        return sortOrder === "newest"
            ? new Date(b.url).getTime() - new Date(a.url).getTime()
            : new Date(a.url).getTime() - new Date(b.url).getTime();
    });

    // Pagination
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = sortedArticles.slice(indexOfFirstArticle, indexOfLastArticle);

    const nextPage = () => {
        if (currentPage < Math.ceil(articles.length / articlesPerPage)) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    return (
        <div className={`container ${darkMode ? "dark" : ""}`}>
            <h2>Latest News</h2>

            {/* Dark Mode Toggle */}
            <button onClick={toggleDarkMode} className="dark-mode-toggle">
                {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
            </button>

            {/* Navigate to Settings Page */}
            <button onClick={() => navigate("/settings")} className="settings-button">
                ⚙ Settings
            </button>

            {/* Search Bar */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={handleSearch}
                />
                <button onClick={performSearch}>Search</button>
            </div>

            {/* Sentiment Filter */}
            <select
                value={sentimentFilter}
                onChange={(e) => {
                    setSentimentFilter(e.target.value);
                    localStorage.setItem("defaultSentiment", e.target.value);
                }}
                className="filter-dropdown"
            >
                <option value="all">All</option>
                <option value="positive">Positive</option>
                <option value="neutral">Neutral</option>
                <option value="negative">Negative</option>
            </select>

            {/* Sorting Options */}
            <select
                value={sortOrder}
                onChange={(e) => {
                    setSortOrder(e.target.value);
                    localStorage.setItem("defaultSort", e.target.value);
                }}
                className="sort-dropdown"
            >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
            </select>

            {/* News Grid */}
            <div className="grid">
                {currentArticles.length > 0 ? (
                    currentArticles.map((article) => (
                        <ArticleCard key={article.id} {...article} />
                    ))
                ) : (
                    <p>No articles found.</p>
                )}
            </div>

            {/* Pagination Buttons */}
            <div className="pagination">
                <button onClick={prevPage} disabled={currentPage === 1}>
                    ◀ Previous
                </button>
                <span>
                    Page {currentPage} of {Math.ceil(articles.length / articlesPerPage)}
                </span>
                <button onClick={nextPage} disabled={currentPage === Math.ceil(articles.length / articlesPerPage)}>
                    Next ▶
                </button>
            </div>
        </div>
    );
};

export default Home;