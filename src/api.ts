const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  process.env.REACT_APP_BACKEND_URL ||
  "https://newsscraper-7csp.onrender.com";

const REQUEST_TIMEOUT_MS = 15000;

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
export interface Article {
  _id: string;
  headline: string;
  image: string | null;
  sentiment: 'positive' | 'negative' | 'neutral';
  summary: string;
  timestamp: string;
  url: string;
}

async function fetchJson<T>(url: string): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      cache: 'no-store',
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`API request failed with ${response.status}`);
    }
    return response.json();
  } finally {
    window.clearTimeout(timeout);
  }
}

export async function fetchArticles(params: PaginationParams = {}) {
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

  queryParams.append('_t', Date.now().toString());

  const url = `${API_BASE_URL}/articles?${queryParams.toString()}`;
  return fetchJson<ApiResponse>(url);
}

// Fetch article by ID
export async function fetchArticleById(articleId: string) {
  try {
    return await fetchJson<Article>(
      `${API_BASE_URL}/articles/${articleId}?_t=${Date.now()}`
    );
  } catch (error) {
    console.error("Error fetching article by ID:", error);
    return null;
  }
}
