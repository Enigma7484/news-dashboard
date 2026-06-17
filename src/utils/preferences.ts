export type SentimentFilter = '' | 'positive' | 'neutral' | 'negative';
export type SortOrder = 'asc' | 'desc';
export type ViewMode = 'grid' | 'compact' | 'spotlight';
export type ThemeMode = 'dark' | 'light' | 'system';
export type Density = 'comfortable' | 'compact';

export interface Preferences {
  sentiment: SentimentFilter;
  sort: SortOrder;
  view: ViewMode;
  theme: ThemeMode;
  density: Density;
  showImages: boolean;
  highlightEntities: boolean;
}

const STORAGE_KEY = 'newsNowPreferences';

export const defaultPreferences: Preferences = {
  sentiment: '',
  sort: 'desc',
  view: 'grid',
  theme: 'dark',
  density: 'comfortable',
  showImages: true,
  highlightEntities: true,
};

function normalizeSentiment(value: unknown): SentimentFilter {
  return value === 'positive' || value === 'neutral' || value === 'negative'
    ? value
    : '';
}

function readLegacyPreferences(): Partial<Preferences> {
  return {
    sentiment: normalizeSentiment(
      localStorage.getItem('defaultSentiment') === 'all'
        ? ''
        : localStorage.getItem('defaultSentiment')
    ),
    sort: localStorage.getItem('defaultSort') === 'asc' ? 'asc' : 'desc',
    theme: localStorage.getItem('darkMode') === 'false' ? 'light' : 'dark',
  };
}

export function getPreferences(): Preferences {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : {};
    return {
      ...defaultPreferences,
      ...readLegacyPreferences(),
      ...parsed,
      sentiment: normalizeSentiment(parsed.sentiment ?? readLegacyPreferences().sentiment),
      sort: parsed.sort === 'asc' ? 'asc' : 'desc',
      view: ['grid', 'compact', 'spotlight'].includes(parsed.view)
        ? parsed.view
        : defaultPreferences.view,
      theme: ['dark', 'light', 'system'].includes(parsed.theme)
        ? parsed.theme
        : defaultPreferences.theme,
      density: parsed.density === 'compact' ? 'compact' : 'comfortable',
      showImages: parsed.showImages !== false,
      highlightEntities: parsed.highlightEntities !== false,
    };
  } catch {
    return defaultPreferences;
  }
}

export function savePreferences(next: Preferences) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  localStorage.setItem('defaultSentiment', next.sentiment || 'all');
  localStorage.setItem('defaultSort', next.sort);
  localStorage.setItem('darkMode', String(next.theme !== 'light'));
}

export function applyTheme(theme: ThemeMode) {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const shouldUseDark = theme === 'dark' || (theme === 'system' && prefersDark);
  document.documentElement.classList.toggle('dark', shouldUseDark);
}
