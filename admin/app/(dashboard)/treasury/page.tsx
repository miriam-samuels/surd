"use client";

import {
  AnalyticsUpIcon,
  Building03Icon,
  PercentIcon,
  Task01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { CurrencyChip } from "@/components/dashboard/editor-cell";
import { OwnerCell } from "@/components/dashboard/owner-cell";
import { Panel } from "@/components/dashboard/panel";
import { StatCard } from "@/components/dashboard/stat-card";
import { DataTable, type Column } from "@/components/ui/table";
import { useToast } from "@/components/ui/toast";
import { useDisclosure } from "@/hooks/use-disclosure";
import {
  CAPITAL_BREAKDOWN,
  PENDING_WITHDRAWAL_QUEUE,
  TREASURY_SUMMARY,
  type CapitalLine,
  type PendingWithdrawalRecord,
} from "@/content/finance";
import { cn } from "@/lib/cn";

/**
 * Treasury: how much capital is safe to deploy, and the withdrawals waiting on
 * an admin decision because they crossed the large-transaction threshold.
 */
export default function TreasuryPage() {
  const toast = useToast();
  const approve = useDisclosure<PendingWithdrawalRecord>();
  const reject = useDisclosure<PendingWithdrawalRecord>();

  const columns: Column<PendingWithdrawalRecord>[] = [
    { id: "reference", header: "Reference", cell: (row) => row.reference },
    {
      id: "owner",
      header: "Requested by",
      cell: (row) => <OwnerCell name={row.owner} email={row.ownerEmail} />,
      width: "min-w-56",
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
    { id: "source", header: "Source", cell: (row) => row.source },
    {
      id: "reason",
      header: "Held because",
      cell: (row) => <span className="text-grey-500">{row.reason}</span>,
      width: "min-w-56",
    },
    { id: "requested", header: "Requested", cell: (row) => row.requested },
    {
      id: "actions",
      header: "Actions",
      cell: (row) => (
        <span className="flex items-center gap-2">
          <Button
            tone="primary"
            variant="soft"
            size="md"
            shape="pill"
            onClick={() => approve.open(row)}
          >
            Approve
          </Button>
          <Button
            tone="danger"
            variant="soft"
            size="md"
            shape="pill"
            onClick={() => reject.open(row)}
          >
            Reject
          </Button>
        </span>
      ),
      width: "min-w-52",
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Treasury"
        description="Deployable capital and the withdrawals awaiting approval"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Safe deployable capital"
          value={TREASURY_SUMMARY.safeDeployable}
          icon={Building03Icon}
          hint="Customer funds minus liabilities and buffer"
        />
        <StatCard
          label="Currently deployed"
          value={TREASURY_SUMMARY.deployed}
          icon={AnalyticsUpIcon}
          hint="Capital already working"
        />
        <StatCard
          label="Liquidity ratio"
          value={TREASURY_SUMMARY.liquidityRatio}
          icon={PercentIcon}
          note="Healthy"
        />
        <StatCard
          label="Pending approvals"
          value={TREASURY_SUMMARY.pendingApprovals}
          icon={Task01Icon}
          hint="Withdrawals waiting on a decision"
        />
      </div>

      <Panel
        title="Safe Deployable Capital"
        icon={Building03Icon}
        hint="How the deployable figure is derived"
      >
        <ol className="flex flex-col">
          {CAPITAL_BREAKDOWN.map((line) => (
            <CapitalRow key={line.id} line={line} />
          ))}
        </ol>
      </Panel>

      <Panel
        title="Pending Withdrawals"
        icon={Task01Icon}
        hint="Above the large-transaction threshold, so they need sign-off"
        actions={
          <span className="text-md font-bold text-primary">
            {PENDING_WITHDRAWAL_QUEUE.length}
          </span>
        }
        bleed
      >
        <div className="px-4 pb-5 sm:px-5">
          <DataTable
            data={PENDING_WITHDRAWAL_QUEUE}
            columns={columns}
            getRowId={(row) => row.id}
            pagination={false}
            minWidth="min-w-6xl"
            emptyState={
              <EmptyState
                icon={Task01Icon}
                title="Nothing awaiting approval"
                description="Withdrawals above the large-transaction threshold will appear here."
              />
            }
          />
        </div>
      </Panel>

      <Dialog
        control={approve}
        tone="success"
        title="Approve this withdrawal?"
        description={`${approve.data?.amount ?? ""} will be released to ${approve.data?.owner ?? "the customer"}.`}
        confirmLabel="Yes, approve"
        onConfirm={() => {
          approve.close();
          toast.show({ tone: "success", message: "Withdrawal approved." });
        }}
      />

      <Dialog
        control={reject}
        tone="danger"
        title="Reject this withdrawal?"
        description={`${reject.data?.owner ?? "The customer"} will be notified and the funds stay in their wallet.`}
        confirmLabel="Yes, reject"
        onConfirm={() => {
          reject.close();
          toast.show({ tone: "warning", message: "Withdrawal rejected." });
        }}
      />
    </div>
  );
}

/** One line of the capital calculation, with its sign made explicit. */
function CapitalRow({ line }: { line: CapitalLine }) {
  const isTotal = line.effect === "total";

  return (
    <li
      className={cn(
        "flex flex-col gap-1 border-b border-grey-50 py-4 last:border-b-0",
        "sm:flex-row sm:items-center sm:justify-between sm:gap-6",
        isTotal && "border-t-2 border-t-grey-100",
      )}
    >
      <div className="min-w-0">
        <p
          className={cn(
            "font-semibold",
            isTotal ? "text-md text-grey-900" : "text-sm text-grey-900",
          )}
        >
          {line.label}
        </p>
        <p className="text-xs text-grey-400">{line.note}</p>
      </div>

      <p
        className={cn(
          "shrink-0 font-extrabold tabular-nums",
          isTotal ? "text-heading-xs text-primary" : "text-md text-grey-900",
        )}
      >
        {line.effect === "subtract" ? "−" : ""}
        {line.value}
      </p>
    </li>
  );
}
