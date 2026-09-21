# Users — Frontend Integration

**Pages:** Users → User List, and the user detail page behind it
**Purpose:** who a customer is, what they hold, what they've done, and what state their account is in.

---

## Endpoints

| What | Operation | Type |
|---|---|---|
| The four cards | `adminUsersOverview(input: AdminUsersOverviewInput)` | query |
| The table | `adminUsers(input: AdminUsersFilterInput)` | query |
| Detail: identity | `adminUser(input: AdminUserInput!)` | query |
| Detail: header cards + Balances tab | `adminUserOverview(input: AdminUserInput!)` | query |
| Detail: Login History tab | `adminUserSessions(input: AdminUserSessionsInput!)` | query |
| Detail: Transactions tab | `transactions(input: TransactionFilterInput!)` with `user_id` | query |
| Detail: Savings Plans tab | `savings(input: SavingFilterInput)` with `user_id` | query |
| Detail: KYC tab | `adminKYC(input: AdminKYCUserInput!)` | query |
| Close account | `adminCloseUserAccount(input: AdminCloseUserAccountInput!)` | mutation |
| Suspend / restore | `adminUpdateUserStatus(input: AdminUpdateUserStatusInput!)` | mutation |

Mutations require `USER_MANAGEMENT`.

---

## 1. The four cards

```graphql
query UsersOverview($input: AdminUsersOverviewInput) {
  adminUsersOverview(input: $input) {
    ... on ResponseWithAdminUsersOverview {
      data {
        total_users        total_users_change_pct_vs_last_month
        active_users       active_users_change_pct_vs_last_month
        closed_accounts    closed_accounts_change_pct_vs_last_month
        hnis               hnis_change_pct_vs_yesterday
        suspended_users    frozen_users
      }
    }
    ... on Error { message code status }
  }
}
```

| Card | Value | Change |
|---|---|---|
| Total Users | `total_users` | `_change_pct_vs_last_month` |
| Active Users | `active_users` | `_change_pct_vs_last_month` |
| Closed accounts | `closed_accounts` | `_change_pct_vs_last_month` |
| HNIs | `hnis` | `_change_pct_vs_yesterday` |

`suspended_users` and `frozen_users` are also returned — the mock shows
"Suspended" on the third card in one frame and "Closed accounts" in another, so
both are available.

### The change percentages are null at first

They come from a **nightly snapshot** (`user_overview_snapshots`), not from the
users table — `users.status` holds only the *current* state, so "how many were
active a month ago" cannot be reconstructed after the fact, and the HNI count
moves with balances.

So each field is **`null` until a baseline snapshot exists**: about a day for
the HNI card, about a month for the other three. `null` means "no baseline",
which is different from `0` ("no change") — render a dash, not `0%`.

HNIs is tracked **day over day** because it moves with balances rather than
registrations; the other three are month over month.

---

## 2. The table

```graphql
query Users($input: AdminUsersFilterInput) {
  adminUsers(input: $input) {
    ... on ResponseWithAdminUsers {
      data {
        id fullname firstname middlename lastname email avatar
        status tier kyc_level
        total_balance_ngn total_balance_usd
        fixed_deposits_ngn fixed_deposits_usd
        target_savings_ngn target_savings_usd
        joined_at
      }
      pagination { page limit pages total }
    }
    ... on Error { message code status }
  }
}
```

### Input reference

| Field | Type | Notes |
|---|---|---|
| `search` | `String` | Name or email substring. **Id is matched exactly** — see below. |
| `status` | `EUserStatus` | Status filter menu. |
| `tier` | `ETier` | The KYC Level menu (Level 0–3). |
| `balance_currency` | `ECurrency` | Currency the balance bounds are in. Defaults to `NGN`. |
| `min_balance` / `max_balance` | `Float` | Total Balance buckets. `max` is **exclusive**. |
| `joined_after` / `joined_before` | `Time` | Date joined menu. `before` is **exclusive**. |
| `include_internal` | `Boolean` | Default `false`. |
| `sort` | `ESort` | Ascending / Descending on join date. |
| `limit` / `page` / `paginate` | | `page` is 1-based. |

### Total Balance buckets

```json
{ "input": { "balance_currency": "NGN", "min_balance": 100000, "max_balance": 1000000 } }
```

Everything the account holds is **converted into `balance_currency`** before
comparing, so a USD-only account is not mis-bucketed as empty when filtering in
naira. Bounds are half-open (`>= min`, `< max`), so adjacent buckets never
double-count — verified: the four NGN buckets sum exactly to the unfiltered
total, and so do the USD ones.

The design's naira buckets map to:

