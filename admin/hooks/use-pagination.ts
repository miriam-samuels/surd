"use client";

import { useMemo, useState } from "react";

/**
 * Page state plus the page-number list a pager needs.
 *
 * Works two ways:
 *
 *   Static  — pass `totalItems`; the hook slices the array for you via `range`.
 *   Dynamic — pass `totalItems` from the server response and ignore `range`;
 *             react to `page` / `pageSize` by refetching.
 */

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

export type PaginationState = {
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  /** Slice bounds for client-side paging: `items.slice(...range)`. */
  range: [number, number];
  /** Page numbers to render; -1 marks an ellipsis. */
  pageNumbers: number[];
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  next: () => void;
  previous: () => void;
  canPrevious: boolean;
  canNext: boolean;
};

export function usePagination({
  totalItems,
  initialPageSize = 20,
  siblings = 1,
}: {
  totalItems: number;
  initialPageSize?: number;
  /** Page numbers shown either side of the current page. */
  siblings?: number;
}): PaginationState {
  const [page, setPageState] = useState(1);
  const [pageSize, setPageSizeState] = useState(initialPageSize);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(page, totalPages);

  const setPage = (next: number) =>
    setPageState(Math.max(1, Math.min(next, totalPages)));

  /** Changing page size keeps the user near where they were: go back to one. */
  const setPageSize = (size: number) => {
    setPageSizeState(size);
    setPageState(1);
  };

  const pageNumbers = useMemo(
    () => buildPageNumbers(safePage, totalPages, siblings),
    [safePage, totalPages, siblings],
  );

  return {
    page: safePage,
    pageSize,
    totalPages,
    totalItems,
    range: [(safePage - 1) * pageSize, safePage * pageSize],
    pageNumbers,
    setPage,
    setPageSize,
    next: () => setPage(safePage + 1),
    previous: () => setPage(safePage - 1),
    canPrevious: safePage > 1,
    canNext: safePage < totalPages,
  };
}

/** `1 2 3 … 9 10` — collapses the middle once there are too many pages. */
export const PAGE_ELLIPSIS = -1;

function buildPageNumbers(
  page: number,
  totalPages: number,
  siblings: number,
): number[] {
  const maxVisible = siblings * 2 + 5;
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const left = Math.max(page - siblings, 1);
  const right = Math.min(page + siblings, totalPages);
  const showLeftGap = left > 3;
  const showRightGap = right < totalPages - 2;

  if (!showLeftGap && showRightGap) {
    const head = Array.from(
      { length: 3 + siblings * 2 },
      (_, index) => index + 1,
    );
    return [...head, PAGE_ELLIPSIS, totalPages - 1, totalPages];
  }

  if (showLeftGap && !showRightGap) {
    const tailLength = 3 + siblings * 2;
    const tail = Array.from(
      { length: tailLength },
      (_, index) => totalPages - tailLength + index + 1,
    );
    return [1, PAGE_ELLIPSIS, ...tail];
  }

  const middle = Array.from(
    { length: right - left + 1 },
    (_, index) => left + index,
  );
  return [1, PAGE_ELLIPSIS, ...middle, PAGE_ELLIPSIS, totalPages];
}
