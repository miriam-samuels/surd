"use client";

import { useMemo, useState } from "react";
import {
  ArrowDataTransferHorizontalIcon,
  UserGroupIcon,
  Wallet01Icon,
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
  FLEXI_WALLET_SUMMARY,
  WALLET_HOLDERS,
  type WalletHolder,
} from "@/content/finance";

const CURRENCY_FILTER = [
  { value: "all", label: "All currencies" },
  { value: "NGN", label: "NGN" },
  { value: "USD", label: "USD" },
];

/** Balances held in the instant-access wallet, by holder. */
export default function FlexiWalletPage() {
  const [query, setQuery] = useState("");
  const [currency, setCurrency] = useState("all");

  const rows = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    return WALLET_HOLDERS.filter((holder) => {
      const matchesCurrency =
        currency === "all" || holder.currency === currency;
      const matchesQuery =
        !trimmed ||
        holder.name.toLowerCase().includes(trimmed) ||
        holder.email.toLowerCase().includes(trimmed) ||
        holder.id.toLowerCase().includes(trimmed);
      return matchesCurrency && matchesQuery;
    });
  }, [query, currency]);

  const columns: Column<WalletHolder>[] = [
    { id: "id", header: "Wallet ID", cell: (row) => row.id },
    {
      id: "owner",
      header: "Holder",
      cell: (row) => <OwnerCell name={row.name} email={row.email} />,
      width: "min-w-56",
    },
    {
      id: "currency",
      header: "Currency",
      cell: (row) => <CurrencyChip currency={row.currency} />,
    },
    {
      id: "balance",
      header: "Balance",
      cell: (row) => (
        <span className="font-semibold tabular-nums">{row.balance}</span>
      ),
      align: "right",
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      id: "activity",
      header: "Last activity",
      cell: (row) => row.lastActivity,
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Flexi Wallet"
        description="Instant-access balances across the platform"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total balance (NGN)"
          value={FLEXI_WALLET_SUMMARY.totalNgn}
          icon={Wallet01Icon}
          hint="Naira held in Flexi Wallets"
        />
        <StatCard
          label="Total balance (USD)"
          value={FLEXI_WALLET_SUMMARY.totalUsd}
          icon={Wallet01Icon}
          hint="Dollars held in Flexi Wallets"
        />
        <StatCard
          label="Wallet holders"
          value={FLEXI_WALLET_SUMMARY.holders}
          icon={UserGroupIcon}
          hint="Accounts with a funded wallet"
        />
        <StatCard
          label="Net flow today"
          value={FLEXI_WALLET_SUMMARY.netFlowToday}
          icon={ArrowDataTransferHorizontalIcon}
          delta={{ value: "Deposits minus withdrawals", direction: "up" }}
        />
      </div>

      <Panel
        title="Wallet holders"
        icon={Wallet01Icon}
        actions={
          <>
            <SearchInput
              value={query}
              onChange={setQuery}
              className="w-full sm:w-64"
            />
            <Dropdown
              options={CURRENCY_FILTER}
              value={currency}
              onChange={setCurrency}
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
            minWidth="min-w-4xl"
            emptyState={
              <EmptyState
                icon={Wallet01Icon}
                title="No wallets match your filters"
                description="Try a different search term or clear the currency filter."
              />
            }
          />
        </div>
      </Panel>
    </div>
  );
}
