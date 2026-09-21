"use client";

import { useState } from "react";
import {
  CheckmarkCircle02Icon,
  Delete02Icon,
  Edit02Icon,
  PlusSignIcon,
  SentIcon,
  UnavailableIcon,
  UserGroupIcon,
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
import { EmptyState } from "@/components/ui/empty-state";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { SearchInput } from "@/components/ui/search-input";
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

export default function AdminAccountsPage() {
  const [query, setQuery] = useState("");
  const { page, setPage, pageSize, setPageSize } = useTablePage();

  const invite = useDisclosure<void>();
  const editRole = useDisclosure<AdminAccount>();
  const suspend = useDisclosure<AdminAccount>();
  const reactivate = useDisclosure<AdminAccount>();
  const cancelInvite = useDisclosure<AdminAccount>();

  const search = useDebounced(query);

  const { data, isLoading } = useAdminAccounts({
    search: search || undefined,
    page,
    limit: pageSize,
  });

  const resendInvite = useAdminResendInvite();

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
        <span className="font-semibold">{admin.admin_role_name ?? "—"}</span>
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

        return (
          /* The server enforces ADMIN_ONBOARDING regardless; hiding the
             controls just stops the click that was always going to 403. */
          <Can do={Permission.AdminsManage}>
            <span className="flex flex-wrap items-center gap-2">
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
                    leadingIcon={Edit02Icon}
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
      width: "min-w-72",
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

      <section className="rounded-2xl border border-grey-50 bg-white p-4 sm:p-5">
        <SearchInput
          value={query}
          onChange={(next) => {
            setQuery(next);
            setPage(1);
          }}
          placeholder="Search name or email"
          className="mb-5 w-full sm:w-80"
        />

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
            <EmptyState
              icon={UserGroupIcon}
              title="No admin accounts"
              description={
                search
                  ? "No admin matches that search."
                  : "Invite an admin to give them access to the portal."
              }
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

function RoleFields({ form }: { form: ReturnType<typeof useRoleForm> }) {
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
          placeholder="Select a role"
          className="h-12 w-full rounded-xl border-transparent bg-grey-25"
        />
      </Field>

      <Field
        label="Permissions"
        hint={
          isSystemRole
            ? "Super Admin holds every privilege by design — this list does not apply."
            : "Defaults come from the role. Tick only what should differ."
        }
      >
        <ul className="flex flex-col gap-1 rounded-xl bg-grey-25 p-2">
          {form.privilegeOptions.map((option) => (
            <li key={option.privilege}>
              <label className="flex cursor-pointer items-start justify-between gap-3 rounded-lg px-3 py-2.5 hover:bg-white">
                <span className="flex flex-col">
                  <span className="text-sm text-grey-900">{option.label}</span>
                  <span className="text-xs text-grey-500">{option.description}</span>
                </span>
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
    /* Silent so the expiry can go in the toast — the invite link is
     * single-use and lives 48 hours, which the inviter needs to know. */
    silent: true,
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
      icon={SentIcon}
      confirmLabel="Send invite"
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
        />
      </Field>

      <Field label="Email address" htmlFor="admin-email">
        <Input
          id="admin-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="example@gmail.com"
        />
      </Field>

      <RoleFields form={form} />
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
      icon={Edit02Icon}
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
        <div>
          <p className="text-lg font-bold text-grey-900">{formatName(admin)}</p>
          <p className="text-sm text-grey-500">{admin.email}</p>
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
  const suspend = useAdminSuspendAdmin({ onSuccess: control.close });

  return (
    <Dialog
      control={control}
      tone="danger"
      title={`Suspend ${admin ? formatName(admin) : "this admin"}?`}
      description="They lose portal access immediately and are signed out on every device. You can reactivate them later."
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
