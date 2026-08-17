import {
  Alert02Icon,
  ArrowDataTransferHorizontalIcon,
  ArrowDown02Icon,
  ArrowUp02Icon,
  ArrowUpRight01Icon,
  PercentIcon,
  PieChartIcon,
  PiggyBankIcon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  ChartLegend,
  FundsBreakdownChart,
  SERIES_COLORS,
  SystemFundsChart,
} from "@/components/dashboard/charts";
import { Panel, PanelFilter } from "@/components/dashboard/panel";
import {
  HeroStat,
  HeroStatBanner,
  StatCard,
} from "@/components/dashboard/stat-card";
import {
  FUNDS_BREAKDOWN,
  PENDING_WITHDRAWALS,
  RECENT_TRANSACTIONS,
  SYSTEM_FUNDS,
  type TransactionStatus,
} from "@/content/dashboard";

const PERIODS = ["This year", "Last year", "This quarter"];
const RANGES = ["Up till date", "Last 30 days", "Last 7 days"];

const naira = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 2,
});

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-5">
      <header>
        <h1 className="text-heading-xs font-extrabold text-grey-900">
          Dashboard
        </h1>
        <p className="text-sm text-grey-400">
          Platform overview and financial metrics
        </p>
      </header>

      <HeroStatBanner>
        <HeroStat
          icon={Wallet01Icon}
          label="Total Funds in System"
          value="₦358.2M"
          delta={{ value: "+6.8% from last month", direction: "up" }}
        />
        <HeroStat
          icon={Wallet01Icon}
          label="Total Flexi Wallet balance"
          value="₦1.82B"
          delta={{ value: "-8% vs yesterday", direction: "down" }}
        />
        <HeroStat
          icon={PiggyBankIcon}
          label="Total Savings Balance"
          value="₦45.0M"
          delta={{ value: "-6.8% from last month", direction: "down" }}
        />
        <HeroStat
          icon={PiggyBankIcon}
          label="Total ROI Liability"
          value="₦313.0M"
          note="+₦890K today"
        />
      </HeroStatBanner>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Daily Deposits"
          value="₦1.82B"
          icon={ArrowDown02Icon}
          delta={{ value: "+12% vs yesterday", direction: "up" }}
          hint="Total deposits received today"
        />
        <StatCard
          label="Daily Withdrawals"
          value="₦1.46B"
          icon={ArrowUp02Icon}
          delta={{ value: "-8% vs yesterday", direction: "down" }}
          hint="Total withdrawals paid out today"
        />
        <StatCard
          label="Net Capital Position"
          value="₦313.0M"
          icon={ArrowUpRight01Icon}
          note="Healthy"
          hint="Assets minus liabilities"
        />
        <StatCard
          label="Liquidity Ratio"
          value="2.84×"
          icon={PercentIcon}
          note="Healthy"
          hint="Available liquidity against short-term obligations"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="flex flex-col gap-4 xl:col-span-2">
          <Panel
            title="System Funds"
            icon={PiggyBankIcon}
            hint="Balances across all wallets over time"
            actions={
              <>
                <PanelFilter label="Period" options={PERIODS} />
                <PanelFilter label="Range" options={RANGES} />
              </>
            }
          >
            <SystemFundsChart data={SYSTEM_FUNDS} />
            <ChartLegend
              items={[
                { label: "Flexi Wallet", color: SERIES_COLORS.flexi },
                { label: "Savings Wallet", color: SERIES_COLORS.savings },
                { label: "ROI Liability", color: SERIES_COLORS.roi },
              ]}
            />
          </Panel>

          <Panel
            title="Funds Breakdown"
            icon={PieChartIcon}
            actions={
              <>
                <PanelFilter label="Period" options={PERIODS} />
                <PanelFilter label="Range" options={RANGES} />
              </>
            }
          >
            <div className="grid items-center gap-6 sm:grid-cols-2">
              <FundsBreakdownChart data={FUNDS_BREAKDOWN} />
              <ul className="flex flex-col gap-3">
                {FUNDS_BREAKDOWN.map((slice) => (
                  <li
                    key={slice.name}
                    className="flex items-center justify-between gap-4 text-sm"
                  >
                    <span className="flex items-center gap-2 text-grey-600">
                      <span
                        aria-hidden
                        className="size-2 shrink-0 rounded-full"
                        style={{ backgroundColor: slice.color }}
                      />
                      {slice.name}
                    </span>
                    <span className="font-semibold text-grey-900 tabular-nums">
                      {naira.format(slice.value)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Panel>
        </div>

        <Panel
          title="Pending Withdrawals"
          icon={Alert02Icon}
          hint="Awaiting approval within 30 days"
          actions={
            <span className="text-md font-bold text-primary">
              {PENDING_WITHDRAWALS.length}
            </span>
          }
          className="h-fit"
        >
          <ul className="flex flex-col divide-y divide-grey-50">
            {PENDING_WITHDRAWALS.map((item) => (
              <li key={item.id} className="flex flex-col gap-3 py-4 first:pt-0">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-md font-extrabold text-grey-900">
                    {item.amount}
                  </p>
                  <Badge tone="warning" variant="soft" size="sm">
                    {item.kind}
                  </Badge>
                </div>

                <dl className="flex flex-col gap-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <dt className="w-10 shrink-0 text-grey-400">By:</dt>
                    <dd className="flex min-w-0 items-center gap-2">
                      <Avatar name={item.user} size="xs" />
                      <span className="truncate font-semibold text-grey-900">
                        {item.user}
                      </span>
                    </dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <dt className="w-10 shrink-0 text-grey-400">Date:</dt>
                    <dd className="font-semibold text-grey-900">{item.date}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <dt className="w-10 shrink-0 text-grey-400">Time:</dt>
                    <dd className="font-semibold text-grey-900">{item.time}</dd>
                  </div>
                </dl>

                <div className="flex gap-2">
                  <Button tone="primary" variant="soft" size="md" shape="pill" block>
                    Approve
                  </Button>
                  <Button tone="danger" variant="soft" size="md" shape="pill" block>
                    Reject
                  </Button>
                </div>
              </li>
            ))}
          </ul>

          <Button variant="soft" size="lg" block className="mt-4">
            View all
          </Button>
        </Panel>
      </div>

      <Panel
        title="Recent Transactions"
        icon={ArrowDataTransferHorizontalIcon}
        actions={
          <>
            <PanelFilter label="Period" options={PERIODS} />
            <PanelFilter label="Range" options={RANGES} />
          </>
        }
        bleed
      >
        {/* Tables scroll inside their own container so the page never does. */}
        <div className="overflow-x-auto px-4 sm:px-5">
          <table className="w-full min-w-3xl border-collapse text-sm">
            <thead>
              <tr className="border-b border-grey-50 text-left">
                {["ID", "User", "Status", "Amount", "To", "Date & Time"].map(
                  (heading) => (
                    <th
                      key={heading}
                      scope="col"
                      className="py-3 pr-4 text-xs font-semibold text-grey-400"
                    >
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {RECENT_TRANSACTIONS.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-grey-50 last:border-b-0"
                >
                  <td className="py-4 pr-4 font-semibold text-grey-900">
                    {transaction.reference}
                  </td>
                  <td className="py-4 pr-4">
                    <span className="flex items-center gap-2">
                      <Avatar name={transaction.user} size="xs" />
                      <span className="whitespace-nowrap text-grey-900">
                        {transaction.user}
                      </span>
                    </span>
                  </td>
                  <td className="py-4 pr-4">
                    <StatusBadge status={transaction.status} />
                  </td>
                  <td className="py-4 pr-4 whitespace-nowrap tabular-nums text-grey-900">
                    {transaction.amount}
                  </td>
                  <td className="py-4 pr-4 whitespace-nowrap text-grey-600">
                    {transaction.destination}
                  </td>
                  <td className="py-4 whitespace-nowrap text-grey-600">
                    {transaction.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 sm:p-5">
          <Button variant="soft" size="lg" block>
            View all
            <Icon icon={ArrowUpRight01Icon} size={16} />
          </Button>
        </div>
      </Panel>
    </div>
  );
}

const statusTones = {
  pending: { tone: "warning", label: "Pending" },
  completed: { tone: "success", label: "Completed" },
  failed: { tone: "danger", label: "Failed" },
} as const;

function StatusBadge({ status }: { status: TransactionStatus }) {
  const config = statusTones[status];
  return (
    <Badge tone={config.tone} variant="soft" size="sm">
      {config.label}
    </Badge>
  );
}
