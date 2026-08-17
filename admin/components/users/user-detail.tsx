"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft02Icon,
  Building03Icon,
  Calendar03Icon,
  Clock01Icon,
  FileValidationIcon,
  Location01Icon,
  Mail01Icon,
  SmartPhone01Icon,
  UnavailableIcon,
  UserAccountIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Flag } from "@/components/ui/flag";
import { Icon } from "@/components/ui/icon";
import { StatCard } from "@/components/dashboard/stat-card";
import { HniBadge, StatusBadge } from "@/components/dashboard/status-badge";
import { DataTable, type Column } from "@/components/ui/table";
import { TabPanel, Tabs, type TabItem } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { DetailGrid } from "@/components/users/detail-grid";
import { DocumentPreviewDialog } from "@/components/users/document-preview-dialog";
import { ROUTES } from "@/constants/routes";
import { useDisclosure } from "@/hooks/use-disclosure";
import type {
  FixedDepositPlan,
  KycDocument,
  LoginRecord,
  TargetPlan,
  UserRecord,
  UserTransaction,
} from "@/content/users";

/**
 * A single user's record: header, headline stats, then seven tabs.
 *
 * Each tab is a small function below rather than a separate file — they share
 * the same `user` object and none is big enough to earn its own module.
 */

const TABS: TabItem[] = [
  { value: "balances", label: "Balances" },
  { value: "profile", label: "Profile" },
  { value: "account", label: "Account" },
  { value: "transactions", label: "Transactions" },
  { value: "plans", label: "Savings Plans" },
  { value: "kyc", label: "KYC" },
  { value: "logins", label: "Login History" },
];

export function UserDetail({ user }: { user: UserRecord }) {
  const toast = useToast();
  const confirmClose = useDisclosure();
  const closed = useDisclosure();
  const preview = useDisclosure<string>();

  const handleClose = () => {
    confirmClose.close();
    closed.open();
    toast.show({ tone: "warning", message: "User account has been closed." });
  };

  return (
    <div className="flex flex-col gap-6">
      <Link
        href={ROUTES.users.list}
        className="inline-flex w-fit items-center gap-2 text-lg font-semibold text-grey-900 hover:text-primary"
      >
        <Icon icon={ArrowLeft02Icon} size={20} />
        Back
      </Link>

      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar name={user.displayName} size="2xl" />
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-heading-xs font-extrabold text-grey-900">
                {user.displayName}
              </h1>
              <StatusBadge status={user.status} />
              {user.isHni ? <HniBadge /> : null}
            </div>
            <p className="text-md text-grey-500">{user.reference}</p>
          </div>
        </div>

        <Button
          tone="danger"
          variant="soft"
          size="xl"
          shape="pill"
          leadingIcon={UnavailableIcon}
          onClick={() => confirmClose.open()}
        >
          Close account
        </Button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active plans"
          value={String(user.stats.activePlans)}
          hint="Plans currently running"
        />
        <StatCard
          label="Completed plans"
          value={String(user.stats.completedPlans)}
          hint="Plans that reached maturity"
        />
        <StatCard
          label="Total Withdrawals"
          value={user.stats.totalWithdrawals}
          hint="Lifetime withdrawals"
        />
        <StatCard
          label="Total ROI Liability"
          value={user.stats.totalRoiLiability}
          hint="Interest owed to this account"
        />
      </div>

      <Tabs items={TABS} defaultValue="balances" className="gap-6">
        <TabPanel value="balances">
          <BalancesTab user={user} />
        </TabPanel>
        <TabPanel value="profile">
          <ProfileTab user={user} />
        </TabPanel>
        <TabPanel value="account">
          <AccountTab user={user} onPreview={preview.open} />
        </TabPanel>
        <TabPanel value="transactions">
          <TransactionsTab rows={user.transactions} />
        </TabPanel>
        <TabPanel value="plans">
          <PlansTab user={user} />
        </TabPanel>
        <TabPanel value="kyc">
          <KycTab rows={user.kycDocuments} onPreview={preview.open} />
        </TabPanel>
        <TabPanel value="logins">
          <LoginsTab rows={user.loginHistory} />
        </TabPanel>
      </Tabs>

      <Dialog
        control={confirmClose}
        tone="danger"
        title="Are you sure you want to close this user account?"
        description="Closing this account will permanently disable the user's access and prevent them from performing any transactions."
        confirmLabel="Yes, close"
        onConfirm={handleClose}
      />

      <Dialog
        control={closed}
        tone="success"
        title="User account has been closed"
        description="The user's account has been closed. They can no longer access the platform or perform transactions."
        confirmLabel="Ok got it"
      />

      <DocumentPreviewDialog control={preview} />
    </div>
  );
}

