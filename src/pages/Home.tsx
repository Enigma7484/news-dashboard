import React, { useEffect, useState } from "react";
import { fetchAllArticles, fetchArticlesBySentiment, searchArticles } from "../api";
import ArticleCard from "../components/ArticleCard";
import "../App.css";

// Define Article type
interface Article {
    _id: string;
    headline: string;
    url: string;
    sentiment: string;
    summary: string;
    image?: string;
}

const Home: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [sentimentFilter, setSentimentFilter] = useState<string>(() => {
        return localStorage.getItem("sentimentFilter") || "all";  // ✅ Load persisted filter
    });
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [sortOrder, setSortOrder] = useState<string>("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const [darkMode, setDarkMode] = useState<boolean>(() => {
        return localStorage.getItem("darkMode") === "true";
    });

    const articlesPerPage = 6;

    // Fetch articles based on sentiment filter
    useEffect(() => {
        localStorage.setItem("sentimentFilter", sentimentFilter);  // ✅ Persist filter selection
        
        if (sentimentFilter === "all") {
            fetchAllArticles().then((articles) => {
                setArticles(articles);
            });
        } else {
            fetchArticlesBySentiment(sentimentFilter).then(setArticles);
        }
    }, [sentimentFilter]);
    

    // Apply dark mode persistence
    useEffect(() => {
        localStorage.setItem("darkMode", String(darkMode));
        if (darkMode) {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }
    }, [darkMode]);

    // Handle search input
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    // Perform search
    const performSearch = async () => {
        if (searchQuery.trim() !== "") {
            const results = await searchArticles(searchQuery);
            setArticles(results);
            setCurrentPage(1);
        } else {
            sentimentFilter === "all"
                ? fetchAllArticles().then(setArticles)
                : fetchArticlesBySentiment(sentimentFilter).then(setArticles);
        }
    };

    // Toggle dark mode
    const toggleDarkMode = () => {
        setDarkMode((prevMode) => !prevMode);
    };

    // Sorting functionality
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
                onChange={(e) => setSentimentFilter(e.target.value)}
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
                onChange={(e) => setSortOrder(e.target.value)}
                className="sort-dropdown"
            >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
            </select>

            {/* News Grid */}
            <div className="grid">
                {currentArticles.length > 0 ? (
                    currentArticles.map((article) => (
                        <ArticleCard key={article._id} {...article} />
                    ))
                ) : (
                    <p style={{ textAlign: "center" }}>Loading...</p>
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