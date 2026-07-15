export function clampPage(page: number, totalPages: number) {
  const safeTotal = Math.max(1, Math.floor(totalPages) || 1);
  const safePage = Number.isFinite(page) ? Math.floor(page) : 1;
  return Math.min(safeTotal, Math.max(1, safePage));
}

export function pageOffset(page: number, pageSize: number, totalPages: number) {
  return (clampPage(page, totalPages) - 1) * Math.max(1, pageSize);
}
