export function linkifyKeywords(
  summary: string,
  dynamicKeywords: string[] = []
): string {
  if (!summary) return "";

  // escape any raw HTML
  let safe = summary.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // merge + dedupe + longest-first
  const all = Array.from(new Set(dynamicKeywords))
    .sort((a, b) => b.length - a.length)
    .map(k => k.trim())
    .filter(k => k.length > 1);

  if (all.length === 0) return safe;

  const escaped = all.map(k => k.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"));
  const re = new RegExp(`\\b(${escaped.join("|")})\\b`, "gi");

  return safe.replace(re, match => {
    const title = match.replace(/\s+/g, "_");
    const href  = `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`;
    return `<a href="${href}" target="_blank" rel="noopener noreferrer"><strong>${match}</strong></a>`;
  });
}