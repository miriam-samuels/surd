"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AvatarLabel } from "@/components/ui/avatar-label";
import { Dropdown } from "@/components/ui/dropdown";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { Panel } from "@/components/dashboard/panel";
import { SearchInput } from "@/components/ui/search-input";
import { HniBadge, StatusBadge } from "@/components/dashboard/status-badge";
import { DataTable, type Column } from "@/components/ui/table";
import { ROUTES } from "@/constants/routes";
import { USERS, type UserRecord } from "@/content/users";
import { UserGroupIcon } from "@hugeicons/core-free-icons";

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "suspended", label: "Suspended" },
  { value: "pending", label: "Pending" },
  { value: "closed", label: "Closed" },
];

export default function UsersPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const rows = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    return USERS.filter((user) => {
      const matchesStatus = status === "all" || user.status === status;
      const matchesQuery =
        !trimmed ||
        user.displayName.toLowerCase().includes(trimmed) ||
        user.email.toLowerCase().includes(trimmed) ||
        user.id.toLowerCase().includes(trimmed);
      return matchesStatus && matchesQuery;
    });
  }, [query, status]);

  const columns: Column<UserRecord>[] = [
    { id: "id", header: "User ID", cell: (user) => user.id },
    {
      id: "name",
      header: "Name",
      cell: (user) => (
        <AvatarLabel name={user.displayName} caption={user.email} size="sm" />
      ),
      width: "min-w-56",
    },
    {
      id: "status",
      header: "Status",
      cell: (user) => (
        <span className="flex items-center gap-2">
          <StatusBadge status={user.status} />
          {user.isHni ? <HniBadge /> : null}
        </span>
      ),
    },
    {
      id: "plans",
      header: "Active plans",
      cell: (user) => user.stats.activePlans,
      align: "center",
    },
    {
      id: "withdrawals",
      header: "Total Withdrawals",
      cell: (user) => user.stats.totalWithdrawals,
    },
    { id: "joined", header: "Joined", cell: (user) => user.joined },
  ];

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title="User List" description="All registered Surd accounts" />

      <Panel
        title="All Users"
        icon={UserGroupIcon}
        actions={
          <>
            <SearchInput
              value={query}
              onChange={setQuery}
              className="w-full sm:w-64"
            />
            <Dropdown
              options={STATUS_OPTIONS}
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
            getRowId={(user) => user.id}
            onRowClick={(user) => router.push(ROUTES.users.detail(user.id))}
            emptyState={
              <EmptyState
                icon={UserGroupIcon}
                title="No users match your filters"
                description="Try a different search term or clear the status filter."
              />
            }
          />
        </div>
      </Panel>
    </div>
  );
}
