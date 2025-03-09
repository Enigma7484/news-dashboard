// Define the base API URL (update if your backend runs on a different port)
const API_BASE_URL = "http://127.0.0.1:5001"; // Make sure this is correct

export async function fetchAllArticles() {
    try {
        const response = await fetch(`${API_BASE_URL}/sentiment`);
        if (!response.ok) {
            throw new Error("Failed to fetch articles");
        }
        const data = await response.json();
        console.log("Fetched Articles:", data); // Debugging
        return data.articles;
    } catch (error) {
        console.error("Error fetching all articles:", error);
        return [];
    }
}

// Fetch articles by sentiment (positive, neutral, negative)
export const fetchArticlesBySentiment = async (sentiment: string) => {
    try {
        const response = await fetch(`http://127.0.0.1:5001/sentiment/${sentiment}`);
        if (!response.ok) throw new Error("Failed to fetch articles");
        const data = await response.json();
        return data.articles; // Ensure articles are returned
    } catch (error) {
        console.error("Error fetching articles by sentiment:", error);
        return [];
    }
};


// Search articles by keyword
export const searchArticles = async (query: string) => {
    try {
        const response = await fetch(`http://127.0.0.1:5001/sentiment/search?query=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error("Failed to fetch search results");
        const data = await response.json();
        return data.articles; // Ensure articles are returned
    } catch (error) {
        console.error("Error fetching search results:", error);
        return [];
    }
};

export async function fetchArticleById(articleId: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/sentiment/${articleId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch article details");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching article by ID:", error);
        return null;
    }
}