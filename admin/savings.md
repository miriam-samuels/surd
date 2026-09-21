# Savings — Frontend Integration

**Page:** Finance → Savings
**Purpose:** *"How much principal is locked in savings products, in what form,
and when is it coming due?"*

---

## The one rule that explains most of this page

**Every savings balance is principal only** — `amount_saved - amount_withdrawn`.
Interest is never included.

ROI is paid upfront on Fixed Deposits and daily on Target Savings, and the ROI
module already owns it as a liability. Counting it here too would make one naira
appear as *savings* on this page and as *ROI* on the next.

Practical consequence: **Savings and ROI figures are not meant to add up to a
user's total holdings.** When someone asks why the numbers "don't tie", that is
the answer.

---

## Endpoints

| What | Operation | Type |
|---|---|---|
| The six cards | `adminSavingsOverview(input: AdminDateRangeInput)` | query |
| Savings by Type donut | `adminSavingsByType(input: AdminDateRangeInput)` | query |
| Maturity Timeline | `adminSavingsMaturityTimeline(input: AdminSeriesInput)` | query |
| All Savings Plans / Upcoming Maturities | `savings(input: SavingFilterInput)` | query |

Reads need an authenticated admin. The module is read-only — plans are created by
customers, never by hand.

---

## 1. The cards

```graphql
query SavingsOverview($input: AdminDateRangeInput) {
  adminSavingsOverview(input: $input) {
    ... on ResponseWithAdminSavingsOverview {
      data {
        currency
        total_savings_balance         total_savings_balance_change_pct_vs_yesterday
        total_fixed_deposit_balance   total_fixed_deposit_balance_change_pct_vs_last_month
        total_target_savings_balance  total_target_savings_balance_change_pct_vs_last_month
        total_locked_savings          total_locked_savings_change_pct_vs_last_month
        average_plan_size             average_plan_size_change_pct_vs_yesterday
        active_savings_plans_count
        upcoming_maturities_30d_amount
        upcoming_maturities_30d_count
      }
    }
    ... on Error { message code status }
  }
}
```

| Card | Value | Change | Window |
|---|---|---|---|
| Total Savings Balance | `total_savings_balance` | `_change_pct_vs_yesterday` | point-in-time |
| Fixed Deposits Balance | `total_fixed_deposit_balance` | `_change_pct_vs_last_month` | point-in-time |
| Target Savings Balance | `total_target_savings_balance` | `_change_pct_vs_last_month` | point-in-time |
| Total Locked Savings | `total_locked_savings` | `_change_pct_vs_last_month` | point-in-time |
| Average Plan Size | `average_plan_size` | `_change_pct_vs_yesterday` | point-in-time |
| Upcoming Maturities (30d) | `upcoming_maturities_30d_amount` + `_count` | — | next 30 days |

**One row per currency, nothing converted.** Pick the row matching the currency
toggle, or pass `currency` to get just one.

**Total Locked Savings** is Fixed Deposits plus locked-mode Target Savings —
principal that cannot be withdrawn without penalty. Flexible Target plans are
excluded.

### ⚠️ Average Plan Size, not Average Daily Savings

`average_plan_size` = `total_savings_balance ÷ active_savings_plans_count`, and
is `0` when there are no active plans (the backend already guards the divide —
style the empty state, not the maths).

The spec **replaced** "Average Daily Savings" with this, because the old card
paired a daily *flow* figure with a month-over-month comparison — two
incompatible ideas in one number.

`average_daily_savings` still exists on the type, legitimately redefined as
window inflow ÷ whole days with a **day-over-day** delta. It is not a card on
this page. Do not render it as one.

---

## 2. Savings by Type

```graphql
query SavingsByType($input: AdminDateRangeInput) {
  adminSavingsByType(input: $input) {
    ... on ResponseWithAdminBreakdown { data { key label amount } }
    ... on Error { message code status }
  }
}
```

Donut of Fixed Deposit vs Target Savings principal. Use `label` for display.

---

## 3. Maturity Timeline