| Bucket | min / max |
|---|---|
| ₦0 – ₦100K | `0` / `100000` |
| ₦100K – ₦1M | `100000` / `1000000` |
| ₦1M – ₦10M | `1000000` / `10000000` |
| Above ₦10M | `10000000` / omit |

### ⚠️ Search matches id exactly, not partially

Ids are UUIDs, and hex digits include `a`–`f`. A substring match meant typing
**"f" returned 40 of 48 accounts** — the search looked broken. Id is now matched
exactly; name and email stay fuzzy. An admin searching by id pastes the whole
thing.

Note the mock shows `USR-8842` as User ID, but the real `id` is a UUID. If a
short human-readable id is intended, it does not exist yet — worth raising.

### ⚠️ Admins never appear here

The list filters `role = 'USER'`. A staff account will not be found no matter
what you search — those live in **Admin Accounts** (`adminAccounts`).

### Balances are principal only

`total_balance_*` is flex + fixed + target **principal** (`amount_saved -
amount_withdrawn`), per the spec's binding Q1. Interest is a separate earnings
balance and is never folded in — it is reported as `roi_earned` on the detail
page. Deleted, broken, and pending plans are excluded.

---

## 3. Detail page — header cards and Balances tab

```graphql
query UserOverview($input: AdminUserInput!) {
  adminUserOverview(input: $input) {
    ... on ResponseWithAdminUserOverview {
      data {
        user_id
        balances {
          currency
          active_plans completed_plans
          target_savings fixed_deposits flexi_balance
          roi_earned total_withdrawals
        }
      }
    }
    ... on Error { message code status }
  }
}
```

**Everything is per currency, including the plan counts** — a customer may run a
naira plan and a dollar plan at once, and a single total would not say which.
Pick the row matching the currency toggle.

| Detail element | Field |
|---|---|
| Active plans card | `active_plans` |
| Completed plans card | `completed_plans` |
| Total Withdrawals card | `total_withdrawals` |
| Total ROI Liability card | `roi_earned` |
| Balances: Target Savings | `target_savings` |
| Balances: Fixed Deposit | `fixed_deposits` |
| Balances: Flexi Wallet | `flexi_balance` |
| Balances: ROI Earned | `roi_earned` |

`completed_plans` counts **matured and broken** plans — both are finished. The
underlying status still distinguishes them if that is ever needed.

The array is padded with NGN and USD, so both toggle options always have a row
even when the customer holds nothing in one of them.

### Identity, and the HNI badge

`adminUser` returns the `User` record for the Profile and Account tabs. Two
header badges come from it:

- **Active** badge → `status`
- **HNI** badge → `is_hni`

`is_hni` is resolved on demand and costs a balance aggregate. Fine on this page
(one user) — **avoid selecting it on the list**, where it is one query per row.

---

## 4. The other tabs

They reuse the platform-wide modules scoped to one user, exactly as the spec
asks, so the columns match those screens:

| Tab | Query | Scope with |
|---|---|---|
| Transactions | `transactions` | `user_id` |
| Savings Plans | `savings` | `user_id`, plus `template: FIXED_SAVE` / `TARGET_SAVE` for the sub-tabs |
| KYC | `adminKYC` | `user_id` |
| Login History | `adminUserSessions` | `user_id`, `active_only` |

See [audit-logs.md](audit-logs.md) and [kyc-compliance.md](kyc-compliance.md) for
those modules' own notes.

---

## 5. Close account

```graphql
mutation CloseAccount($input: AdminCloseUserAccountInput!) {
  adminCloseUserAccount(input: $input) {
    ... on Respond { message }
    ... on Error { message code status }
  }
}
```

```json
{ "input": { "user_id": "<id>", "reason": "requested by customer" } }
```

**Irreversible through the API.** It records a closure request, sets
`USER_DELETED`, and revokes every session — which is what the confirmation modal
promises. `reason` is optional but recorded on the closure request for the audit
trail; worth capturing rather than leaving blank.

For a reversible action use `adminUpdateUserStatus` instead, which sets a status
and revokes sessions when blocking.

---

## Behaviour worth knowing

**Every action is audited** under `USER_LIST`, failures included.

**Empty is not an error.** No matches returns `data: []` with
`pagination.total = 0` — the design's "No User Record Found" state. Only the
`Error` branch means something failed.

---

## Error handling

```graphql
... on ResponseWithAdminUsers { ... }
... on Error { message code status }
```

| Status | Meaning |
|---|---|
| `400` | Validation. |
| `401` | Not authenticated, or not an admin. |
| `403` | Missing `USER_MANAGEMENT`. |
| `404` | User not found. |
| `500` | Server fault. |
