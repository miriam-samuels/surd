# KYC & Compliance — Frontend Integration

**Page:** Users → KYC & Compliance
**Purpose:** identity verification queue — who is waiting on review, who has been waiting too long, and approving or rejecting them.

---

## Endpoints

| What | Operation | Type |
|---|---|---|
| The three cards | `adminKYCOverview(input: AdminKYCOverviewInput)` | query |
| The table | `adminKYCs(input: AdminKYCFilterInput)` | query |
| The review modal | `adminKYC(input: AdminKYCUserInput!)` | query |
| Approve / reject | `adminUpdateKYCStatus(input: AdminUpdateKYCStatusInput!)` | mutation |

Reads need an authenticated admin. **The mutation requires `KYC_COMPLIANCE`** —
hide the approve/reject controls without it; the server enforces it regardless.

---

## 1. The three cards

```graphql
query KYCOverview($input: AdminKYCOverviewInput) {
  adminKYCOverview(input: $input) {
    ... on ResponseWithAdminKYCOverview {
      data {
        pending_reviews
        closed_accounts
        stuck_reviews
        rejected_reviews
        suspended_accounts
        frozen_accounts
      }
    }
    ... on Error { message code status }
  }
}
```

```json
{ "input": { "sla_hours": 48, "include_internal": false } }
```

| Card | Field |
|---|---|
| Pending Reviews | `pending_reviews` |
| Closed Accounts | `closed_accounts` |
| Stuck Reviews (>SLA) | `stuck_reviews` |

`rejected_reviews`, `suspended_accounts`, and `frozen_accounts` are returned but
have no card in the design — available if you want them.

**`sla_hours` defines "stuck"** — a still-pending review older than this. Defaults
to **48**. Send the same value here and on the table so the card and the filtered
list agree; sending different values makes the count disagree with the rows.

`include_internal` (default `false`) excludes internal/test accounts.

---

## 2. The table

```graphql
query PendingKYC($input: AdminKYCFilterInput) {
  adminKYCs(input: $input) {
    ... on ResponseWithKYCs {
      message
      data {
        id
        user_id
        status
        id_document
        id_url
        created_at
        user { id firstname lastname email avatar status }
      }
      pagination { page limit pages total }
    }
    ... on Error { message code status }
  }
}
```

```json
{ "input": { "pending_review_only": true, "limit": 20, "page": 1, "paginate": true } }
```

### Input reference

| Field | Type | Notes |
|---|---|---|
| `search` | `String` | Free-text across the record. |
| `user_id` / `email` | | Target one account. |
| `status` | `EKYCStatus` | `KYC_PENDING` · `KYC_PROCESSING` · `KYC_VERIFIED` · `KYC_REJECTED`. |
| `pending_review_only` | `Boolean` | What the "All Pending KYC Reviews" table wants. |
| `stuck_only` | `Boolean` | Pending **and** older than `sla_hours`. **Implies `pending_review_only`** — no need to send both. |
| `sla_hours` | `Int` | Age threshold for `stuck_only`; defaults to 48. |
| `include_internal` | `Boolean` | Default `false`. |
| `sort` | `ESort` | Direction. |
| `limit` / `page` / `paginate` | | `page` is 1-based. |

Make the **Stuck Reviews** card clickable — it drops straight onto this table
with `stuck_only: true`, which is the queue an operator actually needs to work.

### Rendering the columns

| Column | Field | Notes |
|---|---|---|
| User ID | `user_id` | |
| Name | `user { firstname lastname email avatar }` | Nullable — see below. |
| Documents | `id_document` | `NIN_SLIP` · `ID_CARD` · `PASSPORT` · `DRIVERS_LICENSE` · `VOTERS_CARD`. Map to display text; don't print the enum. |
| Submitted | `created_at` | The row is written when the user submits tier-one, so this genuinely is the submission time — and it's the same clock the SLA uses. |
| Actions | View → open the modal with `user_id` | |

**`user` is resolved lazily and is nullable.** A KYC row whose account was since
removed degrades to a null cell rather than nulling the whole row — guard before
reading `firstname`. Omit `user` from the selection set and no lookup runs.

---

## 3. The review modal

```graphql
query KYCReview($input: AdminKYCUserInput!) {
  adminKYC(input: $input) {
    ... on ResponseWithKYC {
      data {
        user_id
        status
        id_document
        id_url
        created_at
        user { firstname lastname email avatar status is_hni }
      }
    }
    ... on Error { message code status }
  }
}
```

```json
{ "input": { "user_id": "<user id>" } }
```

| Modal element | Field |
|---|---|
| Name | `user { firstname lastname }` |
| **Active** badge | `user.status` |
| **HNI** badge | `user.is_hni` |
| Document Type | `id_document` |
| Submitted | `created_at` |
| Status badge | `status` |
| Document Preview | `id_url` |

### `is_hni`

`User.is_hni` is computed from the account's **principal** balance converted to
NGN, against the HNI threshold in Platform Configuration. It uses the same rule
as the HNIs tile in the Users module, so the badge and that count cannot
disagree. `false` when the threshold is unconfigured.

It is resolved on demand and costs a balance aggregate — fine here (one user),
but **avoid selecting it on a paginated list**, where it is one query per row.

### `id_url` may be empty

Render the empty-image placeholder the design shows rather than a broken image.

---

## 4. Approve / reject

```graphql
mutation UpdateKYC($input: AdminUpdateKYCStatusInput!) {
  adminUpdateKYCStatus(input: $input) {
    ... on Respond { message }
    ... on Error { message code status }
  }
}
```

```json
{ "input": { "user_id": "<user id>", "status": "KYC_VERIFIED" } }
```

**Only `KYC_VERIFIED` and `KYC_REJECTED` are accepted.** Sending `KYC_PENDING`
or `KYC_PROCESSING` returns a `400` — a reviewer moves a review *out* of the
queue, never back into it.

**Only a pending review can be updated.** Acting on one already decided returns
`400` ("only pending kyc reviews can be updated"). That is the guard against two
reviewers double-deciding the same record, so surface the message rather than a
generic failure and refetch — the row has almost certainly just been handled by
someone else.

Returns `Respond` (message only). Refetch both the table and the overview
afterwards; approving changes `pending_reviews` and may change `stuck_reviews`.

> **The mockup has no approve/reject controls** — the modal shows only the
> document preview. The endpoint exists and is privilege-gated, so either the
> buttons are below the fold or the flow is unfinished. Worth confirming with
> design: without them a reviewer can read a document but not act on it.

---

## Behaviour worth knowing

**Every action is audited** under the `KYC_COMPLIANCE` module, failures included.

**Empty is not an error.** A filter matching nothing returns `data: []` with
`pagination.total = 0` — that is the design's "No User Pending KYC Account for
Review Yet" state. Only the `Error` branch means something failed.

**Keep `sla_hours` consistent** between the overview and the table, or the Stuck
Reviews count will not match the rows the filter returns.

---

## Error handling

```graphql
... on ResponseWithKYCs { ... }
... on Error { message code status }
```

| Status | Meaning |
|---|---|
| `400` | Unsupported status, or the review is no longer pending. |
| `401` | Not authenticated, or not an admin. |
| `403` | Missing `KYC_COMPLIANCE`. |
| `404` | User or KYC record not found. |
| `500` | Server fault. |
