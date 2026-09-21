# Flexi Wallet — Frontend Integration

**Page:** Finance → Flexi Wallet
**Purpose:** *"How much money is sitting in Flexi Wallets system-wide, and how is
it moving?"*

Renamed from "Wallet" and **narrowed to the Flexi product only**. System-wide
figures (Flexi + Savings + Total) live on the Overview dashboard. If you find
yourself rendering a savings number on this page, something is wrong.

---

## Endpoints

| What | Operation | Type |
|---|---|---|
| The four cards | `adminWalletOverview(input: AdminDateRangeInput)` | query |
| Flexi Balance Over Time | `adminWalletBalanceSeries(input: AdminSeriesInput)` | query |
| Recent Wallet Transactions | `transactions(input: TransactionFilterInput!)` | query |

Reads need an authenticated admin. The module is read-only.

---

## 1. The four cards

```graphql
query FlexiWalletOverview($input: AdminDateRangeInput) {
  adminWalletOverview(input: $input) {
    ... on ResponseWithAdminWalletOverview {
      data {
        currency
        total_flexi_balance      total_flexi_balance_change_pct_vs_last_month
        total_flexi_deposits     total_flexi_deposits_change_pct_vs_yesterday
        total_flexi_withdrawals  total_flexi_withdrawals_change_pct_vs_yesterday
        flexi_roi_liability      flexi_roi_liability_change_today
        large_transaction_requests
      }
    }
    ... on Error { message code status }
  }
}
```

| Card | Value | Change | Window |
|---|---|---|---|
| Total Flexi Wallet balance | `total_flexi_balance` | `_change_pct_vs_last_month` | point-in-time |
| Total Flexi Deposits | `total_flexi_deposits` | `_change_pct_vs_yesterday` | selected period |
| Total Flexi Withdrawals | `total_flexi_withdrawals` | `_change_pct_vs_yesterday` | selected period |
| Flexi ROI Liability | `flexi_roi_liability` | `_change_today` (absolute, not %) | point-in-time |

**One row per currency, nothing converted.** Pick the row matching the currency
toggle, or pass `currency` to get just one. Flexi is NGN-only per the product
brief, so USD rows are normally zero rather than absent.

`flexi_roi_liability` is a **subset of the ROI module's** `total_roi_liability`,
referenced rather than recalculated. The design's "+₦890K today" is
`flexi_roi_liability_change_today` — an amount, not a rate.

### Large Transaction Requests

```graphql
large_transaction_requests
```

The depth of the Flexi approval queue: withdrawal requests at or above the
large-transaction threshold still awaiting an admin decision.

**It is a queue, so it is point-in-time — the date range does not apply to it.**
Every other card on this page moves when the range changes; this one does not.
It is the Flexi slice of the platform-wide `pending_withdrawals_count` on the
dashboard and uses identical type/status rules, so it can never exceed that
total. The two are directly comparable.

The design's four cards do not include it, but it is now correct if you want a
fifth.

---

## 2. Flexi Balance Over Time

```graphql
query FlexiBalanceSeries($input: AdminSeriesInput) {
  adminWalletBalanceSeries(input: $input) {
    ... on ResponseWithAdminWalletBalanceSeries {
      data { date flexi_balance }
    }
    ... on Error { message code status }
  }
}
```

`AdminSeriesInput` takes `currency`, `start_date`, `end_date`, and `granularity`
(`DAY | MONTH | YEAR`). Points come back sorted with gaps filled — no padding
needed.

### ⚠️ Select `flexi_balance` only

`AdminWalletBalancePoint` still carries `savings_balance` and
`total_wallet_balance` from the pre-rename chart. Both remain on the type for
Overview's benefit, but the spec removed them from **this** module:

> Since this module is now scoped to Flexi only, the Savings and Total lines
> belong on Overview instead, not here. Keeping all three here re-creates the
> same naming confusion this rename was meant to fix.

One line, labelled "Flexi Wallet".

---

## 3. Recent Wallet Transactions

Served by the shared `transactions` query — there is no Flexi-specific endpoint,
so scope it yourself.

```graphql
query RecentWalletTransactions($input: TransactionFilterInput!) {
  transactions(input: $input) {
    ... on ResponseWithTransactions {
      data {
        id status category amount created_at
        flow { source destination }
        user { firstname lastname avatar }
      }
      pagination { page limit pages total }
    }
    ... on Error { message code status }
  }
}
```

| Column | Field |
|---|---|
| ID | `id` |
| User | `user` |
| Status | `status` |
| Type | `category` |
| Amount | `amount` |
| Flow | `flow { source destination }` |
| Date & Time | `created_at` |

**Type is `category`, not `type`.** `category` is the six-bucket display taxonomy
(`DEPOSIT`, `WITHDRAWAL`, `TRANSFER`, `ROI_PAYOUT`, `ROI_CLAWBACK`, `CONVERSION`,
`OTHER`) derived from the stored type and direction. `type` is the storage enum —
do not render it. Filtering by `category` is **mutually exclusive** with `type` /
`types`; sending both is a 400, not a silent merge.

**`flow` is derived server-side** so every screen renders the same labels. Render
as `source → destination`.

**`user` can be null** — resolved lazily and absent when the customer has since
been deleted. Fall back to `user_id`.

See [transaction-history.md](transaction-history.md) for the shared filter
reference. "View all" should route there pre-filtered rather than paging this
table indefinitely.

---

## Behaviour worth knowing

**NGN and USD never mix.** Every card and chart is per currency with no FX
conversion. Do not sum the two rows.

**`_change_pct_*` can be null and means "no baseline", not zero** — no snapshot
yet, or the earlier period was zero. Render a dash, not "0%".

**The comparison window is in the field name.** `_vs_last_month`,
`_vs_yesterday`, `_change_today`. Do not caption a card with a comparison the
field name does not make.

**Empty is not an error.** A filter matching nothing returns `data: []` with
`pagination.total = 0`. Only the `Error` branch means something failed.

---

## Error handling

```graphql
... on ResponseWithAdminWalletOverview { ... }
... on Error { message code status }
```

| Status | Meaning |
|---|---|
| `400` | Validation, or mutually-exclusive filters combined. |
| `401` | Not authenticated, or not an admin. |
| `500` | Server fault. |
