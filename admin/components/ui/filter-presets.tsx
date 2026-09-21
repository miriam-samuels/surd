"use client";

import type { FilterGroup, FilterOption } from "@/components/ui/table-controls";

/**
 * The filter groups more than one table needs, in one place.
 *
 * Treasury, Transactions and Users were each carrying their own copy of the
 * money ladder, the date windows and the custom-range picker — three sets of
 * bounds that had to agree and no reason they would. A band labelled the same
 * on two screens now *is* the same band.
 */

/* ── Money bands ──────────────────────────────────────────────────────── */

/**
 * The design's ladder, and the only one the API is given.
 *
 * The labels are literal naira. They do not follow the platform currency
 * toggle, so on a USD table the band reads in the wrong unit while the bound it
 * sends is a raw number compared in whatever currency the query names. A
 * per-currency ladder is a product decision — thresholds for dollars are not
 * the naira ones converted — and until it exists, one ladder across every table
 * is at least consistently wrong rather than differently wrong per screen.
 */
export const AMOUNT_OPTIONS: FilterOption[] = [
  { value: "", label: "All" },
  { value: "0-100000", label: "Below ₦100K" },
  { value: "100000-1000000", label: "₦100K – ₦1M" },
  { value: "1000000-10000000", label: "₦1M – ₦10M" },
  { value: "10000000-", label: "Above ₦10M" },
];

/**
 * Bounds are half-open (`>= min`, `< max`), so adjacent bands never
 * double-count and the four sum exactly to the unfiltered total.
 */
function band(value?: string) {
  if (!value) return null;
  const [min, max] = value.split("-");
  return {
    min: min ? Number(min) : undefined,
    max: max ? Number(max) : undefined,
  };
}

/** `min_amount` / `max_amount` — the transaction ledger's field names. */
export function amountBounds(value?: string) {
  const bounds = band(value);
  if (!bounds) return {};
  return { min_amount: bounds.min, max_amount: bounds.max };
}

/**
 * `min_balance` / `max_balance` — the user list's field names for the same
 * ladder. Everything an account holds is converted into `balance_currency`
 * before comparing, so a USD-only account is not mis-bucketed as empty when
 * filtering in naira.
 */
export function balanceBounds(value?: string) {
  const bounds = band(value);
  if (!bounds) return {};
  return { min_balance: bounds.min, max_balance: bounds.max };
}

/* ── Date windows ─────────────────────────────────────────────────────── */

export type CustomRange = { from: string; to: string };

export const EMPTY_RANGE: CustomRange = { from: "", to: "" };

const WINDOWS: FilterOption[] = [
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
  { value: "year", label: "This year" },
];

/** For a table whose period is already set elsewhere, like the ledger header. */
export const DATE_WINDOW_OPTIONS = WINDOWS;

export const DATE_OPTIONS: FilterOption[] = [
  ...WINDOWS,
  { value: "custom", label: "Custom date range" },
];

/**
 * The window the admin picked, as a half-open pair of instants.
 *
 * `custom` returns nothing on its own — the two dates the admin types are what
 * bound it, and until both are set the table stays unfiltered rather than
 * silently bounded by half a range.
 */
function windowBounds(value?: string, custom?: CustomRange) {
  if (!value) return {};

  if (value === "custom") {
    if (!custom?.from || !custom?.to) return {};
    return {
      start: new Date(`${custom.from}T00:00:00`).toISOString(),
      end: new Date(`${custom.to}T23:59:59`).toISOString(),
    };
  }

  const start = new Date();
  start.setHours(0, 0, 0, 0);

  if (value === "week") start.setDate(start.getDate() - start.getDay());
  if (value === "month") start.setDate(1);
  if (value === "year") {
    start.setMonth(0);
    start.setDate(1);
  }

  return { start: start.toISOString() };
}

/** `start_date` / `end_date` — what the transaction and capital ledgers take. */
export function dateBounds(value?: string, custom?: CustomRange) {
  const { start, end } = windowBounds(value, custom);
  return {
    ...(start ? { start_date: start } : {}),
    ...(end ? { end_date: end } : {}),
  };
}

/** `joined_after` / `joined_before` — the same windows on the user list. */
export function joinedBounds(value?: string, custom?: CustomRange) {
  const { start, end } = windowBounds(value, custom);
  return {
    ...(start ? { joined_after: start } : {}),
    ...(end ? { joined_before: end } : {}),
  };
}

/** `ending_after` / `ending_before` — the same windows on a plan's maturity. */
export function maturityBounds(value?: string, custom?: CustomRange) {
  const { start, end } = windowBounds(value, custom);
  return {
    ...(start ? { ending_after: start } : {}),
    ...(end ? { ending_before: end } : {}),
  };
}

function CustomRangeFooter({
  value,
  onChange,
}: {
  value: CustomRange;
  onChange: (next: CustomRange) => void;
}) {
  return (
    /* Typing in here must not close the menu, which is what a plain `<input>`
       inside a Radix item would do on every keystroke. */
    <div
      className="flex flex-col gap-2 border-t border-grey-50 p-3"
      onKeyDown={(event) => event.stopPropagation()}
    >
      <label className="flex flex-col gap-1 text-xs text-grey-400">
        From
        <input
          type="date"
          value={value.from}
          onChange={(event) => onChange({ ...value, from: event.target.value })}
          className="rounded-lg bg-grey-25 px-3 py-2 text-sm text-grey-900 outline-none"
        />
      </label>
      <label className="flex flex-col gap-1 text-xs text-grey-400">
        To
        <input
          type="date"
          value={value.to}
          onChange={(event) => onChange({ ...value, to: event.target.value })}
          className="rounded-lg bg-grey-25 px-3 py-2 text-sm text-grey-900 outline-none"
        />
      </label>
    </div>
  );
}

/**
 * The Date group, custom-range picker and all.
 *
 * `id` and `label` are the caller's — Users calls it "Date joined" and reads it
 * back as `joined` — but the options and the picker are shared, so two tables
 * cannot drift into meaning different things by "This week".
 */
export function dateFilterGroup({
  id = "date",
  label = "Date",
  selected,
  range,
  onRangeChange,
}: {
  id?: string;
  label?: string;

  /** The group's current value, so the picker shows only under "Custom". */
  selected?: string;
  range: CustomRange;
  onRangeChange: (next: CustomRange) => void;
}): FilterGroup {
  return {
    id,
    label,
    options: DATE_OPTIONS,
    footer:
      selected === "custom" ? (
        <CustomRangeFooter value={range} onChange={onRangeChange} />
      ) : null,
  };
}
