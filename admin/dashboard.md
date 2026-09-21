# Dashboard (Overview) — Frontend Integration

**Page:** Dashboard
**Purpose:** the front door. *"Is everything healthy right now, and is anything
waiting on me?"* Everyone with admin access lands here.

Most figures on this page are **calculated once here and referenced by the other
modules**, so Treasury and ROI can never disagree with it.

---

## Endpoints

| What | Operation | Type |
|---|---|---|
| Both metric rows | `adminOverviewMetrics(input: AdminCurrencyInput)` | query |
| System Funds chart | `adminSystemFunds(input: AdminSeriesInput)` | query |
| Funds Breakdown donut | `adminFundsBreakdown(input: AdminBreakdownInput!)` | query |
| Pending Withdrawals panel | `transactions` with `pending_approval: true` | query |
| Recent Transactions tabs | `transactions` with `category` | query |
| Approve / reject a withdrawal | `adminSettleTransaction` | mutation |

---

## 1. The metric cards

```graphql
query Overview($input: AdminCurrencyInput) {
  adminOverviewMetrics(input: $input) {
    ... on ResponseWithAdminOverviewMetrics {
      data {
        currency
        total_funds            total_funds_change_pct_vs_last_month
        total_flexi_balance    total_flexi_balance_change_pct_vs_yesterday
        total_savings_balance  total_savings_balance_change_pct_vs_last_month
        total_roi_liability    total_roi_liability_change_today
        pending_withdrawals    pending_withdrawals_count
        daily_deposits         daily_deposits_change_pct_vs_yesterday
        daily_withdrawals      daily_withdrawals_change_pct_vs_yesterday
        net_capital_position   net_capital_position_status
        liquidity_ratio        liquidity_status
        safe_deployable_capital locked_savings_principal
        total_capital_outflow  capital_outflow_health_balance
      }
    }
    ... on Error { message code status }
  }
}
```

| Card | Value | Change / badge |
|---|---|---|
| Total Funds in System | `total_funds` | `_change_pct_vs_last_month` |
| Total Flexi Wallet Balance | `total_flexi_balance` | `_change_pct_vs_yesterday` |
| Total Savings Balance | `total_savings_balance` | `_change_pct_vs_last_month` |
| Total ROI Liability | `total_roi_liability` | `_change_today` (**absolute**, not %) |
| Daily Deposits | `daily_deposits` | `_change_pct_vs_yesterday` |
| Daily Withdrawals | `daily_withdrawals` | `_change_pct_vs_yesterday` |
| Net Capital Position | `net_capital_position` | `net_capital_position_status` |
| Liquidity Ratio | `liquidity_ratio` (render `2.84×`) | `liquidity_status` |

**One row per currency, nothing converted.** Pass `currency` for a single row.

### What the derived figures mean

**Total Funds in System** = Flexi + Savings principal + ROI liability − Net
Capital Position. Everything held, net of what the business has drawn out. ROI is
counted here because the money is genuinely sitting there.

**Safe Deployable Capital** = Total Funds − ROI liability − pending withdrawals −
locked savings principal − operating buffer. What the business can move without
endangering what it owes. Each deduction is a different claim: interest belongs
to savers, pending withdrawals are earmarked to leave, locked principal cannot be
recalled, and the buffer (**10%**, set in Platform Configuration) is deliberate
headroom.

**Liquidity Ratio** = Safe Deployable Capital ÷ (ROI liability + pending
withdrawals). How many times over the platform could cover its near-term claims.
`1.0×` is the line.

> **Do not recompute these client-side.** `locked_savings_principal` is not
> "fixed deposits" — it is every fixed deposit *plus* target savings in locked
> withdrawal mode, active and not yet matured. Savings principal excludes Flexi.
> Both are easy to get subtly wrong; read the fields.

### ⚠️ `liquidity_ratio: 0` does not mean "uncovered"

It is `0` when there are **no obligations to cover** — nothing is owed, so
nothing can be uncovered, and `liquidity_status` is `HEALTHY`. Read the status
for the verdict, never the bare number. Treasury reports this identically.

### Nulls mean "no baseline", not zero

Every `_change_pct_*` is `null` until a comparable snapshot exists — about a day
for the yesterday comparisons, a month for the last-month ones. Render a dash,
not `0%`. `total_roi_liability_change_today` is an **absolute** amount and is
always present.

---

## 2. System Funds chart

```graphql
query SystemFunds($input: AdminSeriesInput) {
  adminSystemFunds(input: $input) {
    ... on ResponseWithAdminSystemFunds {
      data { date flexi_balance savings_balance roi_liability }
    }
    ... on Error { message code status }
  }
}
```

`granularity` is `DAY` (the default when omitted), `MONTH`, or `YEAR`.

**Three lines, and only three.** Capital Outflow is deliberately not one: it is a
cumulative log of discrete events, not a balance that exists over time, and
drawing a running total beside three real balances implies it behaves like one
when it only ever increases. It lives in Treasury as a card and a log.

Buckets are Africa/Lagos and never run past the current one, so the last point is
partial rather than absent.

---

## 3. Funds Breakdown donut

```graphql
query Breakdown($input: AdminBreakdownInput!) {
  adminFundsBreakdown(input: $input) {
    ... on ResponseWithAdminBreakdownGroups {
      data { mode items { key label amount native_amount } }
    }
    ... on Error { message code status }
  }
}
```

`mode` selects one of `SAVINGS` / `SYSTEM` / `CURRENCY`; omit it to get all
three. `end_date` serves the donut as of a past date from the daily snapshots.

