"use client";

import { useMemo, useState } from "react";
import {
  DocumentValidationIcon,
  FileValidationIcon,
  Image01Icon,
  SecurityLockIcon,
  UnavailableIcon,
  UserGroupIcon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { Avatar } from "@/components/ui/avatar";
import { AvatarLabel } from "@/components/ui/avatar-label";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Icon } from "@/components/ui/icon";
import { PageHeader } from "@/components/ui/page-header";
import { Panel } from "@/components/dashboard/panel";
import { SearchInput } from "@/components/ui/search-input";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { DataTable, type Column } from "@/components/ui/table";
import { useDisclosure } from "@/hooks/use-disclosure";
import { KYC_REVIEWS, KYC_SUMMARY, type KycReview } from "@/content/users";

export default function KycPage() {
  const [query, setQuery] = useState("");
  const review = useDisclosure<KycReview>();

  const rows = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return KYC_REVIEWS;
    return KYC_REVIEWS.filter(
      (entry) =>
        entry.name.toLowerCase().includes(trimmed) ||
        entry.userId.toLowerCase().includes(trimmed) ||
        entry.document.toLowerCase().includes(trimmed),
    );
  }, [query]);

  const columns: Column<KycReview>[] = [
    { id: "userId", header: "User ID", cell: (row) => row.userId },
    {
      id: "name",
      header: "Name",
      cell: (row) => (
        <AvatarLabel name={row.name} caption={row.email} size="sm" />
      ),
      width: "min-w-56",
    },
    {
      id: "document",
      header: "Documents",
      cell: (row) => <span className="font-semibold">{row.document}</span>,
    },
    { id: "submitted", header: "Submitted", cell: (row) => row.submitted },
    {
      id: "action",
      header: "",
      align: "right",
      cell: (row) => (
        <Button
          variant="soft"
          size="md"
          shape="pill"
          leadingIcon={ViewIcon}
          onClick={() => review.open(row)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="KYC & Compliance"
        description="Identity verification and account investigations"
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Pending Reviews"
          value={String(KYC_SUMMARY.pendingReviews)}
          icon={DocumentValidationIcon}
          hint="Documents waiting on a decision"
        />
        <StatCard
          label="Closed Accounts"
          value={String(KYC_SUMMARY.closedAccounts)}
          icon={UnavailableIcon}
          hint="Accounts closed after review"
        />
        <StatCard
          label="Stuck Reviews (>SLA)"
          value={String(KYC_SUMMARY.stuckReviews)}
          icon={SecurityLockIcon}
          hint="Reviews past their service-level target"
        />
      </div>

      <Panel
        title="All Pending KYC Reviews"
        icon={UserGroupIcon}
        actions={
          <SearchInput
            value={query}
            onChange={setQuery}
            className="w-full sm:w-72"
          />
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
                icon={DocumentValidationIcon}
                title="No User Pending KYC Account for Review Yet"
                description="No record for a user with pending KYC yet. When a new user matching the criteria has been onboarded, they will automatically appear here."
              />
            }
          />
        </div>
      </Panel>

      <KycReviewDialog control={review} />
    </div>
  );
}

/** Read-only review of one submitted document. */
function KycReviewDialog({
  control,
}: {
  control: ReturnType<typeof useDisclosure<KycReview>>;
}) {
  const entry = control.data;

  return (
    <Dialog
      control={control}
      title="Account KYC Review"
      icon={FileValidationIcon}
      width="md"
    >
      {entry ? (
        <>
          <div className="flex items-center gap-4">
            <Avatar name={entry.name} size="xl" />
            <div>
              <p className="text-xl font-bold text-grey-900">{entry.name}</p>
              <p className="text-sm text-grey-500">{entry.userId}</p>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-5">
            <div>
              <dt className="text-sm text-grey-400">Document Type</dt>
              <dd className="mt-1 font-medium text-grey-900">
                {entry.document}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-grey-400">Submitted</dt>
              <dd className="mt-1 font-medium text-grey-900">
                {entry.submitted}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-grey-400">Status</dt>
              <dd className="mt-1">
                <StatusBadge status={entry.status} />
              </dd>
            </div>
          </dl>

          <div className="flex flex-col gap-3">
            <p className="text-sm text-grey-900">
              {entry.document} (Document Preview)
            </p>
            <div className="grid aspect-[4/3] place-items-center rounded-xl bg-grey-25">
              <Icon icon={Image01Icon} size={28} className="text-grey-300" />
            </div>
          </div>
        </>
      ) : null}
    </Dialog>
  );
}
