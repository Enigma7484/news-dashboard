const {
  PAGE_SIZE,
  buildArticlesQuery,
  getCollection,
  serializeArticle,
} = require('./_mongo');

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
    const query = buildArticlesQuery(req.query);

    const [articles, total] = await Promise.all([
      collection
        .find(query)
        .sort({ timestamp: sortOrder })
        .skip(offset)
        .limit(PAGE_SIZE)
        .toArray(),
      collection.countDocuments(query),
    ]);

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
