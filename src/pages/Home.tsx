import React, { useEffect, useState } from "react";
import { fetchArticles } from "../api";
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

// Define pagination type
interface Pagination {
    total: number;
    offset: number;
    page_size: number;
    has_more: boolean;
}

const Home: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        total: 0,
        offset: 0,
        page_size: 10,
        has_more: false
    });
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [sortOrder, setSortOrder] = useState<string>("desc");
    const [darkMode, setDarkMode] = useState<boolean>(() => {
        return localStorage.getItem("darkMode") === "true";
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Fetch articles with pagination and sorting
    const loadArticles = async (offset = 0, keyword = "", sort = sortOrder) => {
        setIsLoading(true);
        try {
            const response = await fetchArticles({
                offset,
                keyword,
                sort: sort as 'asc' | 'desc'
            });
            setArticles(response.articles as Article[]);
            setPagination(response.pagination);
        } catch (error) {
            console.error("Error loading articles:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        loadArticles();
    }, []);

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
        loadArticles(0, searchQuery.trim());
    };

    // Handle sort change
    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSortOrder = e.target.value;
        setSortOrder(newSortOrder);
        loadArticles(pagination.offset, searchQuery, newSortOrder);
    };

    // Toggle dark mode
    const toggleDarkMode = () => {
        setDarkMode((prevMode) => !prevMode);
    };

    // Pagination handlers
    const nextPage = () => {
        if (pagination.has_more) {
            const newOffset = pagination.offset + pagination.page_size;
            loadArticles(newOffset, searchQuery, sortOrder);
        }
    };

    const prevPage = () => {
        if (pagination.offset > 0) {
            const newOffset = Math.max(0, pagination.offset - pagination.page_size);
            loadArticles(newOffset, searchQuery, sortOrder);
        }
    };

    // Calculate current page number
    const currentPage = Math.floor(pagination.offset / pagination.page_size) + 1;
    const totalPages = Math.ceil(pagination.total / pagination.page_size);

    return (
        <div className={`container ${darkMode ? "dark" : ""}`}>
            <div className="header-container">
                <h2>Latest News</h2>
                {/* Dark Mode Toggle */}
                <button onClick={toggleDarkMode} className="dark-mode-toggle">
                    {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
                </button>
            </div>

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

            {/* Sorting Options */}
            <select
                value={sortOrder}
                onChange={handleSortChange}
                className="sort-dropdown"
            >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
            </select>

            {/* News Grid */}
            <div className="grid">
                {isLoading ? (
                    <p style={{ textAlign: "center" }}>Loading...</p>
                ) : articles.length > 0 ? (
                    articles.map((article) => (
                        <ArticleCard key={article._id} {...article} />
                    ))
                ) : (
                    <p style={{ textAlign: "center" }}>No articles found</p>
                )}
            </div>

            {/* Pagination Buttons */}
            <div className="pagination">
                <button onClick={prevPage} disabled={pagination.offset === 0}>
                    ◀ Previous
                </button>
                <span>
                    Page {currentPage} of {totalPages || 1}
                </span>
                <button onClick={nextPage} disabled={!pagination.has_more}>
                    Next ▶
                </button>
            </div>
        </div>
    );
};

export default Home;