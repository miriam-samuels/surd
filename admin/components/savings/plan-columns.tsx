"use client";

import { CurrencyChip } from "@/components/dashboard/editor-cell";
import { OwnerCell } from "@/components/dashboard/owner-cell";
import { StatusBadge } from "@/components/dashboard/status-badge";
import type { Column } from "@/components/ui/table";
import {
  formatDate,
  formatDaysLeft,
  formatEnum,
  formatMoney,
  formatName,
  formatTimestamp,
} from "@/lib/format";
import type { Saving } from "@/types/savings";

/**
 * One definition, two tables: All Savings Plans on the Savings page and the
 * Upcoming Maturities page read the same rows and must render them the same
 * way — a plan that says "Broken" on one screen cannot say "Active" on the
 * other because a column drifted.
 */
export const SAVINGS_PLAN_COLUMNS: Column<Saving>[] = [
  {
    id: "user",
    header: "User",
    /* FIXME(api): `Saving.user` is declared `User!` but resolved lazily, so a
       deleted customer nulls the entire row rather than this field. Until the
       schema drops the `!`, expect gaps here. */
    cell: (row) =>
      row.user ? (
        <OwnerCell
          name={formatName(row.user)}
          email={row.user.email ?? ""}
          userId={row.user.id}
        />
      ) : (
        <span className="text-grey-400">Unknown user</span>
      ),
    width: "min-w-56",
  },
  {
    id: "status",
    header: "Status",
    cell: (row) => <StatusBadge status={formatEnum(row.status)} />,
  },
  {
    id: "template",
    header: "Type",
    cell: (row) => (
      <span >{formatEnum(row.template)}</span>
    ),
  },
  {
    id: "currency",
    header: "Currency",
    cell: (row) => <CurrencyChip currency={row.currency as never} />,
  },
  {
    id: "balance",
    header: "Amount Saved",
    /* `balance`, not `amount_saved`. The latter is gross-ever-deposited and
       never decreases, so it overstates a partially-withdrawn plan and stops
       the column reconciling against the Total Savings Balance card. */
    cell: (row) => (
      <span className="font-semibold tabular-nums">
        {formatMoney(row.balance, row.currency)}
      </span>
    ),
  },
  {
    id: "started",
    header: "Started",
    cell: (row) => formatTimestamp(row.created_at),
  },
  {
    id: "maturity",
    header: "Maturity Date",
    /* "How long have I got" is the question this column is scanned for, so
       the countdown leads and the date sits under it. Once the date has
       passed there is no countdown to show and the date stands alone —
       a plan can end early, and the Status column says how. */
    cell: (row) => {
      const left = formatDaysLeft(row.ending_at);
      return left ? (
        <span className="flex flex-col">
          <span className="font-medium text-grey-900">{left}</span>
          <span className="text-xs text-grey-400">{formatDate(row.ending_at)}</span>
        </span>
      ) : (
        <span className="text-grey-500">{formatDate(row.ending_at)}</span>
      );
    },
  },
];
