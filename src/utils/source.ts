export interface ArticleSource {
  name: string;
  host: string;
  logoUrl: string;
}

export const ARTICLE_SOURCE_OPTIONS = [
  { value: 'bbc.com', label: 'BBC' },
  { value: 'cbc.ca', label: 'CBC' },
  { value: 'cnn.com', label: 'CNN' },
  { value: 'foxnews.com', label: 'Fox News' },
  { value: 'theguardian.com', label: 'The Guardian' },
  { value: 'aljazeera.com', label: 'Al Jazeera' },
  { value: 'nytimes.com', label: 'NYT' },
] as const;

export type SourceFilter = '' | (typeof ARTICLE_SOURCE_OPTIONS)[number]['value'];

export function normalizeSourceFilter(value: unknown): SourceFilter {
  return ARTICLE_SOURCE_OPTIONS.some((source) => source.value === value)
    ? value as SourceFilter
    : '';
}

const SOURCE_NAMES: Record<string, string> = {
  'bbc.com': 'BBC',
  'cnn.com': 'CNN',
  'theguardian.com': 'The Guardian',
  'nytimes.com': 'NYT',
  'aljazeera.com': 'Al Jazeera',
  'cbc.ca': 'CBC',
  'foxnews.com': 'Fox News',
  'bleacherreport.com': 'Bleacher Report',
};

function rootDomain(hostname: string) {
  return hostname.replace(/^www\./, '').split('.').slice(-2).join('.');
}

export function getArticleSource(
  url: string,
  sourceName?: string,
  sourceUrl?: string
): ArticleSource {
  try {
    const parsed = new URL(sourceUrl || url);
    const host = parsed.hostname.replace(/^www\./, '');
    const root = rootDomain(host);
    return {
      name: sourceName || SOURCE_NAMES[host] || SOURCE_NAMES[root] || host,
      host,
      logoUrl: `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64`,
    };
  } catch {
    return {
      name: 'Source',
      host: '',
      logoUrl: '',
    };
  }
}
