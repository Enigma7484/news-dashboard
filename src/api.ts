const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || '').replace(/\/$/, '');
const ARTICLES_ENDPOINT = API_BASE_URL
  ? `${API_BASE_URL}/articles`
  : '/api/articles';

const REQUEST_TIMEOUT_MS = 15000;

// Interface for pagination parameters
interface PaginationParams {
  offset?: number;
  sort?: 'asc' | 'desc';
  keyword?: string;
  category?: 'positive' | 'negative' | 'neutral' | '';
  bias?: 'left' | 'centrist' | 'right' | '';
  source?: string;
  allTime?: boolean;
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
  entities?: string[];
  headline: string;
  image: string | null;
  sentiment: 'positive' | 'negative' | 'neutral';
  summary: string;
  timestamp: string;
  url: string;
  bias?: 'left' | 'centrist' | 'right' | null;
  bias_score?: number | null;
  bias_confidence?: number | null;
  bias_method?: string | null;
  bias_rationale?: string | null;
  bias_is_political?: boolean | null;
  bias_signals?: Array<{
    phrase: string;
    lean: 'left' | 'centrist' | 'right';
  }>;
  source_name?: string;
  source_url?: string;
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

  if (params.bias) {
    queryParams.append('bias', params.bias);
  }

  if (params.source) {
    queryParams.append('source', params.source);
  }

  if (params.allTime) {
    queryParams.append('all_time', '1');
  }

  queryParams.append('_t', Date.now().toString());

  const url = `${ARTICLES_ENDPOINT}?${queryParams.toString()}`;
  return fetchJson<ApiResponse>(url);
}

// Fetch article by ID
export async function fetchArticleById(articleId: string) {
  try {
    return await fetchJson<Article>(
      `${ARTICLES_ENDPOINT}/${articleId}?_t=${Date.now()}`
    );
  } catch (error) {
    console.error("Error fetching article by ID:", error);
    return null;
  }
}
