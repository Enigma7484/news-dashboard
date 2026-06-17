const { ObjectId, getCollection, serializeArticle } = require('../_mongo');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    if (!ObjectId.isValid(req.query.id)) {
      return res.status(400).json({ error: 'Invalid article id' });
    }

    const collection = await getCollection();
    const article = await collection.findOne({ _id: new ObjectId(req.query.id) });

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    return res.status(200).json(serializeArticle(article));
  } catch (error) {
    console.error('Failed to fetch article', error);
    return res.status(500).json({ error: 'Failed to fetch article' });
  }
};
