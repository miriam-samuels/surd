"use client";

import Link from "next/link";
import {
  ArrowUpDownIcon,
  ArrowUpRight01Icon,
  PiggyBankIcon,
  Wallet01Icon,
  Wallet03Icon,
} from "@hugeicons/core-free-icons";
import { useAdminWalletBalanceSeries, useAdminWalletOverview, useTransactions } from "@/api";
import { Button } from "@/components/ui/button";
import { Dropdown } from "@/components/ui/dropdown";
import { EmptyState } from "@/components/ui/empty-state";
import { Icon } from "@/components/ui/icon";
import { PageHeader } from "@/components/ui/page-header";
import { Spinner } from "@/components/ui/spinner";
import { ChartLegend, SeriesChart, SERIES_COLORS } from "@/components/dashboard/charts";
import { OwnerCell } from "@/components/dashboard/owner-cell";
import { Panel } from "@/components/dashboard/panel";
import { HeroStat, HeroStatBanner } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { DataTable, type Column } from "@/components/ui/table";
import { useDateRange } from "@/hooks/use-date-range";
import { ROUTES } from "@/constants/routes";
import {
  formatAbsoluteChange,
  formatChange,
  formatCompactMoney,
  formatEnum,
  formatMoney,
  formatName,
  formatTimestamp,
} from "@/lib/format";
import type { Transaction } from "@/types/transaction";
import { useCurrency } from "@/contexts/currency";

/*
 * NGN and USD never mix — every card and the chart are per currency with no FX
 * conversion anywhere on this page, so this picks a row rather than combining
 * them. Flexi is NGN-only per the product brief, so USD normally reads zero.
 */
const RECENT_LIMIT = 6;

