# Admin Accounts — Frontend Integration

**Page:** Settings → Admin Accounts
**Purpose:** who can get into the admin portal, what they may do, and their invite state.

---

## Endpoints

| What | Operation | Type |
|---|---|---|
| The table | `adminAccounts(input: AdminAccountsFilterInput)` | query |
| Role dropdown | `adminPortalRoles` | query |
| Permissions checklist | `adminPrivileges` | query |
| Invite admin modal | `adminInviteAdmin(input: AdminInviteAdminInput!)` | mutation |
| Edit Admin Role modal | `adminUpdateAdminAccount(input: AdminUpdateAdminAccountInput!)` | mutation |
| Suspend | `adminSuspendAdmin(input: AdminAccountActionInput!)` | mutation |
| Un-suspend | `adminReactivateAdmin(input: AdminAccountActionInput!)` | mutation |
| Resend invite | `adminResendInvite(input: AdminAccountActionInput!)` | mutation |
| Cancel invite | `adminCancelInvite(input: AdminAccountActionInput!)` | mutation |

**Every mutation requires `ADMIN_ONBOARDING`.** Reads do not. Hide the Create
Admin button and the row actions for admins without it rather than letting the
call fail — but note the server enforces it regardless.

Role management (`adminCreateRole`, `adminUpdateRole`, `adminActivateRole`,
`adminDeactivateRole`) is covered at the end; the mockup has no screen for it.

---

## 1. The table

```graphql
query AdminAccounts($input: AdminAccountsFilterInput) {
  adminAccounts(input: $input) {
    ... on ResponseWithUsers {
      message
      data {
        id
        firstname
        lastname
        email
        avatar
        status
        admin_role_id
        admin_role_name
        admin_privileges
        admin_invite
        admin_last_login_at
        created_at
      }
      pagination { page limit pages total }
    }
    ... on Error { message code status }
  }
}
```

```json
{ "input": { "search": null, "role_id": null, "status": null, "limit": 20, "page": 1, "paginate": true } }
```

| Field | Type | Notes |
|---|---|---|
| `search` | `String` | Matches the admin's name or email. |
| `role_id` | `ID` | Filter to one role. |
| `status` | `EAdminAccountStatus` | `ACTIVE` · `PENDING_INVITE` · `SUSPENDED`. |
| `limit` / `page` / `paginate` | | `page` is 1-based; `paginate: false` returns `pagination: null`. |

### Rendering the columns

| Column | Field |
|---|---|
| ID | `id` |
| Name | `firstname` + `lastname`, `email`, `avatar` |
| Role | `admin_role_name` |
| Status | see below |
| Date added | `created_at` |
| Last login | `admin_last_login_at` |
| Actions | Edit role · Suspend |

### ⚠️ Status is two fields, not one

The badge has three states but there is no single status field:

```ts
const badge =
  user.admin_invite === 'PENDING'   ? 'Pending invite' :
  user.status === 'USER_SUSPEND'    ? 'Suspended'      :
                                      'Active'
```

Check `admin_invite` **first**. A suspended account that never accepted its
invite has both, and "Pending invite" is the more actionable label.

This is deliberate on the backend: suspension lives on `users.status` like every
other account, so the login gate and session revocation keep working. It is not
an invite state.

`admin_last_login_at` is `null` for an admin who has never signed in — render a
dash, not the epoch.

---

## 2. Role dropdown and permissions checklist

Both modals need these. Fetch once and cache; neither changes per row.

```graphql
query RolesAndPrivileges {
  adminPortalRoles {
    ... on ResponseWithAdminPortalRoles {
      data { id name active system privileges }
    }
    ... on Error { message code status }
  }
  adminPrivileges {
    ... on ResponseWithAdminPrivilegeOptions {
      data { privilege label description }
    }
    ... on Error { message code status }
  }
}
```

**`adminPrivileges` is the source of truth for the checklist.** It is served from
the compiled privilege enum — not a database table — so it cannot drift from what
the server actually enforces, and it needs no seeding. Render `label` as the
checkbox text and `description` as help text; never print the raw
`SCREAMING_CASE` value.

Ten privileges exist:

```
USER_MANAGEMENT  KYC_COMPLIANCE  TRANSACTION_MANAGEMENT  PRODUCT_CONFIGURATION
TREASURY_MANAGEMENT  PLATFORM_SETTINGS  ADMIN_ONBOARDING  VIEW_AUDIT_LOGS
EXPORT_REPORTS  CONTENT_MARKETING
```

> **The mockup shows four** — View Audit Logs, Edit Records, Export Reports,
> Override Limits. Only two of those exist; `EDIT_RECORDS` and `OVERRIDE_LIMITS`
> are not privileges. Drive the checklist off `adminPrivileges` rather than
> hard-coding the mockup's list, and confirm with design that it was
> illustrative.

### Filtering the role dropdown

