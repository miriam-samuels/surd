"use client";

import { useMemo, useState } from "react";
import { AnalyticsUpIcon, PercentIcon } from "@hugeicons/core-free-icons";
import { Dropdown } from "@/components/ui/dropdown";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { CurrencyChip } from "@/components/dashboard/editor-cell";
import { OwnerCell } from "@/components/dashboard/owner-cell";
import { Panel } from "@/components/dashboard/panel";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { DataTable, type Column } from "@/components/ui/table";
import { ROI_PAYOUTS, ROI_SUMMARY, type RoiPayout } from "@/content/finance";

const STATUS_FILTER = [
  { value: "all", label: "All statuses" },
  { value: "accrued", label: "Accrued" },
  { value: "paid", label: "Paid" },
  { value: "clawed back", label: "Clawed back" },
];

/** Interest owed and paid across every product. */
export default function RoiPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const rows = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    return ROI_PAYOUTS.filter((payout) => {
      const matchesStatus = status === "all" || payout.status === status;
      const matchesQuery =
        !trimmed ||
        payout.owner.toLowerCase().includes(trimmed) ||
        payout.product.toLowerCase().includes(trimmed) ||
        payout.id.toLowerCase().includes(trimmed);
      return matchesStatus && matchesQuery;
    });
  }, [query, status]);

  const columns: Column<RoiPayout>[] = [
    { id: "id", header: "ROI ID", cell: (row) => row.id },
    {
      id: "owner",
      header: "Owner",
      cell: (row) => <OwnerCell name={row.owner} email={row.ownerEmail} />,
      width: "min-w-56",
    },
    { id: "product", header: "Product", cell: (row) => row.product },
    {
      id: "currency",
      header: "Currency",
      cell: (row) => <CurrencyChip currency={row.currency} />,
    },
    {
      id: "principal",
      header: "Principal",
      cell: (row) => <span className="tabular-nums">{row.principal}</span>,
    },
    {
      id: "rate",
      header: "Rate",
      cell: (row) => <span className="font-semibold">{row.rate}</span>,
    },
    {
      id: "accrued",
      header: "Accrued",
      cell: (row) => (
        <span className="font-semibold tabular-nums">{row.accrued}</span>
      ),
      align: "right",
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    { id: "payout", header: "Payout date", cell: (row) => row.payoutDate },
  ];

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="ROI"
        description="Interest accrued, paid and clawed back"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total ROI liability"
          value={ROI_SUMMARY.totalLiability}
          icon={AnalyticsUpIcon}
          hint="Interest owed to customers right now"
        />
        <StatCard
          label="Paid this month"
          value={ROI_SUMMARY.paidThisMonth}
          icon={AnalyticsUpIcon}
          hint="Interest already settled this cycle"
        />
        <StatCard
          label="Accrued today"
          value={ROI_SUMMARY.accruedToday}
          icon={AnalyticsUpIcon}
          note="Added since midnight"
        />
        <StatCard
          label="Average rate"
          value={ROI_SUMMARY.averageRate}
          icon={PercentIcon}
          hint="Weighted across all active products"
        />
      </div>

      <Panel
        title="ROI payouts"
        icon={AnalyticsUpIcon}
        actions={
          <>
            <SearchInput
              value={query}
              onChange={setQuery}
              className="w-full sm:w-64"
            />
            <Dropdown
              options={STATUS_FILTER}
              value={status}
              onChange={setStatus}
              className="w-48"
            />
          </>
        }
        bleed
      >
        <div className="px-4 pb-5 sm:px-5">
          <DataTable
            data={rows}
            columns={columns}
            getRowId={(row) => row.id}
            minWidth="min-w-6xl"
            emptyState={
              <EmptyState
                icon={AnalyticsUpIcon}
                title="No payouts match your filters"
                description="Try a different search term or clear the status filter."
              />
            }
          />
        </div>
      </Panel>
    </div>
  );
}