export default function FlexiWalletPage() {
  const { currency } = useCurrency();
  const { key, setKey, range, options } = useDateRange();

  /* Its own window, not the chart's. The design puts a period control on both
     panels, and two controls that move together would be one control drawn
     twice. */
  const recent = useDateRange();

  const { data: overview, isLoading: loadingCards } = useAdminWalletOverview({
    currency,
    start_date: range.start_date,
  });

  const { data: series, isLoading: loadingChart } = useAdminWalletBalanceSeries({
    ...range,
    currency,
  });

  /*
   * FIXME(api): the note says to scope this to Flexi ourselves, but
   * `TransactionFilterInput` exposes no wallet-type filter — only `wallet_id`,
   * which is per account. Currency is as narrow as this gets today, so the
   * panel currently shows platform activity in the selected currency. A
   * `wallet_type` filter would close it.
   */
  const { data: rows, isLoading: loadingRows } = useTransactions({
    currency,
    /* The panel's own period actually scopes it — the table used to ignore
       dates entirely while a control sat above it. Only the floor: the
       granularity that travels with the range is for charts. */
    start_date: recent.range.start_date,
    limit: RECENT_LIMIT,
    page: 1,
  });

  /* One row per currency, nothing converted — match on `currency` rather than
   * trusting the position. */
  const cards =
    overview?.data?.find((row) => row.currency === currency) ?? overview?.data?.[0];

  const columns: Column<Transaction>[] = [
    {
      id: "user",
      header: "User",
      /* Resolved lazily and absent once a customer is deleted — fall back to
         the id rather than rendering an empty row. */
      cell: (row) =>
        row.user ? (
          <OwnerCell
            name={formatName(row.user)}
            email={row.user.email}
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
      /* `category` is the display taxonomy; `type` is storage and stays off
         the screen. */
      id: "type",
      header: "Type",
      cell: (row) => formatEnum(row.category),
    },
    {
      id: "amount",
      header: "Amount",
      cell: (row) => (
        <span className="font-semibold tabular-nums">
          {formatMoney(row.amount, row.currency)}
        </span>
      ),
    },
    {
      id: "flow",
      /* Derived server-side so every screen renders the same labels. One
         question — where the money went — so the destination alone, with the
         full leg on the cell. Transaction History renders both ends. */
      header: "To",
      cell: (row) =>
        row.flow ? (
          <span
            title={`${row.flow.source} → ${row.flow.destination}`}
            className="whitespace-nowrap text-grey-600"
          >
            {row.flow.destination}
          </span>
        ) : (
          "—"
        ),
      width: "min-w-48",
    },
    {
      id: "created",
      header: "Date & Time",
      cell: (row) => formatTimestamp(row.created_at),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Flexi Wallet"
        description="Instant-access balances across the platform"
      />

      {/* The four headline figures ride the brand banner, as they do on the
          Overview — same component, so the two pages cannot drift apart. */}
      <HeroStatBanner>
        <HeroStat
          icon={Wallet03Icon}
          label="Total Flexi Wallet balance"
          value={
            loadingCards ? "…" : formatCompactMoney(cards?.total_flexi_balance, currency)
          }
          delta={formatChange(
            cards?.total_flexi_balance_change_pct_vs_last_month,
            "from last month",
          )}
        />
        <HeroStat
          icon={Wallet03Icon}
          label="Total Flexi Deposits"
          value={
            loadingCards ? "…" : formatCompactMoney(cards?.total_flexi_deposits, currency)
          }
          delta={formatChange(
            cards?.total_flexi_deposits_change_pct_vs_yesterday,
            "vs yesterday",
          )}
        />
        <HeroStat
          icon={PiggyBankIcon}
          label="Total Flexi Withdrawals"
          value={
            loadingCards
              ? "…"
              : formatCompactMoney(cards?.total_flexi_withdrawals, currency)
          }
          delta={formatChange(
            cards?.total_flexi_withdrawals_change_pct_vs_yesterday,
            "vs yesterday",
          )}
        />
        <HeroStat
          icon={PiggyBankIcon}
          label="Flexi ROI Liability"
          value={
            loadingCards ? "…" : formatCompactMoney(cards?.flexi_roi_liability, currency)
          }
          /* An amount, not a rate — the design's "+₦890K today". */
          delta={formatAbsoluteChange(cards?.flexi_roi_liability_change_today, currency)}
        />
      </HeroStatBanner>



      <Panel
        title="Flexi Balance Over Time"
        icon={Wallet03Icon}
        hint="Flexi wallet balances across the selected period"
        /* The range lives on the chart it draws, as it does on the Overview.
           It still scopes the deposit and withdrawal figures above, which are
           period totals rather than balances. */
        actions={
          <Dropdown
            options={options}
            value={key}
            onChange={(next) => setKey(next as typeof key)}
          className="w-34 rounded-lg border-grey-50"

          />
        }
      >
        {loadingChart ? (
          <div className="grid h-72 place-items-center">
            <Spinner size={28} className="text-primary" />
          </div>
        ) : (
          <>
            {/* One line. Savings and Total live on Overview — keeping all
                three here re-creates the naming confusion the rename fixed. */}
            <SeriesChart
              data={series?.data ?? []}
              currency={currency}
              series={[
                { key: "flexi_balance", name: "Flexi Wallet", color: SERIES_COLORS.flexi },
              ]}
            />
            <ChartLegend
              items={[{ label: "Flexi Wallet", color: SERIES_COLORS.flexi }]}
            />
          </>
        )}
      </Panel>

      <Panel
        title="Recent Wallet Transactions"
        icon={ArrowUpDownIcon}
        actions={
          <Dropdown
            options={recent.options}
            value={recent.key}
            onChange={(next) => recent.setKey(next as typeof recent.key)}
            className="w-34 rounded-lg border-grey-50"
          />
        }
        bleed
      >
        <div className="px-4 pb-5 sm:px-5">
          <DataTable
            data={rows?.data ?? []}
            columns={columns}
            getRowId={(row) => row.id}
            isLoading={loadingRows}
            pagination={false}
            minWidth="min-w-4xl"
            emptyState={
              <EmptyState
                icon={Wallet01Icon}
                title="No wallet activity yet"
                description="Deposits and withdrawals will appear here as they happen."
              />
            }
          />

          {/* Routes through to the full history rather than paging this
              panel indefinitely. */}
          <Button variant="soft" size="lg" block className="mt-4" asChild>
            <Link href={ROUTES.finance.transactions}>
              View all
              <Icon icon={ArrowUpRight01Icon} size={16} />
            </Link>
          </Button>
        </div>
      </Panel>
    </div>
  );
}