/* --------------------------------------------------------------------- tabs */

function Card({
  title,
  icon,
  children,
}: {
  title: string;
  icon: typeof UserIcon;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-grey-50 bg-white p-5">
      <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-grey-900">
        <Icon icon={icon} size={20} className="text-primary" />
        {title}
      </h2>
      {children}
    </section>
  );
}

function BalancesTab({ user }: { user: UserRecord }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {user.balances.map((balance, index) => (
        <article
          key={`${balance.label}-${balance.currency}-${index}`}
          className="flex flex-col gap-3 rounded-2xl border border-grey-50 bg-white p-5"
        >
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-grey-500">
              {balance.label}
            </h3>
            <span className="flex items-center gap-1.5 rounded-full bg-grey-25 px-2 py-1 text-xs font-semibold">
              <Flag code={balance.currency === "NGN" ? "NG" : "US"} size="sm" />
              {balance.currency}
            </span>
          </div>
          <p className="text-heading-xs font-extrabold text-grey-900">
            {balance.amount}
          </p>
        </article>
      ))}
    </div>
  );
}

function ProfileTab({ user }: { user: UserRecord }) {
  return (
    <Card title="Profile Information" icon={UserIcon}>
      <DetailGrid
        fields={[
          { label: "First name", value: user.firstName, icon: UserIcon },
          { label: "Last name", value: user.lastName, icon: UserIcon },
          { label: "Email", value: user.email, icon: Mail01Icon },
          { label: "Phone", value: user.phone, icon: SmartPhone01Icon },
          { label: "Address", value: user.address, icon: Location01Icon },
          { label: "Gender", value: user.gender, icon: UserAccountIcon },
          {
            label: "Date of Birth",
            value: user.dateOfBirth,
            icon: Calendar03Icon,
          },
        ]}
      />
    </Card>
  );
}

