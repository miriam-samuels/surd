# ROI — Frontend Integration

**Page:** Finance → ROI (Return On Investments)
**Purpose:** the platform's single source of truth for interest obligations —
*"how much interest have we paid out, how much do we still owe, and where is it
coming from?"*

Every other module references `total_roi_liability` from here rather than
recomputing it.

---

## Endpoints

| What | Operation | Type |
|---|---|---|
| The four cards | `adminROIOverview(input: AdminDateRangeInput)` | query |
| ROI by Product donut | `adminROIByProduct(input: AdminDateRangeInput)` | query |
| Daily ROI Flow chart | `adminROIFlowSeries(input: AdminSeriesInput)` | query |
| ROI Activity table | `transactions(input: TransactionFilterInput!)` with `roi_activity: true` | query |

Reads need an authenticated admin. This module is read-only — ROI is produced by
savings activity and the accrual cron, never entered by hand.

---

## 1. The four cards

```graphql
query ROIOverview($input: AdminDateRangeInput) {
  adminROIOverview(input: $input) {
    ... on ResponseWithAdminROIOverview {
      data {
        currency
        total_roi_liability  total_roi_liability_change_today
        roi_generated_today  roi_generated_today_change_pct_vs_yesterday
        roi_withdrawn_today  roi_withdrawn_today_change_pct_vs_yesterday
        roi_clawed_back      roi_clawed_back_change_pct_vs_previous_period
      }
    }
    ... on Error { message code status }
  }
}
```

| Card | Value | Change | Window |
|---|---|---|---|
| Total ROI Liability | `total_roi_liability` | `_change_today` (absolute, not %) | point-in-time |
| ROI Generated Today | `roi_generated_today` | `_change_pct_vs_yesterday` | today |
| ROI Withdrawn Today | `roi_withdrawn_today` | `_change_pct_vs_yesterday` | today |
| **ROI Clawed Back** | `roi_clawed_back` | `_change_pct_vs_previous_period` | **selected period** |

**One row per currency, nothing converted.** Pick the row matching the currency
toggle, or pass `currency` to get just one.

### ⚠️ ROI Clawed Back is not a "today" figure

Note the card label: the two beside it say "Today", this one does not. It is
scoped to `start_date`/`end_date`, and **all-time when no range is given**.

That distinction matters. Scoped to today it read `0` on a live database that
had ₦2,513.09 of clawbacks on record — a real number hidden behind an empty
card. Wire the page's period selector to this query, not only to the chart.

Its change compares against the **preceding window of equal length** (a 7-day
range against the 7 days before it), and is `null` when no range was given or
the prior window was zero.

### What each figure means

- **Total ROI Liability** — every earnings balance, credited and unwithdrawn,
  across Fixed Deposit + Target Savings + Flexi. `interest + interest_accrued`.
  This is the canonical number (spec Q5, Q8).
- **ROI Generated Today** — interest credited to any earnings balance today:
  upfront FD interest at plan creation, daily Target accrual, Flexi accrual.
  Derived from the movement in liability since the start-of-day snapshot, so it
  is **`null` until such a snapshot exists** — render a dash, not `0`.
- **ROI Withdrawn Today** — interest moved out of earnings balances today.
- **ROI Clawed Back** — interest reversed by early plan breaks. Breaking a Fixed
  Deposit recovers 100% of the interest paid upfront at creation.

Clawback exists because without it ROI Generated overstates real interest
expense: a plan that pays ₦8,000 upfront and is broken the same day should not
look like one that matured and genuinely cost ₦8,000.

---

## 2. ROI by Product (donut)

```graphql
query ROIByProduct($input: AdminDateRangeInput) {
  adminROIByProduct(input: $input) {
    ... on ResponseWithAdminBreakdown {
      data { key label amount }
    }
    ... on Error { message code status }
  }
}
```

Three slices, in order: `FIXED_SAVE` → "Fixed Deposit ROI", `TARGET_SAVE` →
"Target Savings ROI", `FLEX_SAVE` → "Flexi Wallet ROI".

**The slices sum to exactly `total_roi_liability`** — verified live in both
currencies. Compute the donut's percentages against that sum, or against the
headline; they are the same number by construction.

This is enforced server-side rather than left to chance. Both figures read
`SUM(interest + interest_accrued)` over the same rows, but one sums per product
and the other in a single pass, and floating-point addition is not associative —
so they could land a kobo apart. The slices are reconciled to the card, which
owns the number.

**Point-in-time: the date range does not apply.** Liability is what is owed
*now*. The input accepts `start_date`/`end_date` for signature consistency and
ignores them.

