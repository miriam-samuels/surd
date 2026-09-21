# Audit Logs — Frontend Integration

**Page:** Settings → Audit Logs
**Purpose:** every administrative action taken on the platform, who took it, and from where.

---

## Endpoints

| What | Operation |
|---|---|
| The table | `adminAuditLogs(input: AdminAuditLogsFilterInput)` |
| The "All admins" picker | `adminAccounts(input: AdminAccountsFilterInput)` |

Both are queries. Both require an authenticated admin.

---

## 1. The table

```graphql
query AuditLogs($input: AdminAuditLogsFilterInput) {
  adminAuditLogs(input: $input) {
    ... on ResponseWithAdminAuditLogs {
      message
      data {
        id
        admin_id
        admin_firstname
        admin_lastname
        admin_email
        admin_avatar
        module
        action
        resolver
        status
        ip_address
        device
        created_at
      }
      pagination { page limit pages total }
    }
    ... on Error { message code status }
  }
}
```

### Variables

```json
{
  "input": {
    "search": null,
    "modules": null,
    "admin_ids": null,
    "start_date": null,
    "end_date": null,
    "limit": 20,
    "page": 1,
    "paginate": true
  }
}
```

### Input reference

| Field | Type | Notes |
|---|---|---|
| `search` | `String` | Matches action description, resolver, IP, **or** the acting admin's name/email. Single field — no need to pick a column. |
| `modules` | `[EAuditModule!]` | OR'd together. Omit or send `null` for all. |
| `admin_ids` | `[ID!]` | OR'd together. Omit or send `null` for all. |
| `start_date` | `Time` | Inclusive (`created_at >=`). |
| `end_date` | `Time` | **Exclusive** (`created_at <`). For "13 Mar" send start `13 Mar 00:00`, end `14 Mar 00:00`. |
| `limit` | `Int` | Defaults to 20. |
| `page` | `Int` | 1-based. Defaults to 1. |
| `paginate` | `Boolean` | Defaults to `true`. Set `false` to skip the count query — `pagination` is then `null`. |

Filters combine with **AND**; values inside a list combine with **OR**. So
`modules: [FINANCE, USERS], admin_ids: ["x"]` means *(Finance or Users) and by admin x*.

### Rendering the columns

| Column | Field | Notes |
|---|---|---|
| Timestamp | `created_at` | UTC ISO-8601. Render in **Africa/Lagos** — every figure in the admin app is Lagos-based. |
| Admin | `admin_firstname` + `admin_lastname`, `admin_email`, `admin_avatar` | All four are `String!` and are `""` when the user row was deleted. Fall back to initials when `admin_avatar` is empty — that is the `BM` chip in the design. |
| Module | `module` | See the grouping note below. |
| Action | `action` | Already human-readable. `resolver` is the precise operation — useful in a tooltip or for support, not for display. |
| IP Address | `ip_address` | Returned **in full**. The design shows `102.89.xxx.xxx`; that masking is the client's job. |
| Device | `device` | The **raw user agent**. Parse it into OS + browser (`Windows 11` / `Chrome 137`) client-side. |

`ip_address` and `device` are `""` on rows written before client capture existed. Render a dash, not an empty cell.

### Ordering

`created_at DESC, id` — the `id` tiebreak keeps paging stable when several rows share a timestamp.

---

## 2. The admin picker

```graphql
query AdminPicker($input: AdminAccountsFilterInput) {
  adminAccounts(input: $input) {
    ... on ResponseWithUsers {
      data { id firstname lastname email avatar }
      pagination { page limit pages total }
    }
    ... on Error { message code status }
  }
}
```

`AdminAccountsFilterInput` takes `search` (name or email), `role_id`, `status`, `limit`, `page`, `paginate`. Feed the "Search admin" box into `search`, and put the selected `id`s into `admin_ids` on the table query.

---

## `EAuditModule` — 19 values

```
DASHBOARD  FINANCE  WALLET  SAVINGS  ROI  VAULT  TREASURY  TRANSACTION_HISTORY
USERS  USER_LIST  KYC_COMPLIANCE
CONFIGURATION  RATES  PENALTIES  LIMITS
SETTINGS  ADMIN_ACCOUNTS  CONTENT_MARKETING  DEVELOPER_CONFIG
```

### ⚠️ The filter shows 4 groups; the API has 19 values

The design's module dropdown lists **Finance / Users / Configurations / Settings** — the sidebar sections. The enum is finer-grained, one value per page. Two consequences:

**Filtering** works as-is: when the user picks "Finance", send every module in that section.

```ts
const MODULE_GROUPS = {
  Finance:        ['FINANCE','WALLET','SAVINGS','ROI','VAULT','TREASURY','TRANSACTION_HISTORY'],
  Users:          ['USERS','USER_LIST','KYC_COMPLIANCE'],
  Configurations: ['CONFIGURATION','RATES','PENALTIES','LIMITS'],
  Settings:       ['SETTINGS','ADMIN_ACCOUNTS','CONTENT_MARKETING','DEVELOPER_CONFIG'],
} as const
```

`DASHBOARD` belongs to no section — decide whether it sits under Finance or is left out of the picker.

**The Module column does not.** The API returns `TREASURY` where the design prints `Finance`. Invert the map above to render the group name, or print the granular module — but pick one deliberately, because a filter labelled "Finance" that yields rows labelled "Treasury" reads like a bug.

---

## Behaviour worth knowing

**Failures are recorded, not just successes.** A rejected capital outflow, a denied privilege check, and a failed login all produce rows. Check `status` — `SUCCESS` or `FAILURE`. The design has no Status column; consider surfacing it, because "admin login failed ×12" is the entry an auditor most wants to see and it is currently indistinguishable from a successful login.

**Admin actions only.** The endpoint filters `role = ADMIN`, so customer activity never appears here regardless of filters.

**Reads are logged too.** Opening this page writes a `CONFIGURATION` row for `queryResolver.AdminAuditLogs`. Expect your own page loads in the list.

**Empty result is not an error.** `data` is `[]` with `pagination.total = 0`. Only the `Error` branch means something went wrong.

---

## Error handling

Every response is a union. Always spread both branches:

```graphql
... on ResponseWithAdminAuditLogs { ... }
... on Error { message code status }
```

`Error.status` carries the HTTP-equivalent code — `401` unauthenticated, `403` missing privilege, `500` server fault.
