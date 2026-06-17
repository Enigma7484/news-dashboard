const { MongoClient, ObjectId } = require('mongodb');

const PAGE_SIZE = 15;
const DEFAULT_RECENT_DAYS = Number(process.env.DEFAULT_RECENT_DAYS || 2);

let clientPromise;

function getClient() {
  if (!process.env.MONGO_URL) {
    throw new Error('MONGO_URL is required');
  }

  if (!clientPromise) {
    const client = new MongoClient(process.env.MONGO_URL);
    clientPromise = client.connect();
  }

  return clientPromise;
}

async function getCollection() {
  const client = await getClient();
  const dbName = process.env.DB_NAME || 'news_scraper';
  const collectionName = process.env.COLLECTION_NAME || 'articles';
  return client.db(dbName).collection(collectionName);
}

function qualityQuery() {
  return {
    $and: [
      {
        headline: {
          $not: /(crossword|sudoku|sudoblock|strands|wordle|work for us|sign up|terms\s*&\s*conditions)/i,
        },
      },
      {
        summary: {
          $not: /(work for us|sign up for our email|privacy policy|terms\s*&\s*conditions)/i,
        },
      },
      {
        url: {
          $not: /\/(games|play|crossword|puzzle|careers|jobs)\//i,
        },
      },
    ],
  };
}

function buildArticlesQuery(queryParams = {}) {
  const query = qualityQuery();
  const category = String(queryParams.category || '').toLowerCase();
  const keyword = String(queryParams.keyword || '').trim();
  const allTime = ['1', 'true', 'yes'].includes(
    String(queryParams.all_time || '').toLowerCase()
  );

  if (['positive', 'negative', 'neutral'].includes(category)) {
    query.sentiment = category;
  }

  if (keyword) {
    query.$or = [
      { headline: { $regex: keyword, $options: 'i' } },
      { summary: { $regex: keyword, $options: 'i' } },
    ];
  }

  if (!allTime) {
    const recentDays = Math.max(
      1,
      Number(queryParams.recent_days || DEFAULT_RECENT_DAYS) || DEFAULT_RECENT_DAYS
    );
    query.timestamp = {
      $gte: new Date(Date.now() - recentDays * 24 * 60 * 60 * 1000),
    };
  }

  return query;
}

function serializeArticle(article) {
  return {
    ...article,
    _id: article._id.toString(),
  };
}

module.exports = {
  ObjectId,
  PAGE_SIZE,
  buildArticlesQuery,
  getCollection,
  serializeArticle,
};
