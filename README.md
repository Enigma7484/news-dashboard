# news-dashboard

React frontend for NewsScraper.

## Local development

```bash
npm install
REACT_APP_API_BASE_URL=http://127.0.0.1:5001 npm start
```

If `REACT_APP_API_BASE_URL` is not set, the app uses the deployed backend URL.

Article cards and detail pages display an article-framing meter from left through
centrist to right. The meter consumes the NewsScraper API's `bias`, `bias_score`,
`bias_confidence`, and `bias_signals` fields and shows pending when a full-article
analysis is not yet available.