```graphql
query MaturityTimeline($input: AdminSeriesInput) {
  adminSavingsMaturityTimeline(input: $input) {
    ... on ResponseWithAdminMaturityTimeline { data { date amount count } }
    ... on Error { message code status }
  }
}
```

Fixed Deposit principal maturing per bucket, **forward-looking only**. Highlight
the current-month bar per the design.

Three exclusions are deliberate: **Target Savings** (its target date is a goal,
not a lock expiry), **broken plans** (a plan exited early must not still appear
at its original date), and **interest** (Fixed Deposit interest is paid upfront
at creation, so counting it again at maturity would double-count it).

---

## 4. All Savings Plans & Upcoming Maturities

Both tables use the shared `savings` query — there is no `adminSavings*` list
endpoint. An admin caller is unscoped and sees every user's plans.

```graphql
query SavingsPlans($input: SavingFilterInput) {
  savings(input: $input) {
    ... on ResponseWithSavings {
      data {
        id status template currency balance created_at ending_at
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
| Type | `template` |
| Currency | `currency` |
| Amount Saved | `balance` |
| Started | `created_at` |
| Maturity Date | `ending_at` |

### ⚠️ "Amount Saved" is `balance`, not `amount_saved`

Despite the column heading, `amount_saved` is the **gross ever deposited** and
never decreases — withdrawals accumulate separately in `amount_withdrawn`.
`balance` is `amount_saved - amount_withdrawn`, the live principal.

Rendering `amount_saved` makes a partially-withdrawn plan overstate its holding,
and the column stops reconciling against the Total Savings Balance card. The
schema says the same on the `balance` field itself.

### The Upcoming Maturities drill-down

`SavingFilterInput` carries a half-open maturity window:

```
templates:     [FIXED_SAVE]
statuses:      [ACTIVE]
ending_after:  now
ending_before: now + 30d
```

This totals to the Upcoming Maturities card by construction — the card and the
table cannot disagree. The design's "30 days" chip maps to `ending_before`; a
"90 days" chip is the same filter with a wider bound.

### ⚠️ `Saving.user` is non-null — expect nulled rows

`Saving.user` is declared `User!` and resolved lazily. The resolver returns null
for a customer who has since been deleted, but the non-null declaration turns
that into an error that **nulls the entire row**.

Until the schema drops the `!`, a table selecting `user { … }` shows gaps where
deleted customers appear. If you hit this before the fix lands, select `user_id`
and resolve names separately.

### Filters

| Need | Field |
|---|---|
| Plan type | `templates: [FIXED_SAVE, TARGET_SAVE]` |
| Status | `statuses: [ACTIVE, BROKEN, COMPLETED]` |
| One currency | `currency` |
| One customer | `user_id` |
| Maturity window | `ending_after` / `ending_before` |
| Search | `search` (matches plan label) |
| Paging | `limit` / `page` / `paginate` |

---

## Behaviour worth knowing

**NGN and USD never mix.** Every card and chart is per currency with no FX
conversion. Do not sum the two rows.

**`_change_pct_*` can be null and means "no baseline", not zero** — no snapshot
yet, or the earlier period was zero. Render a dash.

**The comparison window is in the field name.** `_vs_yesterday`,
`_vs_last_month`, `_vs_previous_period`. Do not caption a card with a comparison
the field name does not make.

**Empty is not an error.** A filter matching nothing returns `data: []` with
`pagination.total = 0`. Only the `Error` branch means something failed.

**Two deltas are temporarily off**, both from definition changes landing ahead of
the snapshot history that feeds them:

- `_vs_last_month` percentages span the 2026-08-24 principal-only cutover rather
  than real movement. Self-heals from ~2026-09-24.
- `total_locked_savings` steps up once when its template-scoped definition
  deploys, as Fixed Deposits left on a legacy `FLEXIBLE` mode start counting.
  A correction, not a regression.

---

## Error handling

```graphql
... on ResponseWithAdminSavingsOverview { ... }
... on Error { message code status }
```

| Status | Meaning |
|---|---|
| `400` | Validation, or mutually-exclusive filters combined. |
| `401` | Not authenticated, or not an admin. |
| `500` | Server fault. |
