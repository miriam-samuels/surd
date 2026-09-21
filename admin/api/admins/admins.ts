"use client";

import { createMutation, createQuery } from "@/api/factory";
import {
  ADMIN_ACCOUNTS_QUERY,
  ADMIN_CANCEL_INVITE_MUTATION,
  ADMIN_INVITE_ADMIN_MUTATION,
  ADMIN_PORTAL_ROLES_QUERY,
  ADMIN_PRIVILEGES_QUERY,
  ADMIN_REACTIVATE_ADMIN_MUTATION,
  ADMIN_RESEND_INVITE_MUTATION,
  ADMIN_SUSPEND_ADMIN_MUTATION,
  ADMIN_UPDATE_ADMIN_ACCOUNT_MUTATION,
} from "@/api/admins/document";
import type {
  AdminAccount,
  AdminAccountActionInput,
  AdminAccountsFilterInput,
  AdminInvite,
  AdminInviteAdminInput,
  AdminPortalRole,
  AdminPrivilegeOption,
  AdminUpdateAdminAccountInput,
} from "@/types/admin-account";

export const useAdminAccounts = createQuery<
  AdminAccount[],
  AdminAccountsFilterInput
>({
  resolver: "adminAccounts",
  document: ADMIN_ACCOUNTS_QUERY,
  scope: "admins",
  paginated: true,
});

/* Neither of these changes per row — both modals read one cached copy. */
export const useAdminPortalRoles = createQuery<AdminPortalRole[]>({
  resolver: "adminPortalRoles",
  document: ADMIN_PORTAL_ROLES_QUERY,
  scope: "admins",
  staleTime: 5 * 60_000,
});

export const useAdminPrivileges = createQuery<AdminPrivilegeOption[]>({
  resolver: "adminPrivileges",
  document: ADMIN_PRIVILEGES_QUERY,
  scope: "admins",
  staleTime: 5 * 60_000,
});

export const useAdminInviteAdmin = createMutation<
  AdminInvite,
  AdminInviteAdminInput
>({
  resolver: "adminInviteAdmin",
  document: ADMIN_INVITE_ADMIN_MUTATION,
  invalidates: ["admins", "audit"],
});

export const useAdminUpdateAdminAccount = createMutation<
  never,
  AdminUpdateAdminAccountInput
>({
  resolver: "adminUpdateAdminAccount",
  document: ADMIN_UPDATE_ADMIN_ACCOUNT_MUTATION,
  success: "Admin role updated.",
  invalidates: ["admins", "audit"],
});

/*
 * Suspending revokes every session, so the admin is signed out on all devices
 * immediately — the confirmation modal says so before this fires.
 */
export const useAdminSuspendAdmin = createMutation<never, AdminAccountActionInput>({
  resolver: "adminSuspendAdmin",
  document: ADMIN_SUSPEND_ADMIN_MUTATION,
  success: "Admin account suspended.",
  invalidates: ["admins", "audit"],
});

export const useAdminReactivateAdmin = createMutation<never, AdminAccountActionInput>({
  resolver: "adminReactivateAdmin",
  document: ADMIN_REACTIVATE_ADMIN_MUTATION,
  success: "Admin account reactivated.",
  invalidates: ["admins", "audit"],
});

export const useAdminResendInvite = createMutation<never, AdminAccountActionInput>({
  resolver: "adminResendInvite",
  document: ADMIN_RESEND_INVITE_MUTATION,
  success: "Invite resent.",
  invalidates: ["admins", "audit"],
});

export const useAdminCancelInvite = createMutation<never, AdminAccountActionInput>({
  resolver: "adminCancelInvite",
  document: ADMIN_CANCEL_INVITE_MUTATION,
  success: "Invite cancelled.",
  invalidates: ["admins", "audit"],
});
