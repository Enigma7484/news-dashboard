import { ARTICLE_SOURCE_OPTIONS, normalizeSourceFilter } from './source';

describe('source filters', () => {
  it('keeps supported publisher hostnames', () => {
    expect(normalizeSourceFilter('foxnews.com')).toBe('foxnews.com');
    expect(normalizeSourceFilter('bbc.com')).toBe('bbc.com');
  });

  it('rejects unsupported or malformed values', () => {
    expect(normalizeSourceFilter('example.com')).toBe('');
    expect(normalizeSourceFilter(null)).toBe('');
  });

  it('offers every primary scraper source', () => {
    expect(ARTICLE_SOURCE_OPTIONS.map((source) => source.label)).toEqual([
      'BBC',
      'CBC',
      'CNN',
      'Fox News',
      'The Guardian',
      'Al Jazeera',
      'NYT',
    ]);
  });
});
