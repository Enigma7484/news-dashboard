// Define the base API URL (update if your backend runs on a different port)
const API_BASE_URL = "https://newsscraper-7csp.onrender.com";

// Define pagination page size to match backend
const PAGE_SIZE = 15; // This should match the PAGE_SIZE in the backend

// Interface for pagination parameters
interface PaginationParams {
  offset?: number;
  sort?: 'asc' | 'desc';
  keyword?: string;
  category?: 'positive' | 'negative' | 'neutral' | '';
}

// Interface for API response
interface ApiResponse {
  articles: Article[];
  pagination: {
    total: number;
    offset: number;
    page_size: number;
    has_more: boolean;
  };
}

// Article interface
interface Article {
  _id: string;
  headline: string;
  image: string | null;
  sentiment: string;
  summary: string;
  timestamp: string;
  url: string;
}

export async function fetchArticles(params: PaginationParams = {}) {
  try {
    // Build query string from parameters
    const queryParams = new URLSearchParams();
    
    if (params.offset !== undefined) {
      queryParams.append('offset', params.offset.toString());
    }
    
    if (params.sort) {
      queryParams.append('sort', params.sort);
    }
    
    if (params.keyword) {
      queryParams.append('keyword', params.keyword);
    }

    if (params.category) {
      queryParams.append('category', params.category);
    }
    
    // Make the API request with query parameters
    const url = `${API_BASE_URL}/articles${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error("Failed to fetch articles");
    }
    
    const data: ApiResponse = await response.json();
    console.log("Fetched Articles:", data); // Debugging
    return data;
  } catch (error) {
    console.error("Error fetching articles:", error);
    return {
      articles: [],
      pagination: {
        total: 0,
        offset: params.offset || 0,
        page_size: PAGE_SIZE,
        has_more: false
      }
    };
  }
}

// Fetch article by ID
export async function fetchArticleById(articleId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/articles/${articleId}`);
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
