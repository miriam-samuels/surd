"use client";

import { useMemo, useState } from "react";
import {
  ArrowDataTransferHorizontalIcon,
  ArrowDownLeft01Icon,
  ArrowUpRight01Icon,
  UnavailableIcon,
} from "@hugeicons/core-free-icons";
import { Drawer } from "@/components/ui/drawer";
import { FilterChip, MultiDropdown } from "@/components/ui/dropdown";
import { EmptyState } from "@/components/ui/empty-state";
import { Icon } from "@/components/ui/icon";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { CurrencyChip } from "@/components/dashboard/editor-cell";
import { OwnerCell } from "@/components/dashboard/owner-cell";
import { Panel } from "@/components/dashboard/panel";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { DataTable, type Column } from "@/components/ui/table";
import { useDisclosure } from "@/hooks/use-disclosure";
import {
  LEDGER_ENTRIES,
  LEDGER_SUMMARY,
  TRANSACTION_TYPES,
  type LedgerEntry,
} from "@/content/finance";
import { cn } from "@/lib/cn";

const TYPE_OPTIONS = TRANSACTION_TYPES.map((type) => ({
  value: type,
  label: type,
}));

const STATUS_OPTIONS = [
  { value: "processing", label: "Processing" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
];

const PAGE_SIZE = 20;

/**
 * The full ledger.
 *
 * This page drives `DataTable` in **server mode** — it owns `page` and slices
 * the data itself — because the real endpoint will be paged. Every other table
 * in the console uses the default client mode. Swapping the `useMemo` for a
 * fetch keyed on `page` is the only change needed to go live.
 */
export default function TransactionsPage() {
  const [query, setQuery] = useState("");
  const [types, setTypes] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const detail = useDisclosure<LedgerEntry>();

  const filtered = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    return LEDGER_ENTRIES.filter((entry) => {
      const matchesType = types.length === 0 || types.includes(entry.type);
      const matchesStatus =
        statuses.length === 0 || statuses.includes(entry.status);
      const matchesQuery =
        !trimmed ||
        entry.reference.toLowerCase().includes(trimmed) ||
        entry.owner.toLowerCase().includes(trimmed);
      return matchesType && matchesStatus && matchesQuery;
    });
  }, [query, types, statuses]);

  /* Stand-in for the server: hand the table only the current page. */
  const pageRows = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page],
  );

  /** Any filter change invalidates the current page number. */
  const resetTo = <T,>(setter: (value: T) => void) => {
    return (value: T) => {
      setter(value);
      setPage(1);
    };
  };

  const columns: Column<LedgerEntry>[] = [
    { id: "reference", header: "ID", cell: (row) => row.reference },
    {
      id: "owner",
      header: "User",
      cell: (row) => <OwnerCell name={row.owner} email={row.ownerEmail} />,
      width: "min-w-56",
    },
    {
      id: "type",
      header: "Type",
      cell: (row) => (
        <span className="flex items-center gap-2 whitespace-nowrap">
          <Icon
            icon={
              row.flow === "credit" ? ArrowDownLeft01Icon : ArrowUpRight01Icon
            }
            size={16}
            className={cn(
              "shrink-0",
              row.flow === "credit" ? "text-green-600" : "text-red-500",
            )}
          />
          {row.type}
        </span>
      ),
    },
    {
      id: "currency",
      header: "Currency",
      cell: (row) => <CurrencyChip currency={row.currency} />,
    },
    {
      id: "amount",
      header: "Amount",
      cell: (row) => (
        <span className="font-semibold tabular-nums">{row.amount}</span>
      ),
      align: "right",
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      id: "flow",
      header: "Flow",
      cell: (row) => (
        <span className="flex items-center gap-2 whitespace-nowrap">
          {row.source}
          <span aria-hidden className="text-grey-300">
            &rarr;
          </span>
          {row.destination}
        </span>
      ),
      width: "min-w-56",
    },
    { id: "timestamp", header: "Date & Time", cell: (row) => row.timestamp },
  ];

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Transaction history"
        description="Every movement of money across the platform"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Volume today"
          value={LEDGER_SUMMARY.volumeToday}
          icon={ArrowDataTransferHorizontalIcon}
          hint="Total value moved since midnight"
        />
        <StatCard
          label="Deposits"
          value={LEDGER_SUMMARY.deposits}
          icon={ArrowDownLeft01Icon}
          delta={{ value: "+12% vs yesterday", direction: "up" }}
        />
        <StatCard
          label="Withdrawals"
          value={LEDGER_SUMMARY.withdrawals}
          icon={ArrowUpRight01Icon}
          delta={{ value: "-8% vs yesterday", direction: "down" }}
        />
        <StatCard
          label="Failed"
          value={LEDGER_SUMMARY.failed}
          icon={UnavailableIcon}
          hint="Transactions that did not complete"
        />
      </div>

      <Panel
        title="All transactions"
        icon={ArrowDataTransferHorizontalIcon}
        bleed
      >
        <div className="flex flex-wrap items-center gap-3 px-4 pb-5 sm:px-5">
          <SearchInput
            value={query}
            onChange={resetTo(setQuery)}
            className="w-full sm:w-72"
          />

          {types.length > 0 ? (
            <FilterChip
              label={types.length === 1 ? types[0] : `${types.length} Types`}
              onRemove={() => {
                setTypes([]);
                setPage(1);
              }}
            />
          ) : (
            <MultiDropdown
              options={TYPE_OPTIONS}
              value={types}
              onChange={resetTo(setTypes)}
              label="All types"
            />
          )}

          {statuses.length > 0 ? (
            <FilterChip
              label={
                statuses.length === 1
                  ? (STATUS_OPTIONS.find(
                      (option) => option.value === statuses[0],
                    )?.label ?? "Status")
                  : `${statuses.length} Statuses`
              }
              onRemove={() => {
                setStatuses([]);
                setPage(1);
              }}
            />
          ) : (
            <MultiDropdown
              options={STATUS_OPTIONS}
              value={statuses}
              onChange={resetTo(setStatuses)}
              label="All statuses"
            />
          )}
        </div>

        <div className="px-4 pb-5 sm:px-5">
          <DataTable
            data={pageRows}
            columns={columns}
            getRowId={(row) => row.id}
            onRowClick={detail.open}
            minWidth="min-w-6xl"
            pagination={{
              mode: "server",
              page,
              pageSize: PAGE_SIZE,
              totalItems: filtered.length,
              onPageChange: setPage,
            }}
            emptyState={
              <EmptyState
                icon={ArrowDataTransferHorizontalIcon}
                title="No transactions match your filters"
                description="Try a different search term or clear one of the filters."
              />
            }
          />
        </div>
      </Panel>

      <TransactionDrawer control={detail} />
    </div>
  );
}

