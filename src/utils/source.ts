export interface ArticleSource {
  name: string;
  host: string;
  logoUrl: string;
}

const SOURCE_NAMES: Record<string, string> = {
  'bbc.com': 'BBC',
  'cnn.com': 'CNN',
  'theguardian.com': 'The Guardian',
  'nytimes.com': 'NYT',
  'aljazeera.com': 'Al Jazeera',
  'cbc.ca': 'CBC',
  'bleacherreport.com': 'Bleacher Report',
};

function rootDomain(hostname: string) {
  return hostname.replace(/^www\./, '').split('.').slice(-2).join('.');
}

export function getArticleSource(url: string): ArticleSource {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');
    const root = rootDomain(host);
    return {
      name: SOURCE_NAMES[host] || SOURCE_NAMES[root] || host,
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
