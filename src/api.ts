import axios from "axios";

// API base URL (adjust if Flask runs on another host)
const API_URL = "http://localhost:5001/sentiment";

// Fetch all articles
export const fetchAllArticles = async () => {
    const response = await axios.get(API_URL);
    return response.data.articles;
};

// Fetch articles by sentiment
export const fetchArticlesBySentiment = async (category: string) => {
    const response = await axios.get(`${API_URL}/${category}`);
    return response.data.articles;
};

// Search for articles
export const searchArticles = async (query: string) => {
    const response = await axios.get(`${API_URL}/search?query=${query}`);
    return response.data.articles;
};