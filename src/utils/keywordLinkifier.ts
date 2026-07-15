// src/utils/keywordLinkifier.ts

export function linkifyKeywords(
  summary: string,
  dynamicKeywords: string[] = [],
  enabled = true
): string {
  if (!summary) return "";
  if (!enabled) {
    return summary.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // 1) Capitalize first character of the summary if it isn't already
  let safe = summary.charAt(0).toUpperCase() + summary.slice(1);

  // 2) Escape any raw HTML
  safe = safe.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const keywords = getLookupKeywords(dynamicKeywords);

  if (keywords.length === 0) return safe;

  // 5) Escape regex metachars, but build a U\.K\.?-style pattern for true acronyms
  const parts = keywords.map(k => {
    const esc = (s: string) => s.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    if (/^[A-Z]+$/.test(k)) {
      // for "UK" → matches "U.K.", "U.K", or "UK"
      return k
        .split("")
        .map(letter => esc(letter) + "\\.?")
        .join("");
    }
    // literal match otherwise
    return esc(k);
  });

  // 6) Use lookarounds instead of \b so we only match whole tokens
  const re = new RegExp(`(?<![\\w.])(${parts.join("|")})(?![\\w.])`, "gi");

  // 7) Replace each hit with a Wikipedia link + <strong>
  return safe.replace(re, match => {
    const label = stripTrailingPunctuation(match);
    const punctuation = match.slice(label.length);
    const title = label.replace(/\./g, "").replace(/\s+/g, " ").trim();
    const href = `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(title)}`;
    return `<a class="entity-link" href="${href}" target="_blank" rel="noopener noreferrer" title="Search Wikipedia for ${escapeAttribute(title)}"><strong>${label}</strong></a>${punctuation}`;
  });
}

export function getLookupKeywords(dynamicKeywords: string[] = []): string[] {
  const stopwords = new Set([
    "in", "on", "at", "from", "via", "for", "one", "first", "this", "that",
    "been", "summer", "three", "day", "days", "about", "over", "more", "than",
    "the", "new", "old", "said", "says", "say", "will", "would", "could",
    "should", "today", "tomorrow", "yesterday", "tuesday", "monday",
    "wednesday", "thursday", "friday", "saturday", "sunday",
    "now", "after", "before", "designed", "language", "government",
    "minister", "ceo", "liberal", "conservative", "conservatives",
    "with", "without", "under", "former", "consider", "advocates",
    "missing", "girls", "indigenous",
    // months (to avoid "March", "April" etc. being highlighted as dates)
    "january","february","march","april","may","june","july","august",
    "september","october","november","december",
  ]);

  const weekdays = new Set([
    "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday",
  ]);

  const keywords = Array.from(new Set(dynamicKeywords.map(k => normalizeKeyword(k))))
    .filter(k => {
      const lower = k.toLowerCase();
      if (stopwords.has(lower)) return false;
      if (/\bsave\s+share\b/.test(lower)) return false;
      if (/\bthis video can\s*not be played\b/.test(lower)) return false;
      if (/\d/.test(k)) return false;
      if (/^m{0,4}(?:cm|cd|d?c{0,3})(?:xc|xl|l?x{0,3})(?:ix|iv|v?i{0,3})$/i.test(k)) return false;
      const tokens = lower.split(/\s+/);
      if (tokens.length <= 2 && tokens.some(token => weekdays.has(token))) return false;
      if (tokens.every(token => stopwords.has(token))) return false;
      if (k.length === 1) return false;
      if (isAcronym(k)) return k.replace(/[^A-Z]/g, '').length >= 2;
      return /\b[A-Z][a-z][\w'-]*\b/.test(k) && k.length > 2;
    });

  const keywordKeys = new Set(keywords.map(keyword => keyword.toLowerCase()));

  return keywords
    .filter(keyword => {
      const tokens = keyword.toLowerCase().split(/\s+/);
      return tokens.length === 1 || !tokens.every(token => keywordKeys.has(token));
    })
    .sort((a, b) => b.length - a.length);
}

function normalizeKeyword(keyword: string): string {
  return stripTrailingPunctuation(keyword)
    .replace(/^[^\w]+|[^\w.)]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function stripTrailingPunctuation(value: string): string {
  return value.replace(/[,\s;:]+$/g, "");
}

function isAcronym(value: string): boolean {
  return /^(?:[A-Z]\.?){2,}$/.test(value.replace(/\s+/g, ""));
}

function escapeAttribute(value: string): string {
  return value.replace(/"/g, "&quot;");
}
