"use client";

import { useState } from "react";
import {
  CheckmarkCircle02Icon,
  Delete02Icon,
  PencilEdit02Icon,
  PlusSignIcon,
  SentIcon,
  UnavailableIcon,
  UserAdd01Icon,
} from "@hugeicons/core-free-icons";
import {
  useAdminAccounts,
  useAdminCancelInvite,
  useAdminInviteAdmin,
  useAdminPortalRoles,
  useAdminPrivileges,
  useAdminReactivateAdmin,
  useAdminResendInvite,
  useAdminSuspendAdmin,
  useAdminUpdateAdminAccount,
} from "@/api";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog } from "@/components/ui/dialog";
import { Dropdown } from "@/components/ui/dropdown";
import { TableEmptyState } from "@/components/ui/empty-state";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
import {
  TableFilter,
  type FilterGroup,
  type FilterOption,
} from "@/components/ui/table-controls";
import { toast } from "@/components/ui/toast";
import { Can } from "@/components/auth/can";
import { PersonCell } from "@/components/dashboard/person-cell";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { DataTable, type Column } from "@/components/ui/table";
import { useDebounced } from "@/hooks/use-debounced";
import { useTablePage } from "@/hooks/use-pagination";
import { useDisclosure } from "@/hooks/use-disclosure";
import { formatName, formatTimestamp } from "@/lib/format";
import { AdminAccountStatus, type AdminPrivilege } from "@/types/enum";
import { Permission } from "@/types/permission";
import { accountStatus, type AdminAccount } from "@/types/admin-account";

const STATUS_LABELS: Record<AdminAccountStatus, string> = {
  [AdminAccountStatus.Active]: "Active",
  [AdminAccountStatus.PendingInvite]: "Pending invite",
  [AdminAccountStatus.Suspended]: "Suspended",
};

const STATUS_OPTIONS: FilterOption[] = [
  { value: "", label: "All" },
  ...Object.values(AdminAccountStatus).map((status) => ({
    value: status,
    label: STATUS_LABELS[status],
  })),
];

/* The filled, borderless control every field in these modals uses. */
const CONTROL = "h-14 w-full rounded-xl border-transparent bg-grey-25 px-4 text-md";

/*
 * No Sort by, though the blurred frames behind the modals show one:
 * `AdminAccountsFilterInput` takes no sort field, so the control would have
 * nothing to send. Filter maps onto its `status` and `role_id`.
 */