/** Full detail for one ledger entry, in a side drawer. */
function TransactionDrawer({
  control,
}: {
  control: ReturnType<typeof useDisclosure<LedgerEntry>>;
}) {
  const entry = control.data;

  const fields = entry
    ? [
        { label: "Reference", value: entry.reference },
        { label: "Type", value: entry.type },
        { label: "Amount", value: entry.amount },
        { label: "Currency", value: entry.currency },
        { label: "Source", value: entry.source },
        { label: "Destination", value: entry.destination },
        { label: "Date & time", value: entry.timestamp },
      ]
    : [];

  return (
    <Drawer
      control={control}
      title="Transaction detail"
      description={entry?.reference}
      icon={ArrowDataTransferHorizontalIcon}
      width="md"
    >
      {entry ? (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4 rounded-2xl bg-grey-25 p-4">
            <OwnerCell name={entry.owner} email={entry.ownerEmail} />
            <StatusBadge status={entry.status} size="md" />
          </div>

          <dl className="flex flex-col divide-y divide-grey-50">
            {fields.map((field) => (
              <div
                key={field.label}
                className="flex items-center justify-between gap-4 py-3"
              >
                <dt className="text-sm text-grey-400">{field.label}</dt>
                <dd className="text-sm font-semibold text-grey-900">
                  {field.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ) : null}
    </Drawer>
  );
}