### ⚠️ SYSTEM returns 7 items — only 3 are the donut

Render **`TOTAL_FLEXI_BALANCE` + `TOTAL_SAVINGS_BALANCE` + `TOTAL_ROI_LIABILITY`**.
Those are mutually exclusive and sum to exactly Total Funds *before* the Net
Capital Position deduction, which is what makes the percentages mean anything.

| Key | Use |
|---|---|
| `TOTAL_FLEXI_BALANCE` | **donut** |
| `TOTAL_SAVINGS_BALANCE` | **donut** — Fixed + Target combined |
| `TOTAL_ROI_LIABILITY` | **donut** |
| `TOTAL_FIXED_BALANCE` | context — the Savings slice, split |
| `TOTAL_TARGET_BALANCE` | context — the Savings slice, split |
| `PENDING_WITHDRAWALS` | context |
| `TOTAL_CAPITAL_OUTFLOW` | context |

**Do not pie all seven.** Fixed + Target *are* the Savings slice, so including
both double-counts; `PENDING_WITHDRAWALS` is a claim against money already inside
Flexi/Savings; and `TOTAL_CAPITAL_OUTFLOW` is a flow, not a balance. Footnote the
deduction from `net_capital_position` instead of rendering a negative segment.

**SAVINGS** returns Flexi, Fixed and Target. The spec's donut is Fixed vs Target;
Flexi is there so you don't need a second call.

### CURRENCY: `amount` sizes the slice, `native_amount` labels it

Currencies cannot be compared in their own units — USD 6,224.98 beside
NGN 7,438,045.58 drew as 0.08% of the donut when in naira terms it is the
*larger* holding. So `amount` is converted into one comparison currency, while
`native_amount` keeps the real figure:

| `currency` in | key | `amount` | `native_amount` |
|---|---|---|---|
| NGN | NGN | 7,438,045.58 | 7,438,045.58 |
| NGN | USD | 8,465,972.80 | **6,224.98** |
| USD | NGN | 5,469.16 | **7,438,045.58** |
| USD | USD | 6,224.98 | 6,224.98 |

- **Size slices and compute percentages from `amount`.**
- **Label them with `native_amount`** if you want to show real figures — "USD
  $6,224.98 (53.2%)".
- `native_amount` is null on SAVINGS and SYSTEM, where nothing is converted.

**On this mode `currency` is the unit to compare in, not a filter** — every
currency appears regardless. Defaults to NGN.

Percentages are **identical whichever base you pick** (46.77% / 53.23% either
way). Everything is computed in naira, then the whole set is scaled by a single
rate, so the rate cancels out. Converting each slice in its own direction would
not do that: the stored rates are not exact reciprocals (`USD→NGN` 1360 against
`NGN→USD` 0.00073, whose true inverse is 0.0007353), which moved the same
holdings between 53.23% and 53.41% depending on the toggle.

Footnote the rate and its timestamp from the `rates` query, which owns them.

---

## 4. Pending Withdrawals panel

```json
{ "input": { "pending_approval": true, "limit": 5, "paginate": true } }
```

The count and total for the header come from `pending_withdrawals_count` and
`pending_withdrawals` on the metrics query — the threshold is applied server-side
so the panel and the card cannot disagree.

**Withdrawals only.** This is a deliberate control gate, not a delay state: a
withdrawal at or above the large-transaction threshold is held for review.
Deposits never enter this queue.

### Approve / reject

```graphql
mutation Settle($input: AdminSettleTransactionInput!) {
  adminSettleTransaction(input: $input) {
    ... on ResponseWithTransaction { message data { id status } }
    ... on Error { message code status }
  }
}
```

| Modal | Input |
|---|---|
| "Approve this withdrawal?" | `{ transaction_id, status: COMPLETED }` |
| "Cancel this withdrawal?" | `{ transaction_id, status: CANCELLED, reason, note }` |

`reason` is an `ECancellationReason` — `SUSPECTED_FRAUD`,
`FAILED_COMPLIANCE_CHECK`, `INVALID_DESTINATION_ACCOUNT`, `DUPLICATE_REQUEST`,
`CUSTOMER_REQUEST`, `INSUFFICIENT_VERIFICATION`, `OTHER`. It is **required when
cancelling** and ignored when completing; `note` is the free-text comment beside
it. Money movement happens server-side, so balances never desync.

Refetch the metrics after settling — approving changes `pending_withdrawals`,
which feeds Safe Deployable Capital and the Liquidity Ratio.

---

## 5. Recent Transactions

Tabbed Deposits / Withdrawals / Transfers, 5–6 rows, "View all" through to
Transaction History. Filter on **`category`**, not `type`:

| Tab | `category` |
|---|---|
| Deposits | `DEPOSIT` |
| Withdrawals | `WITHDRAWAL` |
| Transfers | `TRANSFER` |

See [transaction-history.md](transaction-history.md) for the columns and the
`flow` field.

---

## Behaviour worth knowing

**Per currency, never summed.** No FX conversion anywhere except the Currency
donut, which says so explicitly.

**Africa/Lagos day bounds** on every "today" and "yesterday" figure.

**Capital Outflow Logs are not a dashboard widget.** The spec removed the
standalone table as a duplicate of Treasury's; the dashboard carries the summary
(`total_capital_outflow`, `net_capital_position`) and links through.

---

## Error handling

| Status | Meaning |
|---|---|
| `400` | Validation, or mutually-exclusive filters combined. |
| `401` | Not authenticated, or not an admin. |
| `403` | Missing the privilege the mutation requires. |
| `404` | Transaction not found. |
| `500` | Server fault. |
