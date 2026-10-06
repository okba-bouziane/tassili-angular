/** A page number, or a gap between page numbers. */
export type PaginationItem = number | 'ellipsis';

/**
 * Page numbers to show, with gaps collapsed: always the first and last page,
 * the current page and `siblings` pages on each side of it.
 *
 * paginationRange(5, 10)  →  [1, 'ellipsis', 4, 5, 6, 'ellipsis', 10]
 */
export function paginationRange(current: number, total: number, siblings = 1): PaginationItem[] {
  if (total <= 0) return [];
  const page = Math.min(Math.max(current, 1), total);
  // first + last + current + 2 * siblings + 2 ellipses
  const slots = siblings * 2 + 5;
  if (total <= slots) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const start = Math.max(page - siblings, 2);
  const end = Math.min(page + siblings, total - 1);
  const showStartGap = start > 3;
  const showEndGap = end < total - 2;

  if (!showStartGap) {
    const head = Array.from({ length: siblings * 2 + 3 }, (_, index) => index + 1);
    return [...head, 'ellipsis', total];
  }
  if (!showEndGap) {
    const tail = Array.from(
      { length: siblings * 2 + 3 },
      (_, index) => total - siblings * 2 - 2 + index,
    );
    return [1, 'ellipsis', ...tail];
  }
  const middle = Array.from({ length: end - start + 1 }, (_, index) => start + index);
  return [1, 'ellipsis', ...middle, 'ellipsis', total];
}
