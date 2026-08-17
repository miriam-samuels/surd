"use client";

import { useMemo, useState } from "react";
import {
  Edit02Icon,
  PlusSignIcon,
  SentIcon,
  UnavailableIcon,
} from "@hugeicons/core-free-icons";
import { Avatar } from "@/components/ui/avatar";
import { AvatarLabel } from "@/components/ui/avatar-label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog } from "@/components/ui/dialog";
import { Dropdown } from "@/components/ui/dropdown";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { DataTable, type Column } from "@/components/ui/table";
import { useToast } from "@/components/ui/toast";
import { useDisclosure } from "@/hooks/use-disclosure";
import {
  ADMIN_ACCOUNTS,
  ADMIN_PERMISSIONS,
  ADMIN_ROLES,
  type AdminAccount,
} from "@/content/configuration";

const ROLE_OPTIONS = ADMIN_ROLES.map((role) => ({ value: role, label: role }));

export default function AdminAccountsPage() {
  const toast = useToast();
  const [query, setQuery] = useState("");
  /* Typed the same as edit so both can share one dialog component. */
  const invite = useDisclosure<AdminAccount>();
  const editRole = useDisclosure<AdminAccount>();
  const suspend = useDisclosure<AdminAccount>();

  const rows = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return ADMIN_ACCOUNTS;
    return ADMIN_ACCOUNTS.filter(
      (admin) =>
        admin.name.toLowerCase().includes(trimmed) ||
        admin.email.toLowerCase().includes(trimmed) ||
        admin.role.toLowerCase().includes(trimmed),
    );
  }, [query]);

  const confirmSuspend = () => {
    suspend.close();
    toast.show({
      tone: "warning",
      message: "Admin Account has been suspended.",
    });
  };

  const columns: Column<AdminAccount>[] = [
    { id: "id", header: "ID", cell: (admin) => admin.id },
    {
      id: "name",
      header: "Name",
      cell: (admin) => (
        <AvatarLabel
          name={admin.name}
          caption={admin.email}
          size="sm"
          className="max-w-48"
        />
      ),
      width: "min-w-56",
    },
    {
      id: "role",
      header: "Role",
      cell: (admin) => <span className="font-semibold">{admin.role}</span>,
    },
    {
      id: "status",
      header: "Status",
      cell: (admin) => <StatusBadge status={admin.status} />,
    },
    { id: "added", header: "Date added", cell: (admin) => admin.dateAdded },
    { id: "login", header: "Last login", cell: (admin) => admin.lastLogin },
    {
      id: "actions",
      header: "Actions",
      cell: (admin) =>
        /* The founding Super Admin cannot be edited or suspended. */
        admin.role === "Super Admin" ? null : (
          <span className="flex items-center gap-2">
            <Button
              variant="soft"
              size="md"
              shape="pill"
              leadingIcon={Edit02Icon}
              onClick={() => editRole.open(admin)}
            >
              Edit role
            </Button>
            <Button
              tone="danger"
              variant="soft"
              size="md"
              shape="pill"
              leadingIcon={UnavailableIcon}
              onClick={() => suspend.open(admin)}
            >
              Suspend
            </Button>
          </span>
        ),
      width: "min-w-64",
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Admin Accounts"
        description="Manage admin users and roles"
        actions={
          <Button
            tone="primary"
            size="xl"
            shape="pill"
            leadingIcon={PlusSignIcon}
            onClick={() => invite.open()}
          >
            Create Admin
          </Button>
        }
      />

      <section className="rounded-2xl border border-grey-50 bg-white p-4 sm:p-5">
        <SearchInput
          value={query}
          onChange={setQuery}
          className="mb-5 w-full sm:w-80"
        />
        <DataTable
          data={rows}
          columns={columns}
          getRowId={(admin) => `${admin.id}-${admin.role}`}
          minWidth="min-w-5xl"
        />
      </section>

      <PermissionsDialog
        control={invite}
        title="Invite admin"
        icon={SentIcon}
        confirmLabel="Send invite"
        withIdentity
        onSave={() => toast.show({ tone: "success", message: "Invite sent." })}
      />

      <PermissionsDialog
        control={editRole}
        title="Edit Admin Role"
        icon={Edit02Icon}
        confirmLabel="Save changes"
        onSave={() => toast.show({ tone: "success", message: "Role updated." })}
      />

      <Dialog
        control={suspend}
        tone="danger"
        title={`Are you sure you want to suspend “${suspend.data?.name ?? ""}”`}
        description="Once suspended, this admin will lose account access and be signed out across all devices."
        confirmLabel="Suspend admin"
        onConfirm={confirmSuspend}
      />
    </div>
  );
}

/**
 * Invite and Edit Role differ only by their heading and whether they collect
 * a name and email, so they share one dialog.
 */
function PermissionsDialog({
  control,
  title,
  icon,
  confirmLabel,
  withIdentity = false,
  onSave,
}: {
  control: ReturnType<typeof useDisclosure<AdminAccount>>;
  title: string;
  icon: typeof Edit02Icon;
  confirmLabel: string;
  withIdentity?: boolean;
  onSave: () => void;
}) {
  const admin = control.data;
  const [role, setRole] = useState<string>(ADMIN_ROLES[1]);
  const [permissions, setPermissions] = useState<string[]>([
    "view-audit-logs",
    "edit-records",
  ]);

  const toggle = (id: string) =>
    setPermissions((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );

  return (
    <Dialog
      control={control}
      title={title}
      icon={icon}
      confirmLabel={confirmLabel}
      onConfirm={() => {
        control.close();
        onSave();
      }}
    >
      {withIdentity ? (
        <>
          <Field label="Full name" htmlFor="admin-name">
            <Input id="admin-name" size="lg" placeholder="e.g. John Doe" />
          </Field>
          <Field label="Email address" htmlFor="admin-email">
            <Input
              id="admin-email"
              type="email"
              size="lg"
              placeholder="example@gmail.com"
            />
          </Field>
        </>
      ) : admin ? (
        <div className="flex items-center gap-4">
          <Avatar name={admin.name} size="xl" />
          <div>
            <p className="text-lg font-bold text-grey-900">{admin.name}</p>
            <p className="text-sm text-grey-500">{admin.email}</p>
          </div>
        </div>
      ) : null}

      <Field label="Role" htmlFor="admin-role">
        <Dropdown
          options={ROLE_OPTIONS}
          value={admin?.role ?? role}
          onChange={setRole}
          className="h-12 w-full rounded-xl border-transparent bg-grey-25"
        />
      </Field>

      <Field label="Permissions">
        <ul className="flex flex-col gap-1 rounded-xl bg-grey-25 p-2">
          {ADMIN_PERMISSIONS.map((permission) => (
            <li key={permission.id}>
              <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm text-grey-900 hover:bg-white">
                {permission.label}
                <Checkbox
                  shape="square"
                  checked={permissions.includes(permission.id)}
                  onCheckedChange={() => toggle(permission.id)}
                />
              </label>
            </li>
          ))}
        </ul>
      </Field>
    </Dialog>
  );
}