function AccountTab({
  user,
  onPreview,
}: {
  user: UserRecord;
  onPreview: (document: string) => void;
}) {
  return (
    <Card title="Account Information" icon={UserAccountIcon}>
      <DetailGrid
        fields={[
          { label: "Bank", value: user.bank, icon: Building03Icon },
          {
            label: "Virtual Account number",
            value: user.virtualAccountNumber,
            icon: Building03Icon,
          },
          { label: "Joined", value: user.joined, icon: Calendar03Icon },
          {
            label: "Status",
            value: <StatusBadge status={user.status} />,
            icon: UserAccountIcon,
          },
          {
            label: "KYC Documents",
            value: (
              <span className="flex flex-wrap gap-2">
                {["NIN", "BVN"].map((document) => (
                  <button
                    key={document}
                    type="button"
                    onClick={() => onPreview(document)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-grey-100 px-2.5 py-1 text-xs font-semibold text-primary transition-colors hover:bg-surd-blue-50"
                  >
                    {document}
                  </button>
                ))}
              </span>
            ),
            icon: FileValidationIcon,
          },
          { label: "Last Login", value: user.lastLogin, icon: Clock01Icon },
        ]}
      />
    </Card>
  );
}

function CurrencyCell({ currency }: { currency: "NGN" | "USD" }) {
  return (
    <span className="flex items-center gap-2">
      <Flag code={currency === "NGN" ? "NG" : "US"} size="sm" />
      {currency}
    </span>
  );
}

function TransactionsTab({ rows }: { rows: UserTransaction[] }) {
  const columns: Column<UserTransaction>[] = [
    { id: "id", header: "ID", cell: (row) => row.reference },
    {
      id: "status",
      header: "Status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    { id: "type", header: "Type", cell: (row) => row.type },
    {
      id: "currency",
      header: "Currency",
      cell: (row) => <CurrencyCell currency={row.currency} />,
    },
    {
      id: "amount",
      header: "Amount",
      cell: (row) => (
        <span className="font-semibold tabular-nums">{row.amount}</span>
      ),
    },
    { id: "narration", header: "Narration", cell: (row) => row.narration },
    {
      id: "flow",
      header: "Flow",
      cell: (row) => (
        <span className="flex items-center gap-2 whitespace-nowrap">
          {row.from}
          <span aria-hidden className="text-grey-300">
            &rarr;
          </span>
          {row.to}
        </span>
      ),
      width: "min-w-56",
    },
    { id: "timestamp", header: "Date & Time", cell: (row) => row.timestamp },
  ];

  return (
    <Card title="Transactions History" icon={FileValidationIcon}>
      <DataTable
        data={rows}
        columns={columns}
        getRowId={(row) => row.id}
        minWidth="min-w-5xl"
      />
    </Card>
  );
}

function PlansTab({ user }: { user: UserRecord }) {
  const [view, setView] = useState("target");

  const targetColumns: Column<TargetPlan>[] = [
    { id: "id", header: "ID", cell: (row) => row.id },
    {
      id: "status",
      header: "Status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      id: "currency",
      header: "Currency",
      cell: (row) => <CurrencyCell currency={row.currency} />,
    },
    { id: "saved", header: "Amount Saved", cell: (row) => row.amountSaved },
    { id: "target", header: "Target Amount", cell: (row) => row.targetAmount },
    { id: "roi", header: "ROI Earned", cell: (row) => row.roiEarned },
    { id: "withdrawal", header: "Withdrawal", cell: (row) => row.withdrawal },
    { id: "started", header: "Started", cell: (row) => row.started },
    { id: "maturity", header: "Maturity", cell: (row) => row.maturity },
  ];

  const fixedColumns: Column<FixedDepositPlan>[] = [
    { id: "id", header: "ID", cell: (row) => row.id },
    {
      id: "plan",
      header: "Plan name",
      cell: (row) => (
        <span className="block max-w-28 truncate">{row.planName}</span>
      ),
    },
    { id: "period", header: "Period", cell: (row) => row.period },
    {
      id: "status",
      header: "Status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      id: "currency",
      header: "Currency",
      cell: (row) => <CurrencyCell currency={row.currency} />,
    },
    { id: "saved", header: "Amount Saved", cell: (row) => row.amountSaved },
    { id: "roi", header: "ROI Earned", cell: (row) => row.roiEarned },
    { id: "break", header: "Break Fee", cell: (row) => row.breakFee },
    { id: "started", header: "Started", cell: (row) => row.started },
    { id: "maturity", header: "Maturity", cell: (row) => row.maturity },
  ];

  return (
    <Card title="Savings Plans" icon={FileValidationIcon}>
      <Tabs
        items={[
          { value: "target", label: "Target Savings" },
          { value: "fixed", label: "Fixed Deposits" },
        ]}
        value={view}
        onValueChange={setView}
        variant="pill"
        className="gap-6"
      >
        <TabPanel value="target">
          <DataTable
            data={user.targetPlans}
            columns={targetColumns}
            getRowId={(row) => row.id}
            minWidth="min-w-5xl"
          />
        </TabPanel>
        <TabPanel value="fixed">
          <DataTable
            data={user.fixedDeposits}
            columns={fixedColumns}
            getRowId={(row) => row.id}
            minWidth="min-w-6xl"
          />
        </TabPanel>
      </Tabs>
    </Card>
  );
}

function KycTab({
  rows,
  onPreview,
}: {
  rows: KycDocument[];
  onPreview: (document: string) => void;
}) {
  const columns: Column<KycDocument>[] = [
    {
      id: "document",
      header: "Document",
      cell: (row) => (
        <span className="flex items-center gap-2">
          <Icon
            icon={FileValidationIcon}
            size={18}
            className="text-grey-400"
          />
          {row.document}
        </span>
      ),
      width: "min-w-48",
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => <StatusBadge status={row.status} />,
    },
    { id: "uploaded", header: "Uploaded", cell: (row) => row.uploaded },
    { id: "reviewed", header: "Reviewed", cell: (row) => row.reviewed },
    {
      id: "action",
      header: "Action",
      cell: (row) =>
        row.viewable ? (
          <button
            type="button"
            onClick={() => onPreview(row.document)}
            className="font-semibold text-grey-900 underline underline-offset-2 hover:text-primary"
          >
            View
          </button>
        ) : (
          <span className="text-grey-300">&ndash;</span>
        ),
    },
  ];

  return (
    <section className="rounded-2xl border border-grey-50 bg-white p-5">
      <DataTable data={rows} columns={columns} getRowId={(row) => row.id} />
    </section>
  );
}

function LoginsTab({ rows }: { rows: LoginRecord[] }) {
  const columns: Column<LoginRecord>[] = [
    {
      id: "timestamp",
      header: "Date & Time",
      cell: (row) => (
        <span className="flex gap-4">
          <span>{row.date}</span>
          <span>{row.time}</span>
        </span>
      ),
      width: "min-w-56",
    },
    { id: "ip", header: "IP Address", cell: (row) => row.ipAddress },
    { id: "device", header: "Device", cell: (row) => row.device },
    { id: "location", header: "Location", cell: (row) => row.location },
  ];

  return (
    <Card title="Login History" icon={Clock01Icon}>
      <DataTable data={rows} columns={columns} getRowId={(row) => row.id} />
    </Card>
  );
}
