"use client";

import { useMemo } from "react";
import {
  ArrowLeft02Icon,
  ArrowRight02Icon,
} from "@hugeicons/core-free-icons";
import { Dropdown } from "@/components/ui/dropdown";
import { Icon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import {
  PAGE_ELLIPSIS,
  PAGE_SIZE_OPTIONS,
  usePagination,
} from "@/hooks/use-pagination";
import { cn } from "@/lib/cn";

/**
 * The console's table.
 *
 * Columns are declared as data so a row is never hand-written twice:
 *
 *   const columns: Column<Rate>[] = [
 *     { id: "pair", header: "Currency Pair", cell: (rate) => <Pair {...rate} /> },
 *     { id: "value", header: "Value", cell: (rate) => rate.value, align: "right" },
 *   ];
 *
 *   <DataTable data={rates} columns={columns} getRowId={(rate) => rate.id} />
 *
 * ## Pagination
 *
 * **Static** (default) — hand it the whole array and it slices per page.
 *
 * **Dynamic** — pass `pagination={{ mode: "server", page, pageSize, totalItems,
 * onPageChange, onPageSizeChange }}` and render only the current page's rows.
 * The pager reports intent; fetching stays with the caller.
 *
 * Pass `pagination={false}` to render every row with no footer.
 */

export type Column<T> = {
  /** Stable key; also the React key for the cell. */
  id: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  align?: "left" | "right" | "center";
  /** Applied to both the header cell and every body cell in the column. */
  className?: string;
  /** e.g. "w-40" or "min-w-64" to stop a column collapsing. */
  width?: string;
};

export type ServerPagination = {
  mode: "server";
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
};

type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  getRowId: (row: T) => string;
  /** `false` disables paging; omit for client-side; object for server-side. */
  pagination?: false | ServerPagination;
  initialPageSize?: number;
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  /** Rendered in place of the table when there is nothing to show. */
  emptyState?: React.ReactNode;
  /** Minimum table width before the container scrolls horizontally. */
  minWidth?: string;
  className?: string;
};

const alignments = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
} as const;

export function DataTable<T>({
  data,
  columns,
  getRowId,
  pagination,
  initialPageSize = 20,
  onRowClick,
  isLoading = false,
  emptyState,
  minWidth = "min-w-3xl",
  className,
}: DataTableProps<T>) {
  const isServer = typeof pagination === "object";
  const isPaged = pagination !== false;

  const client = usePagination({
    totalItems: isServer ? 0 : data.length,
    initialPageSize,
  });

  /* Server mode already sends one page; client mode slices locally. */
  const rows = useMemo(() => {
    if (!isPaged || isServer) return data;
    return data.slice(client.range[0], client.range[1]);
  }, [data, isPaged, isServer, client.range]);

  if (isLoading) {
    return (
      <div className="grid place-items-center py-20">
        <Spinner size={28} className="text-primary" />
      </div>
    );
  }

  if (data.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Tables scroll inside their own container so the page never does. */}
      <div className="overflow-x-auto">
        <table className={cn("w-full border-collapse text-sm", minWidth)}>
          <thead>
            <tr className="border-b border-grey-50">
              {columns.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  className={cn(
                    "px-3 py-3 text-xs font-semibold whitespace-nowrap text-grey-400",
                    alignments[column.align ?? "left"],
                    column.width,
                    column.className,
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr
                key={getRowId(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(
                  "border-b border-grey-50 last:border-b-0",
                  onRowClick && "cursor-pointer transition-colors hover:bg-grey-25",
                )}
              >
                {columns.map((column) => (
                  <td
                    key={column.id}
                    className={cn(
                      "px-3 py-4 align-middle text-grey-900",
                      alignments[column.align ?? "left"],
                      column.className,
                    )}
                  >
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isPaged ? (
        <Pagination
          page={isServer ? pagination.page : client.page}
          pageSize={isServer ? pagination.pageSize : client.pageSize}
          totalItems={isServer ? pagination.totalItems : data.length}
          onPageChange={isServer ? pagination.onPageChange : client.setPage}
          onPageSizeChange={
            isServer ? pagination.onPageSizeChange : client.setPageSize
          }
        />
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------- pagination */

type PaginationProps = {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
};

export function Pagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const numbers = useMemo(
    () => buildPageNumbers(page, totalPages),
    [page, totalPages],
  );

  if (totalItems === 0) return null;

  return (
    <div className="flex flex-col items-center gap-4 pt-6 sm:flex-row sm:justify-center">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className={arrowClass}
      >
        <Icon icon={ArrowLeft02Icon} size={18} />
      </button>

      {onPageSizeChange ? (
        <div className="flex items-center gap-2 text-sm text-grey-500">
          <span>Showing</span>
          <Dropdown
            options={PAGE_SIZE_OPTIONS.map((size) => ({
              value: String(size),
              label: String(size),
            }))}
            value={String(pageSize)}
            onChange={(next) => onPageSizeChange(Number(next))}
            className="h-9 px-3"
          />
          <span className="font-semibold text-grey-900">per page</span>
        </div>
      ) : null}

      <ul className="flex items-center gap-2">
        {numbers.map((number, index) =>
          number === PAGE_ELLIPSIS ? (
            <li key={`gap-${index}`} className="px-1 text-grey-400">
              &hellip;
            </li>
          ) : (
            <li key={number}>
              <button
                type="button"
                onClick={() => onPageChange(number)}
                aria-current={number === page ? "page" : undefined}
                className={cn(
                  "grid size-9 place-items-center rounded-full text-sm font-semibold transition-colors",
                  number === page
                    ? "bg-primary text-white"
                    : "border border-grey-100 text-grey-900 hover:bg-grey-25",
                )}
              >
                {number}
              </button>
            </li>
          ),
        )}
      </ul>

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className={cn(arrowClass, "bg-surd-blue-50 text-primary")}
      >
        <Icon icon={ArrowRight02Icon} size={18} />
      </button>
    </div>
  );
}

const arrowClass = cn(
  "grid size-9 shrink-0 place-items-center rounded-full bg-grey-25 text-grey-500",
  "transition-colors hover:bg-grey-50 hover:text-grey-900",
  "disabled:pointer-events-none disabled:opacity-40",
);

/**
 * `1 2 3 … 9 10`. A plain function, not a hook — the pager is presentational
 * and derives this from props rather than owning page state.
 */
function buildPageNumbers(page: number, totalPages: number): number[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }
  if (page <= 4) {
    return [1, 2, 3, 4, 5, PAGE_ELLIPSIS, totalPages - 1, totalPages];
  }
  if (page >= totalPages - 3) {
    return [
      1,
      PAGE_ELLIPSIS,
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }
  return [1, PAGE_ELLIPSIS, page - 1, page, page + 1, PAGE_ELLIPSIS, totalPages];
}