export default function AdminAccountsPage() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string | undefined>>({});
  const { page, setPage, pageSize, setPageSize } = useTablePage();

  const invite = useDisclosure<void>();
  const editRole = useDisclosure<AdminAccount>();
  const suspend = useDisclosure<AdminAccount>();
  const reactivate = useDisclosure<AdminAccount>();
  const cancelInvite = useDisclosure<AdminAccount>();

  const search = useDebounced(query);

  const { data, isLoading } = useAdminAccounts({
    search: search || undefined,
    status: (filters.status || undefined) as AdminAccountStatus | undefined,
    role_id: filters.role || undefined,
    page,
    limit: pageSize,
  });

  const { data: roles } = useAdminPortalRoles();
  const resendInvite = useAdminResendInvite();

  /* Super Admin rows carry no actions, as in the design. The server would
     refuse suspending the last one anyway; hiding the controls stops an admin
     reaching for a lockout guard to find out. */
  const systemRoles = new Set(
    (roles?.data ?? []).filter((role) => role.system).map((role) => role.id),
  );

  const filterGroups: FilterGroup[] = [
    { id: "status", label: "Status", options: STATUS_OPTIONS },
    {
      id: "role",
      label: "Role",
      options: [
        { value: "", label: "All" },
        ...(roles?.data ?? []).map((role) => ({ value: role.id, label: role.name })),
      ],
    },
  ];

  /* A narrowed result set starts back at page one. */
  const reset =
    <T,>(setter: (value: T) => void) =>
    (value: T) => {
      setter(value);
      setPage(1);
    };

  const columns: Column<AdminAccount>[] = [
    {
      id: "name",
      header: "Name",
      cell: (admin) => (
        <PersonCell
          name={formatName(admin)}
          email={admin.email}
          avatar={admin.avatar}
        />
      ),
      width: "min-w-56",
    },
    {
      id: "role",
      header: "Role",
      cell: (admin) => (
        <span className="font-semibold text-grey-900">{admin.admin_role_name ?? "—"}</span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (admin) => <StatusBadge status={STATUS_LABELS[accountStatus(admin)]} />,
    },
    {
      id: "added",
      header: "Date added",
      cell: (admin) => formatTimestamp(admin.created_at),
    },
    {
      id: "login",
      header: "Last login",
      /* Null for an admin who has never signed in — a dash, not the epoch. */
      cell: (admin) => formatTimestamp(admin.admin_last_login_at),
    },
    {
      id: "actions",
      header: "Actions",
      cell: (admin) => {
        const status = accountStatus(admin);
        if (admin.admin_role_id && systemRoles.has(admin.admin_role_id)) return null;

        return (
          /* The server enforces ADMIN_ONBOARDING regardless; hiding the
             controls just stops the click that was always going to 403. */
          <Can do={Permission.AdminsManage}>
            <span className="flex items-center gap-2">
              {status === AdminAccountStatus.PendingInvite ? (
                <>
                  <Button
                    variant="soft"
                    size="md"
                    shape="pill"
                    leadingIcon={SentIcon}
                    disabled={resendInvite.isPending}
                    onClick={() => resendInvite.mutate({ user_id: admin.id })}
                  >
                    Resend
                  </Button>
                  <Button
                    tone="danger"
                    variant="soft"
                    size="md"
                    shape="pill"
                    leadingIcon={Delete02Icon}
                    onClick={() => cancelInvite.open(admin)}
                  >
                    Cancel invite
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="soft"
                    size="md"
                    shape="pill"
                    leadingIcon={PencilEdit02Icon}
                    onClick={() => editRole.open(admin)}
                  >
                    Edit role
                  </Button>

                  {status === AdminAccountStatus.Suspended ? (
                    /* Without this a suspension is irreversible from the UI —
                       the mockup has no control for it. */
                    <Button
                      tone="success"
                      variant="soft"
                      size="md"
                      shape="pill"
                      leadingIcon={CheckmarkCircle02Icon}
                      onClick={() => reactivate.open(admin)}
                    >
                      Reactivate
                    </Button>
                  ) : (
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
                  )}
                </>
              )}
            </span>
          </Can>
        );
      },
      width: "min-w-64",
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Admin Accounts"
        description="Manage admin users and roles"
        actions={
          <Can do={Permission.AdminsManage}>
            <Button
              tone="primary"
              size="xl"
              shape="pill"
              leadingIcon={PlusSignIcon}
              onClick={() => invite.open()}
            >
              Create Admin
            </Button>
          </Can>
        }
      />

      <section className="flex flex-col gap-6 rounded-2xl border border-grey-50 bg-white p-4 sm:p-7">
        <div className="flex justify-between items-center gap-3">
          <SearchInput
            value={query}
            onChange={reset(setQuery)}
            placeholder="Search..."
            className="w-full sm:w-96"
          />
          <TableFilter
            groups={filterGroups}
            value={filters}
            onChange={reset(setFilters)}
          />
        </div>

        <DataTable
          data={data?.data ?? []}
          columns={columns}
          getRowId={(admin) => admin.id}
          isLoading={isLoading}
          minWidth="min-w-5xl"
          pagination={{
            mode: "server",
            page,
            pageSize,
            totalItems: data?.pagination?.total ?? 0,
            onPageChange: setPage,
            onPageSizeChange: setPageSize,
          }}
          emptyState={
            <TableEmptyState
              query={search}
              onClearSearch={() => reset(setQuery)("")}
              title="No admin accounts"
              description="Invite an admin to give them access to the portal."
            />
          }
        />
      </section>

      {invite.isOpen ? <InviteAdminDialog control={invite} /> : null}

      {editRole.isOpen && editRole.data ? (
        <EditRoleDialog control={editRole} admin={editRole.data} />
      ) : null}

      <SuspendDialog control={suspend} />
      <ReactivateDialog control={reactivate} />
      <CancelInviteDialog control={cancelInvite} />
    </div>
  );
}

/**
 * The role dropdown and the permissions checklist, shared by both modals.
 *
 * `adminPrivileges` drives the checklist rather than the mockup's four items:
 * it is served from the compiled enum, so it cannot drift from what the server
 * enforces, and two of the mockup's entries are not privileges at all.
 */
function useRoleForm(initialRoleId: string, initialPrivileges: AdminPrivilege[]) {
  const [roleId, setRoleId] = useState(initialRoleId);
  const [privileges, setPrivileges] = useState(initialPrivileges);

  const { data: roles } = useAdminPortalRoles();
  const { data: options } = useAdminPrivileges();

  const all = roles?.data ?? [];

  /* Picking a role loads that role's template into the checklist. The list is
   * a starting point copied at invite time, not a live link to the role. */
  const selectRole = (next: string) => {
    setRoleId(next);
    setPrivileges(all.find((role) => role.id === next)?.privileges ?? []);
  };

  const toggle = (privilege: AdminPrivilege) =>
    setPrivileges((current) =>
      current.includes(privilege)
        ? current.filter((item) => item !== privilege)
        : [...current, privilege],
    );

  return {
    roleId,
    selectRole,
    role: all.find((item) => item.id === roleId),
    privileges,
    toggle,
    /* Assignment offers active roles only; inactive ones still come back. */
    roleOptions: all
      .filter((item) => item.active)
      .map((item) => ({ value: item.id, label: item.name })),
    privilegeOptions: options?.data ?? [],
  };
}

function RoleFields({
  form,
  placeholder = "Select a role",
}: {
  form: ReturnType<typeof useRoleForm>;
  placeholder?: string;
}) {
  /* Super Admin bypasses every privilege check, so ticking boxes for it would
   * be theatre. Disable the list and say why. */
  const isSystemRole = form.role?.system ?? false;

  return (
    <>
      <Field label="Role" htmlFor="admin-role">
        <Dropdown
          options={form.roleOptions}
          value={form.roleId}
          onChange={form.selectRole}
          placeholder={placeholder}
          className={CONTROL}
        />
      </Field>

      <Field
        label="Permissions"
        hint={
          isSystemRole
            ? "Super Admin holds every privilege by design — this list does not apply."
            : undefined
        }
      >
        {/* The label alone, as the design shows; the server's description
            rides along as a tooltip rather than being dropped. */}
        <ul className="flex flex-col rounded-xl bg-grey-25 px-5 py-2">
          {form.privilegeOptions.map((option) => (
            <li key={option.privilege}>
              <label
                title={option.description}
                className="flex cursor-pointer items-center justify-between gap-3 py-3"
              >
                <span className="text-sm text-grey-900">{option.label}</span>
                <Checkbox
                  shape="square"
                  disabled={isSystemRole}
                  checked={form.privileges.includes(option.privilege)}
                  onCheckedChange={() => form.toggle(option.privilege)}
                />
              </label>
            </li>
          ))}
        </ul>
      </Field>
    </>
  );
}

function InviteAdminDialog({
  control,
}: {
  control: ReturnType<typeof useDisclosure<void>>;
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const form = useRoleForm("", []);

  const invite = useAdminInviteAdmin({
    /* The expiry goes in the toast — the invite link is single-use and lives
     * 48 hours, which the inviter needs to know. */
    onSuccess: (response) => {
      toast({
        tone: "success",
        message: response.data?.expires_at
          ? `Invite sent to ${response.data.email}. The link expires ${formatTimestamp(response.data.expires_at)}.`
          : (response.message ?? "Invite sent."),
      });
      control.close();
    },
  });

  const incomplete = !fullName.trim() || !email.trim() || !form.roleId;

  return (
    <Dialog
      control={control}
      title="Invite admin"
      icon={UserAdd01Icon}
      width="lg"
      confirmLabel="Send invite"
      confirmIcon={SentIcon}
      confirmDisabled={incomplete}
      isSubmitting={invite.isPending}
      onConfirm={() =>
        invite.mutate({
          full_name: fullName.trim(),
          email: email.trim(),
          role_id: form.roleId,
          /* Omitted when nothing was ticked, so the account inherits the
             role's own set rather than being invited with none. */
          privileges: form.privileges.length ? form.privileges : undefined,
        })
      }
    >
      <Field label="Full name" htmlFor="admin-name">
        <Input
          id="admin-name"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          placeholder="e.g. John Doe"
          className="rounded-xl text-md"
        />
      </Field>

      <Field label="Email address" htmlFor="admin-email">
        <Input
          id="admin-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="example@gmail.com"
          className="rounded-xl text-md"
        />
      </Field>

      <RoleFields form={form} placeholder="Admin" />
    </Dialog>
  );
}

function EditRoleDialog({
  control,
  admin,
}: {
  control: ReturnType<typeof useDisclosure<AdminAccount>>;
  admin: AdminAccount;
}) {
  const form = useRoleForm(admin.admin_role_id ?? "", admin.admin_privileges ?? []);
  const save = useAdminUpdateAdminAccount({ onSuccess: control.close });

  return (
    <Dialog
      control={control}
      title="Edit Admin Role"
      icon={PencilEdit02Icon}
      width="lg"
      confirmLabel="Save changes"
      confirmDisabled={!form.roleId}
      isSubmitting={save.isPending}
      onConfirm={() =>
        save.mutate({
          user_id: admin.id,
          role_id: form.roleId,
          /* Always sent: omitting it after a role change silently resets the
             account to that role's defaults. */
          privileges: form.privileges,
        })
      }
    >
      <div className="flex items-center gap-4">
        <Avatar name={formatName(admin)} src={admin.avatar ?? undefined} size="xl" />
        <div className="flex min-w-0 flex-col gap-1">
          <p className="truncate text-lg font-medium text-grey-900">{formatName(admin)}</p>
          <p className="truncate text-md text-grey-600">{admin.email}</p>
        </div>
      </div>

      <RoleFields form={form} />
    </Dialog>
  );
}

/*
 * The three destructive actions each get a confirmation. Suspend says out loud
 * that it revokes every session, because that is the part an admin does not
 * expect. A refused action — the last-super-admin lockout guard — surfaces the
 * server's own message, which names the reason; the factory's error toast
 * already does that, so nothing is caught here.
 */
function SuspendDialog({
  control,
}: {
  control: ReturnType<typeof useDisclosure<AdminAccount>>;
}) {
  const admin = control.data;
  const suspend = useAdminSuspendAdmin({
    onSuccess: () => {
      toast({ tone: "warning", message: "Admin Account has been suspended." });
      control.close();
    },
  });

  return (
    <Dialog
      control={control}
      tone="danger"
      width="lg"
      title={
        <>
          Are you sure you want to suspend
          <span className="block text-grey-600">
            “{admin ? formatName(admin) : "this admin"}”
          </span>
        </>
      }
      description="Once suspended, this admin will lose account access and be signed out across all devices."
      confirmLabel="Suspend admin"
      isSubmitting={suspend.isPending}
      onConfirm={() => admin && suspend.mutate({ user_id: admin.id })}
    />
  );
}

function ReactivateDialog({
  control,
}: {
  control: ReturnType<typeof useDisclosure<AdminAccount>>;
}) {
  const admin = control.data;
  const reactivate = useAdminReactivateAdmin({ onSuccess: control.close });

  return (
    <Dialog
      control={control}
      tone="warning"
      title={`Reactivate ${admin ? formatName(admin) : "this admin"}?`}
      description="They regain portal access with the privileges their account already holds."
      confirmLabel="Reactivate admin"
      isSubmitting={reactivate.isPending}
      onConfirm={() => admin && reactivate.mutate({ user_id: admin.id })}
    />
  );
}

function CancelInviteDialog({
  control,
}: {
  control: ReturnType<typeof useDisclosure<AdminAccount>>;
}) {
  const admin = control.data;
  const cancel = useAdminCancelInvite({ onSuccess: control.close });

  return (
    <Dialog
      control={control}
      tone="danger"
      title={`Cancel the invite for ${admin?.email ?? "this admin"}?`}
      description="The link stops working straight away. You can invite them again afterwards."
      confirmLabel="Cancel invite"
      cancelLabel="Keep invite"
      isSubmitting={cancel.isPending}
      onConfirm={() => admin && cancel.mutate({ user_id: admin.id })}
    />
  );
}
