import {
  AdminAccountStatus,
  AdminInviteStatus,
  UserStatus,
  type AdminPrivilege,
} from "@/types/enum";
import type { PageRequest } from "@/types/filters";

export interface AdminAccount {
  id: string;
  firstname: string | null;
  lastname: string | null;
  email: string;
  avatar: string | null;

  /**
   * The account-wide status, so the login gate and session revocation keep
   * working. Suspension lives here, not on `admin_invite`.
   */
  status: UserStatus | string;
  admin_role_id: string | null;
  admin_role_name: string | null;

  /**
   * What is actually enforced. The role's list is a template copied at invite
   * time — editing a role does not change accounts already holding it.
   */
  admin_privileges: AdminPrivilege[];
  admin_invite: AdminInviteStatus | null;

  /** `null` for an admin who has never signed in. */
  admin_last_login_at: string | null;
  created_at: string;
}

export interface AdminPortalRole {
  id: string;
  name: string;
  active: boolean;

  /** Marks Super Admin — bypasses every privilege check. */
  system: boolean;
  privileges: AdminPrivilege[];
}

export interface AdminPrivilegeOption {
  privilege: AdminPrivilege;
  label: string;
  description: string;
}

export interface AdminInvite {
  user_id: string;
  email: string;
  role_name: string;

  /** The link is single-use and valid for 48 hours. */
  expires_at: string;
}

export interface AdminAccountsFilterInput extends PageRequest {
  search?: string;
  role_id?: string;
  status?: AdminAccountStatus;
  paginate?: boolean;
}

export interface AdminInviteAdminInput {
  /** Split into first and last name server-side — send it as typed. */
  full_name: string;
  email: string;
  role_id: string;

  /** Omit to inherit the role's default set. */
  privileges?: AdminPrivilege[];
}

export interface AdminUpdateAdminAccountInput {
  user_id: string;

  /** Required — send the current one if only the checkboxes changed. */
  role_id: string;

  /**
   * Always send from the Edit modal: omitting it after a role change silently
   * resets the account to that role's defaults.
   */
  privileges?: AdminPrivilege[];
}

export interface AdminAccountActionInput {
  user_id: string;
}

export interface AdminRoleInput {
  role_id?: string;
  name?: string;
  privileges?: AdminPrivilege[];
  active?: boolean;
}

/**
 * The badge is two fields, not one.
 *
 * `admin_invite` is checked first: a suspended account that never accepted its
 * invite carries both, and "Pending invite" is the more actionable label.
 *
 * FIXME(api): the integration note spells the suspended value `USER_SUSPEND`
 * while `UserStatus` — inferred, not exported by the schema — says `SUSPENDED`.
 * Both are accepted until the wire value is confirmed.
 */
export function accountStatus(account: AdminAccount): AdminAccountStatus {
  if (account.admin_invite === AdminInviteStatus.Pending) {
    return AdminAccountStatus.PendingInvite;
  }
  if (account.status === UserStatus.Suspended || account.status === "USER_SUSPEND") {
    return AdminAccountStatus.Suspended;
  }
  return AdminAccountStatus.Active;
}
