import axios from "axios";

const API_URL = "http://localhost:5000"; // Ensure this matches your backend URL

// Fetch all articles
export const fetchAllArticles = async () => {
    const response = await axios.get(`${API_URL}/articles`);
    return response.data;
};

// Fetch articles by sentiment
export const fetchArticlesBySentiment = async (category: string) => {
    const response = await axios.get(`${API_URL}/articles/sentiment/${category}`);
    return response.data;
};

// Search articles
export const searchArticles = async (query: string) => {
    const response = await axios.get(`${API_URL}/articles/search?query=${query}`);
    return response.data;
};

// Fetch a single article by ID
export const fetchArticleById = async (articleId: string) => {
    const response = await axios.get(`${API_URL}/articles/${articleId}`);
    return response.data;
};