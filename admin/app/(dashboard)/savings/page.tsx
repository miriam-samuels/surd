"use client";

import { useMemo, useState } from "react";
import {
  CheckmarkCircle02Icon,
  PiggyBankIcon,
  UnavailableIcon,
} from "@hugeicons/core-free-icons";
import { Dropdown } from "@/components/ui/dropdown";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SearchInput } from "@/components/ui/search-input";
import { CurrencyChip } from "@/components/dashboard/editor-cell";
import { OwnerCell } from "@/components/dashboard/owner-cell";
import { Panel } from "@/components/dashboard/panel";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { DataTable, type Column } from "@/components/ui/table";
import {
  SAVINGS_PLANS,
  SAVINGS_SUMMARY,
  type SavingsPlanRecord,
} from "@/content/finance";

const STATUS_FILTER = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "matured", label: "Matured" },
  { value: "broken", label: "Broken" },
];

/** Target savings plans across every account. */
export default function SavingsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const rows = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    return SAVINGS_PLANS.filter((plan) => {
      const matchesStatus = status === "all" || plan.status === status;
      const matchesQuery =
        !trimmed ||
        plan.owner.toLowerCase().includes(trimmed) ||
        plan.template.toLowerCase().includes(trimmed) ||
        plan.id.toLowerCase().includes(trimmed);
      return matchesStatus && matchesQuery;
    });
  }, [query, status]);

  const columns: Column<SavingsPlanRecord>[] = [
    { id: "id", header: "Plan ID", cell: (row) => row.id },
    {
      id: "owner",
      header: "Owner",
      cell: (row) => <OwnerCell name={row.owner} email={row.ownerEmail} />,
      width: "min-w-56",
    },
    {
      id: "template",
      header: "Template",
      cell: (row) => <span className="font-semibold">{row.template}</span>,
    },
    {
      id: "currency",
      header: "Currency",
      cell: (row) => <CurrencyChip currency={row.currency} />,
    },
    {
      id: "saved",
      header: "Saved",
      cell: (row) => <span className="tabular-nums">{row.saved}</span>,
    },
    {
      id: "target",
      header: "Target",
      cell: (row) => <span className="tabular-nums">{row.target}</span>,
    },
    {
      id: "progress",
      header: "Progress",
      cell: (row) => <ProgressBar value={row.progress} />,
      width: "min-w-40",
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    { id: "maturity", header: "Maturity", cell: (row) => row.maturity },
  ];

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Savings"
        description="Target savings plans across every account"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total saved"
          value={SAVINGS_SUMMARY.totalSaved}
          icon={PiggyBankIcon}
          hint="Balance held in target savings"
        />
        <StatCard
          label="Active plans"
          value={SAVINGS_SUMMARY.activePlans}
          icon={PiggyBankIcon}
          hint="Plans still accepting deposits"
        />
        <StatCard
          label="Matured plans"
          value={SAVINGS_SUMMARY.maturedPlans}
          icon={CheckmarkCircle02Icon}
          note="Reached target"
        />
        <StatCard
          label="Broken plans"
          value={SAVINGS_SUMMARY.brokenPlans}
          icon={UnavailableIcon}
          hint="Withdrawn before maturity"
        />
      </div>

      <Panel
        title="All savings plans"
        icon={PiggyBankIcon}
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
              className="w-44"
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
                icon={PiggyBankIcon}
                title="No plans match your filters"
                description="Try a different search term or clear the status filter."
              />
            }
          />
        </div>
      </Panel>
    </div>
  );
}
