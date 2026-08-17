"use client";

import { useMemo, useState } from "react";
import {
  ComputerIcon,
  LaptopIcon,
  Settings02Icon,
  Task01Icon,
  UserGroupIcon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import { Avatar } from "@/components/ui/avatar";
import { AvatarLabel } from "@/components/ui/avatar-label";
import { FilterChip, MultiDropdown } from "@/components/ui/dropdown";
import { EmptyState } from "@/components/ui/empty-state";
import { Icon, type IconSvgElement } from "@/components/ui/icon";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { DataTable, type Column } from "@/components/ui/table";
import {
  AUDIT_ENTRIES,
  AUDIT_MODULES,
  type AuditEntry,
} from "@/content/configuration";

const MODULE_ICONS: Record<string, IconSvgElement> = {
  Finance: Wallet01Icon,
  Users: UserGroupIcon,
  Configurations: Settings02Icon,
  Settings: Settings02Icon,
};

const MODULE_OPTIONS = AUDIT_MODULES.map((module) => ({
  value: module,
  label: module,
  icon: (
    <Icon icon={MODULE_ICONS[module]} size={16} className="text-grey-400" />
  ),
}));

/** One option per distinct admin who appears in the log. */
const ADMIN_OPTIONS = Array.from(
  new Map(
    AUDIT_ENTRIES.map((entry) => [
      entry.admin.email,
      {
        value: entry.admin.email,
        label: entry.admin.name,
        icon: <Avatar name={entry.admin.name} size="xs" />,
      },
    ]),
  ).values(),
);

/**
 * Every administrative action, filterable by module and by admin.
 *
 * Selecting nothing means "no filter"; once a filter is applied the trigger
 * collapses into a removable chip, matching the design.
 */
export default function AuditLogsPage() {
  const [query, setQuery] = useState("");
  const [modules, setModules] = useState<string[]>([]);
  const [admins, setAdmins] = useState<string[]>([]);

  const rows = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    return AUDIT_ENTRIES.filter((entry) => {
      const matchesModule =
        modules.length === 0 || modules.includes(entry.module);
      const matchesAdmin =
        admins.length === 0 || admins.includes(entry.admin.email);
      const matchesQuery =
        !trimmed ||
        entry.action.toLowerCase().includes(trimmed) ||
        entry.admin.name.toLowerCase().includes(trimmed);
      return matchesModule && matchesAdmin && matchesQuery;
    });
  }, [query, modules, admins]);

  const columns: Column<AuditEntry>[] = [
    {
      id: "timestamp",
      header: "Timestamp",
      cell: (row) => row.timestamp,
      width: "min-w-40",
    },
    {
      id: "admin",
      header: "Admin",
      cell: (row) => (
        <AvatarLabel
          name={row.admin.name}
          caption={row.admin.email}
          size="sm"
          className="max-w-44"
        />
      ),
      width: "min-w-52",
    },
    { id: "module", header: "Module", cell: (row) => row.module },
    {
      id: "action",
      header: "Action",
      cell: (row) => <span className="block max-w-64">{row.action}</span>,
      width: "min-w-64",
    },
    { id: "ip", header: "IP Address", cell: (row) => row.ipAddress },
    {
      id: "device",
      header: "Device",
      cell: (row) => (
        <span className="flex items-center gap-2">
          <Icon
            icon={row.device.startsWith("Windows") ? ComputerIcon : LaptopIcon}
            size={18}
            className="shrink-0 text-grey-400"
          />
          <span className="flex flex-col">
            <span className="font-medium">{row.device}</span>
            <span className="text-xs text-grey-400">{row.browser}</span>
          </span>
        </span>
      ),
      width: "min-w-52",
    },
  ];

  const hasFilters = modules.length > 0 || admins.length > 0;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Audit Logs"
        description="Complete history of every administrative action across the platform"
      />

      <section className="rounded-2xl border border-grey-50 bg-white p-4 sm:p-5">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <SearchInput
            value={query}
            onChange={setQuery}
            className="w-full sm:w-80"
          />

          {/* Applied filters replace their trigger with a removable chip. */}
          {modules.length > 0 ? (
            <FilterChip
              label={
                modules.length === 1 ? modules[0] : `${modules.length} Modules`
              }
              onRemove={() => setModules([])}
            />
          ) : (
            <MultiDropdown
              options={MODULE_OPTIONS}
              value={modules}
              onChange={setModules}
              label="All modules"
            />
          )}

          {admins.length > 0 ? (
            <FilterChip
              label={
                admins.length === 1
                  ? (ADMIN_OPTIONS.find((option) => option.value === admins[0])
                      ?.label ?? "Admin")
                  : `${admins.length} Admins`
              }
              icon={<Avatar name="Admin" size="xs" />}
              onRemove={() => setAdmins([])}
            />
          ) : (
            <MultiDropdown
              options={ADMIN_OPTIONS}
              value={admins}
              onChange={setAdmins}
              label="All admins"
              searchable
              searchPlaceholder="Search admin"
            />
          )}
        </div>

        <DataTable
          data={rows}
          columns={columns}
          getRowId={(row) => row.id}
          minWidth="min-w-6xl"
          emptyState={
            <EmptyState
              icon={Task01Icon}
              title="No matching activity"
              description={
                hasFilters
                  ? "No actions match the filters you applied. Try clearing one."
                  : "Administrative actions will appear here as they happen."
              }
            />
          }
        />
      </section>
    </div>
  );
}