---

## 3. Daily ROI Flow (chart)

```graphql
query ROIFlow($input: AdminSeriesInput) {
  adminROIFlowSeries(input: $input) {
    ... on ResponseWithAdminROIFlowSeries {
      data { date roi_generated roi_withdrawn }
    }
    ... on Error { message code status }
  }
}
```

`granularity` is `DAY` (default), `MONTH`, or `YEAR`. Two series: green
`roi_generated`, red `roi_withdrawn`. The **gap between the lines is the point** —
it shows liability growing or shrinking over time.

Buckets are Africa/Lagos and never run past the current one, so the last point
is partial rather than absent.

---

## 4. ROI Activity table

```graphql
query ROIActivity($input: TransactionFilterInput!) {
  transactions(input: $input) {
    ... on ResponseWithTransactions {
      data {
        id reference amount currency status
        roi_activity_type
        savings_id savings_template
        created_at
        user { id firstname lastname avatar }
      }
      pagination { page limit pages total }
    }
    ... on Error { message code status }
  }
}
```

```json
{ "input": { "roi_activity": true, "limit": 5, "page": 1, "paginate": true } }
```

| Column | Field |
|---|---|
| ID | `reference` (or `id`) |
| Amount | `amount` |
| Status | `status` |
| **Type** | **`roi_activity_type`** |
| Savings Plan ID | `savings_id` (`savings_template` names the product) |
| User | `user { firstname lastname avatar }` |
| Date & Time | `created_at` |

### `roi_activity_type`

Derived server-side, so the Type column and the rows the filter returns cannot
disagree:

| Value | Row |
|---|---|
| `CREDITED` | Interest paid into an earnings balance |
| `WITHDRAWN` | Interest moved out of an earnings balance |
| `CLAWED_BACK` | Interest reversed by an early plan break |

Null on a row that is not ROI activity. Every row inside `roi_activity: true`
carries a type — verified against the live ledger.

### ⚠️ There is no `CONVERTED` type

The redesign lists Converted as a fourth Type value. **It is not implemented,
because interest cannot be converted.**

`ConvertWallet` — the only writer of `CONVERT` transactions — guards on
`sourceFlex.AmountSaved` and moves `amount_saved`; it never reads `interest` or
`interest_accrued`. The only way interest reaches another currency is to be
withdrawn to Flexi first, at which point it is principal, indistinguishable from
any other balance, and that withdrawal has already been reported as `WITHDRAWN`.

So conversions are deliberately excluded from this table. They remain fully
available in Transaction History under `category: CONVERSION`. Build the Type
filter with three options, not four.

### ⚠️ A clawback has no row of its own

It rides on the break settlement that triggered it — a `WITHDRAWAL`. The table
reports that row as `CLAWED_BACK`, and `roi_clawback_amount` carries the amount
recovered. Both mechanisms are summed: `forfeited_interest` (accrued-but-unpaid
interest a Target plan loses) and `paid_interest_recovery` (upfront interest a
Fixed Deposit was already paid).

That is also why the **Amount** column on a clawback row is the withdrawal
amount, not the interest reversed. Show `roi_clawback_amount` if you need the
reversal itself.

### Filters

`roi_activity: true` must stay set alongside any of these, or the query widens
to the whole ledger:

| Control | Field |
|---|---|
| Search | `search` |
| Status | `status` / `statuses` |
| Currency | `currency` |
| Amount | `min_amount` / `max_amount` |
| Date | `start_date` / `end_date` |
| One plan | `savings_id` |
| One customer | `user_id` |
| Sort | `sort` (defaults to `created_at DESC`) |
| Paging | `limit` / `page` / `paginate` |

See [transaction-history.md](transaction-history.md) for the shared filter
reference.

---

## Behaviour worth knowing

**NGN and USD never mix.** Every card and chart is per currency with no FX
conversion. Do not sum the two rows.

**Two fields can be null and mean "no baseline", not zero** —
`roi_generated_today` (no start-of-day snapshot yet) and any
`_change_pct_*` (no comparable prior window). Render a dash.

**Empty is not an error.** A filter matching nothing returns `data: []` with
`pagination.total = 0`. Only the `Error` branch means something failed.

---

## Error handling

```graphql
... on ResponseWithAdminROIOverview { ... }
... on Error { message code status }
```

| Status | Meaning |
|---|---|
| `400` | Validation, or mutually-exclusive filters combined. |
| `401` | Not authenticated, or not an admin. |
| `500` | Server fault. |
