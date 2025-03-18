export default function handler(req, res) {
    fetch('https://newsscraper-7csp.onrender.com/articles?offset=0&sort=desc');

    res.status(200).json({ message: 'OK!' });
  }
