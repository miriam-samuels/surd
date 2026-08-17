"use client";

import { useMemo, useState } from "react";
import {
  Calendar03Icon,
  SecurityLockIcon,
  UnavailableIcon,
} from "@hugeicons/core-free-icons";
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
import {
  VAULT_POSITIONS,
  VAULT_SUMMARY,
  type VaultPosition,
} from "@/content/finance";

const TENURE_FILTER = [
  { value: "all", label: "All tenures" },
  { value: "30 days", label: "30 days" },
  { value: "60 days", label: "60 days" },
  { value: "90 days", label: "90 days" },
];

/** Fixed deposits — funds locked for a fixed term. */
export default function VaultPage() {
  const [query, setQuery] = useState("");
  const [tenure, setTenure] = useState("all");

  const rows = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    return VAULT_POSITIONS.filter((position) => {
      const matchesTenure = tenure === "all" || position.tenure === tenure;
      const matchesQuery =
        !trimmed ||
        position.owner.toLowerCase().includes(trimmed) ||
        position.id.toLowerCase().includes(trimmed);
      return matchesTenure && matchesQuery;
    });
  }, [query, tenure]);

  const columns: Column<VaultPosition>[] = [
    { id: "id", header: "Vault ID", cell: (row) => row.id },
    {
      id: "owner",
      header: "Owner",
      cell: (row) => <OwnerCell name={row.owner} email={row.ownerEmail} />,
      width: "min-w-56",
    },
    {
      id: "tenure",
      header: "Tenure",
      cell: (row) => <span className="font-semibold">{row.tenure}</span>,
    },
    {
      id: "currency",
      header: "Currency",
      cell: (row) => <CurrencyChip currency={row.currency} />,
    },
    {
      id: "principal",
      header: "Principal",
      cell: (row) => (
        <span className="font-semibold tabular-nums">{row.principal}</span>
      ),
      align: "right",
    },
    { id: "rate", header: "Rate", cell: (row) => row.rate },
    {
      id: "status",
      header: "Status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    { id: "started", header: "Started", cell: (row) => row.started },
    { id: "maturity", header: "Maturity", cell: (row) => row.maturity },
  ];

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Vault"
        description="Fixed deposits and the funds locked inside them"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Locked funds"
          value={VAULT_SUMMARY.lockedFunds}
          icon={SecurityLockIcon}
          hint="Principal currently under lock"
        />
        <StatCard
          label="Active vaults"
          value={VAULT_SUMMARY.activeVaults}
          icon={SecurityLockIcon}
          hint="Positions yet to mature"
        />
        <StatCard
          label="Maturing this week"
          value={VAULT_SUMMARY.maturingThisWeek}
          icon={Calendar03Icon}
          hint="Positions releasing within seven days"
        />
        <StatCard
          label="Broken this month"
          value={VAULT_SUMMARY.brokenThisMonth}
          icon={UnavailableIcon}
          hint="Positions ended before maturity"
        />
      </div>

      <Panel
        title="Vault positions"
        icon={SecurityLockIcon}
        actions={
          <>
            <SearchInput
              value={query}
              onChange={setQuery}
              className="w-full sm:w-64"
            />
            <Dropdown
              options={TENURE_FILTER}
              value={tenure}
              onChange={setTenure}
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
                icon={SecurityLockIcon}
                title="No vaults match your filters"
                description="Try a different search term or clear the tenure filter."
              />
            }
          />
        </div>
      </Panel>
    </div>
  );
}
