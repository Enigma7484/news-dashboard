export function cleanDisplaySummary(summary: string, headline = ''): string {
  const cleaned = (summary || '')
    .replace(/\bsave\s+share\b/gi, ' ')
    .replace(/\bthis video can\s*not be played\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,!?;:])/g, '$1')
    .trim();

  if (!cleaned) return headline;

  const withoutDanglingInitial = cleaned.replace(/(?:,\s*)?\b[A-Z]\.$/, '').trim();
  if (!withoutDanglingInitial) return headline;

  if (!/[.!?]$/.test(withoutDanglingInitial) && withoutDanglingInitial.length < 120) {
    return headline;
  }

  return withoutDanglingInitial;
}
