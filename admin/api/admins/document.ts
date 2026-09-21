import {
  ADMIN_ACCOUNT_FIELDS,
  ERROR_FRAGMENT,
  PAGINATION_FIELDS,
} from "@/api/fragments";

export const ADMIN_ACCOUNTS_QUERY = `
query AdminAccounts($input: AdminAccountsFilterInput) {
  adminAccounts(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithUsers {
      message
      data {
        ${ADMIN_ACCOUNT_FIELDS}
      }
      ${PAGINATION_FIELDS}
    }
  }
}
`;

export const ADMIN_PORTAL_ROLES_QUERY = `
query AdminPortalRoles {
  adminPortalRoles {
    ${ERROR_FRAGMENT}
    ... on ResponseWithAdminPortalRoles {
      message
      data {
        id
        name
        active
        system
        privileges
      }
    }
  }
}
`;

/*
 * Served from the compiled privilege enum rather than a table, so it cannot
 * drift from what the server enforces. This — not the mockup's four items — is
 * the source of truth for the permissions checklist.
 */
export const ADMIN_PRIVILEGES_QUERY = `
query AdminPrivileges {
  adminPrivileges {
    ${ERROR_FRAGMENT}
    ... on ResponseWithAdminPrivilegeOptions {
      message
      data {
        privilege
        label
        description
      }
    }
  }
}
`;

export const ADMIN_INVITE_ADMIN_MUTATION = `
mutation AdminInviteAdmin($input: AdminInviteAdminInput!) {
  adminInviteAdmin(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithAdminInvite {
      message
      data {
        user_id
        email
        role_name
        expires_at
      }
    }
  }
}
`;

export const ADMIN_UPDATE_ADMIN_ACCOUNT_MUTATION = `
mutation AdminUpdateAdminAccount($input: AdminUpdateAdminAccountInput!) {
  adminUpdateAdminAccount(input: $input) {
    ${ERROR_FRAGMENT}
    ... on Respond {
      message
    }
  }
}
`;

/*
 * Suspend, reactivate, resend and cancel all take `AdminAccountActionInput`
 * and all return `Respond`, so one document shape covers the four of them.
 */
function accountAction(resolver: string, operation: string) {
  return `
mutation ${operation}($input: AdminAccountActionInput!) {
  ${resolver}(input: $input) {
    ${ERROR_FRAGMENT}
    ... on Respond {
      message
    }
  }
}
`;
}

export const ADMIN_SUSPEND_ADMIN_MUTATION = accountAction(
  "adminSuspendAdmin",
  "AdminSuspendAdmin",
);

export const ADMIN_REACTIVATE_ADMIN_MUTATION = accountAction(
  "adminReactivateAdmin",
  "AdminReactivateAdmin",
);

export const ADMIN_RESEND_INVITE_MUTATION = accountAction(
  "adminResendInvite",
  "AdminResendInvite",
);

export const ADMIN_CANCEL_INVITE_MUTATION = accountAction(
  "adminCancelInvite",
  "AdminCancelInvite",
);
