const {
  PAGE_SIZE,
  buildArticlesQuery,
  getCollection,
  serializeArticle,
} = require('./_mongo');
const { discoverAndStoreArticles } = require('./_liveNews');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const collection = await getCollection();
    const offset = Math.max(0, Number(req.query.offset || 0) || 0);
    const sortOrder = req.query.sort === 'asc' ? 1 : -1;
    const keyword = String(req.query.keyword || '').trim().slice(0, 80);
    const query = buildArticlesQuery({ ...req.query, keyword });

    let total = await collection.countDocuments(query);
    if (keyword.length >= 2 && total === 0) {
      try {
        await discoverAndStoreArticles(collection, keyword);
        total = await collection.countDocuments(query);
      } catch (discoveryError) {
        console.error('Live news discovery failed', discoveryError);
      }
    }

    const articles = await collection
      .find(query)
      .sort({ timestamp: sortOrder })
      .skip(offset)
      .limit(PAGE_SIZE)
      .toArray();

    return res.status(200).json({
      articles: articles.map(serializeArticle),
      pagination: {
        total,
        offset,
        page_size: PAGE_SIZE,
        has_more: offset + PAGE_SIZE < total,
      },
    });
  } catch (error) {
    console.error('Failed to fetch articles', error);
    return res.status(500).json({ error: 'Failed to fetch articles' });
  }
};
