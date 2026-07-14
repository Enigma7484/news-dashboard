const { XMLParser } = require('fast-xml-parser');

const MAX_DISCOVERED_ARTICLES = 15;
const REQUEST_TIMEOUT_MS = 8000;

function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function stripSourceSuffix(title, sourceName) {
  const suffix = sourceName ? ` - ${sourceName}` : '';
  return suffix && title.endsWith(suffix) ? title.slice(0, -suffix.length) : title;
}

async function discoverAndStoreArticles(collection, keyword) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const feedUrl = new URL('https://news.google.com/rss/search');
  feedUrl.search = new URLSearchParams({
    q: keyword,
    hl: 'en-CA',
    gl: 'CA',
    ceid: 'CA:en',
  }).toString();

  try {
    const response = await fetch(feedUrl, {
      headers: { 'User-Agent': 'NewsNow/1.0' },
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`News discovery returned ${response.status}`);
    }

    const xml = await response.text();
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '' });
    const items = asArray(parser.parse(xml)?.rss?.channel?.item);
    const documents = items.slice(0, MAX_DISCOVERED_ARTICLES).map((item) => {
      const sourceName = String(item.source?.['#text'] || item.source || 'News source');
      const sourceUrl = String(item.source?.url || '');
      const headline = stripSourceSuffix(String(item.title || '').trim(), sourceName);
      const timestamp = new Date(item.pubDate || Date.now());

      return {
        headline,
        url: String(item.link || '').trim(),
        sentiment: 'neutral',
        sentiment_method: 'live_news_discovery',
        sentiment_score: null,
        summary: `${sourceName} reports on this story. Open the original coverage for full details.`,
        image: null,
        timestamp: Number.isNaN(timestamp.getTime()) ? new Date() : timestamp,
        entities: [keyword],
        source_name: sourceName,
        source_url: sourceUrl,
        discovery_query: keyword,
        discovered_at: new Date(),
      };
    }).filter((article) => article.headline && article.url);

    if (documents.length) {
      await collection.bulkWrite(
        documents.map((document) => ({
          updateOne: {
            filter: { url: document.url },
            update: { $set: document },
            upsert: true,
          },
        })),
        { ordered: false }
      );
    }

    return documents.length;
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = { discoverAndStoreArticles };
