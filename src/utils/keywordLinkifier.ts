// src/utils/keywordLinkifier.ts

export function linkifyKeywords(
  summary: string,
  dynamicKeywords: string[] = []
): string {
  if (!summary) return "";

  // 1) Capitalize first character of the summary if it isn't already
  let safe = summary.charAt(0).toUpperCase() + summary.slice(1);

  // 2) Escape any raw HTML
  safe = safe.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // 3) A small stopword list to filter out things like "in", "one", "first", etc.
  const stopwords = new Set([
    "in", "on", "at", "from", "via", "for", "one", "first", "this", "that",
    "been", "summer", "three", "day", "days", "about", "over", "more", "than",
    // months (to avoid "March", "April" etc. being highlighted as dates)
    "january","february","march","april","may","june","july","august",
    "september","october","november","december",
  ]);

  // 4) Build a cleaned, deduped, longest-first list of keywords
  const keywords = Array.from(new Set(dynamicKeywords.map(k => k.trim())))
    .filter(k => {
      const lower = k.toLowerCase();
      // drop stopwords
      if (stopwords.has(lower)) return false;
      // drop pure numbers or number-heavy phrases
      if (/\d/.test(k)) return false;
      // allow single uppercase letters like "V" (but NOT just "A" or "I")
      if (k.length === 1) return /^[B-Z]$/.test(k);
      // everything else is okay
      return k.length > 1;
    })
    .sort((a, b) => b.length - a.length);

  if (keywords.length === 0) return safe;

  // 5) Escape regex metachars, but build a U\.K\.?-style pattern for true acronyms
  const parts = keywords.map(k => {
    const esc = (s: string) => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
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
    const title = match.replace(/\./g, "").replace(/\s+/g, "_");
    const href = `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`;
    return `<a href="${href}" target="_blank" rel="noopener noreferrer"><strong>${match}</strong></a>`;
  });
}