`adminPortalRoles` returns every role including inactive ones. For an
assignment dropdown, show only `active: true`.

`system: true` marks **Super Admin**. Accounts holding it bypass every privilege
check, so the permissions checklist is meaningless for them — disable it and show
a note when that role is selected.

---

## 3. Invite admin

```graphql
mutation InviteAdmin($input: AdminInviteAdminInput!) {
  adminInviteAdmin(input: $input) {
    ... on ResponseWithAdminInvite {
      message
      data { user_id email role_name expires_at }
    }
    ... on Error { message code status }
  }
}
```

```json
{
  "input": {
    "full_name": "John Doe",
    "email": "john@example.com",
    "role_id": "<role id>",
    "privileges": ["VIEW_AUDIT_LOGS", "EXPORT_REPORTS"]
  }
}
```

`full_name` is split into first and last name server-side — send it as typed.

**`privileges` is optional.** Omit it and the account inherits the role's default
set. Send it only when the admin ticked something different from the role
default; that is what the checkboxes are for, and sending the role's own list
back is harmless but pointless.

The response carries `expires_at` — the invite link is **single-use and valid for
48 hours**. Worth surfacing in the success toast so the inviter knows to follow up.

The new row appears immediately with status **Pending invite**.

---

## 4. Edit Admin Role

```graphql
mutation UpdateAdminAccount($input: AdminUpdateAdminAccountInput!) {
  adminUpdateAdminAccount(input: $input) {
    ... on Respond { message }
    ... on Error { message code status }
  }
}
```

```json
{
  "input": {
    "user_id": "<user id>",
    "role_id": "<role id>",
    "privileges": ["VIEW_AUDIT_LOGS", "EDIT_RECORDS"]
  }
}
```

`role_id` is **required** — send the current one if only the checkboxes changed.
`privileges` is optional and defaults to the new role's set when omitted, so
**always send it** from the Edit modal: omitting it after a role change silently
resets the checkboxes to that role's defaults.

Returns `Respond` (message only). Refetch the table afterwards.

---

## 5. Suspend, reactivate, and invite actions

All four take the same input:

```json
{ "input": { "user_id": "<user id>" } }
```

| Mutation | Effect |
|---|---|
| `adminSuspendAdmin` | Sets `USER_SUSPEND` **and revokes every session** — the admin is signed out on all devices immediately, as the confirmation modal says. |
| `adminReactivateAdmin` | Returns them to `ACTIVE`. The mockup has no control for this; without one a suspension is irreversible from the UI. |
| `adminResendInvite` | New 48h link. Only valid while `admin_invite = PENDING`. |
| `adminCancelInvite` | Withdraws a pending invite. |

All return `Respond`.

### ⚠️ You cannot suspend the last super admin

The server refuses any suspend or role change that would leave **zero active
holders of a system role**, returning a `400`. This is a lockout guard, not a
bug — surface `Error.message` rather than a generic failure, because it tells
the admin exactly why the action was refused.

Expect the same refusal when moving the only Super Admin to a lesser role.

---

## 6. Role management (no screen in the mockup)

| Mutation | Input |
|---|---|
| `adminCreateRole` | `name: String!`, `privileges: [EAdminPrivilege!]!` |
| `adminUpdateRole` | `role_id: ID!`, `name: String!`, `privileges: [EAdminPrivilege!]!`, `active: Boolean!` |
| `adminActivateRole` | `role_id: ID!` |
| `adminDeactivateRole` | `role_id: ID!` |

All require `ADMIN_ONBOARDING`. **System roles cannot be edited or deactivated** —
attempts return an error.

Deactivating a role does not affect admins who already hold it; it only stops the
role being assigned to anyone new.

---

## Behaviour worth knowing

**Super Admin is re-synced on every boot.** The system role is created if
missing and its privileges reset to the full compiled set each time the service
starts, so a privilege added in code is held by every super admin as soon as the
deploy lands. Nothing to seed and nothing to tick by hand.

**Every action is audited**, successes and failures alike, under the
`ADMIN_ACCOUNTS` module. A refused suspend is visible in Audit Logs.

**Privileges on the account, not the role, are what get enforced.** The role's
list is a template copied at invite time. Editing a role does **not** retroactively
change accounts already holding it — change those through
`adminUpdateAdminAccount`.

---

## Error handling

Every response is a union. Spread both branches:

```graphql
... on ResponseWithUsers { ... }
... on Error { message code status }
```

| Status | Meaning |
|---|---|
| `400` | Validation, or a lockout guard (last super admin). Message explains. |
| `401` | Not authenticated, or not an admin account. |
| `403` | Missing `ADMIN_ONBOARDING`, account not active, or invite not yet accepted. |
| `404` | `user_id` or `role_id` not found. |
| `409` | Duplicate — role name already taken, or the email is already an admin. |
| `500` | Server fault. |
