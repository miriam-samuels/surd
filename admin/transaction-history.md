# Transaction History — Frontend Integration

**Page:** Transactions → Transaction History
**Purpose:** the system-wide ledger of record. Support resolving disputes and
Compliance running investigations both land here to answer *"what exactly
happened to this specific naira/dollar, and when?"*

---

## Endpoints

| What | Operation | Type |
|---|---|---|
| The four cards | `adminTransactionOverview(input: AdminTransactionOverviewInput)` | query |
| The table | `transactions(input: TransactionFilterInput!)` | query |
| The detail drawer | `transaction(input: TransactionFilterInput!)` | query |
| Download receipt | `transactionReceipt(input: TransactionFilterInput!)` | query |

---

## 1. The four cards

```graphql
query TxOverview($input: AdminTransactionOverviewInput) {
  adminTransactionOverview(input: $input) {
    ... on ResponseWithAdminTransactionOverview {
      data {
        currency
        total_transaction_volume
        total_deposits    total_deposits_change_pct_vs_previous_period
        total_withdrawals total_withdrawals_change_pct_vs_previous_period
        net_flow
        average_daily_transaction_volume
        today_transaction_volume
      }
    }
    ... on Error { message code status }
  }
}
```

| Card | Field | Bounded by the selected period? |
|---|---|---|
| Total Transaction Volume | `total_transaction_volume` | yes |
| Total Deposits | `total_deposits` | yes |
| Total Withdrawals | `total_withdrawals` | yes |
| **Net Flow** | `net_flow` | yes |
| (no card) | `average_daily_transaction_volume` | yes |
| (no card) | `today_transaction_volume` | **no — always today** |

**One row per currency.** Pick the row matching the currency toggle; pass
`currency` in the input to have the server return just one.

### ⚠️ "Savings Fundings" and "ROI Withdrawals" are gone

Those two cards were removed, not renamed. They repeated numbers the Savings and
ROI modules already own, and a ledger's job is to let someone search
transactions rather than re-summarise other pages. `net_flow`
(`total_deposits − total_withdrawals`) took their slot — it is negative when the
platform paid out more than it took in over the period.

If a design still shows the old pair, it is out of date.

### Volume is absolute, not net

`total_transaction_volume` is the spec's "sum of all transaction amounts" — it
counts **every** posting, not just the deposits and withdrawals that net against
each other. An ROI payout or a tax debit moved real money and belongs in "how
busy was the ledger". It is deliberately not `deposits − withdrawals`; that
figure is `net_flow`.

So expect **`total_transaction_volume` > `total_deposits + total_withdrawals`**:

| | Volume | Deposits + Withdrawals | Net Flow |
|---|---|---|---|
| NGN | 39,426,642.85 | 35,798,347.34 | +11,021,598.87 |
| USD | 39,956.11 | 31,003.52 | −11,974.31 |

The gap is real, not a rounding error — it is the ROI payouts, tax and internal
credits that volume counts and the other two cards do not. The cards answer
different questions (how much moved, and which way), so **they are not meant to
reconcile**; don't build a check that expects them to.

**`CONVERT` is the one exclusion.** A conversion writes one row per side, so a
single movement lands in both the NGN and USD figures. Counting it would have
each currency report the same transfer and make the two impossible to add up.

`average_daily_transaction_volume` divides this same figure by the day count, so
the two always agree.

### `today_transaction_volume` ignores the period

Every other figure is bounded by `start_date`/`end_date`. This one is always
today, in **Africa/Lagos**, because it answers "what has moved so far today"
rather than anything about the selected range. Don't relabel it when the period
changes.

It uses the same type set as `total_transaction_volume` — the same metric over a
different window — so the two can never disagree about what counts. It reads
`0` before the day's first transaction settles; that is a real zero, not a
missing value.

### Change percentages

`_change_pct_vs_previous_period` compares the selected period against the
**immediately preceding window of the same length** — a 7-day range is compared
against the 7 days before it. `null` means there is no comparable prior window;
render a dash, not `0%`.

---

## 2. The table

```graphql
query Transactions($input: TransactionFilterInput!) {
  transactions(input: $input) {
    ... on ResponseWithTransactions {
      data {
        id reference status currency amount fees total
        type category
        remark
        savings_template
        flow { source destination }
        created_at completed_at
        user { id firstname lastname email avatar }
      }
      pagination { page limit pages total }
    }
    ... on Error { message code status }
  }
}
```

### Rendering the columns

| Column | Field |
|---|---|
| ID | `id` (or `reference` — see below) |
| User | `user { firstname lastname email avatar }` |
| Status | `status` |
| **Type** | **`category`** — not `type` |
| Currency | `currency` |
| Amount | `amount` |
| Narration | `remark` |
| **Flow** | `flow { source destination }` |
| Date & Time | `created_at` |

`user` is resolved lazily and is **nullable** — a transaction whose account was
since removed degrades to a null cell rather than nulling the row. Omit it from
the selection set and no lookup runs.

---

## 3. `category` — the Type taxonomy

`ETransactionType` is the **storage** enum (`FUNDING`, `INTEREST`, `CONVERT`,
`ADMIN_OUTFLOW`, …). It is not what an operator thinks in, and showing it raw is
what made the old screens read as "ROI Payout appearing inside an otherwise
deposit/withdrawal list".

`category` is the display taxonomy, derived on the server:

| `category` | Covers | Rows* |
|---|---|---|
| `DEPOSIT` | `FUNDING` | 358 |
| `WITHDRAWAL` | `WITHDRAWAL` | 443 |
| `TRANSFER` | `DEPOSIT`, `TRANSFER` | 148 |
| `ROI_PAYOUT` | `INTEREST` | 117 |
| `CONVERSION` | `CONVERT` | 15 |
| `OTHER` | `REWARD`, `TAX`, `ADMIN_OUTFLOW`, `ADMIN_REFUND` | 109 |

<sub>*Live counts at time of writing — they move with traffic. The property that
matters is the sum, not the individual figures.</sub>

**Render `category` in the Type column and filter on `category`** — then the
column and the dropdown can never disagree. It is a **strict partition**: every
stored type maps to exactly one bucket, so the six sum to the unfiltered total
(verified live: 358 + 443 + 148 + 117 + 15 + 109 = 1190 = total). No row is
dropped, none is double-counted, and "no category selected" and "all categories
selected" return the same set.

`type` is still returned if you need the underlying value.

### ⚠️ `ETransactionType.DEPOSIT` is not a deposit

This is the trap in the storage enum. `DEPOSIT` is the **internal credit leg**
written when a savings plan pays into the Flexi Wallet — a maturity payout, a
break settlement, an interest withdrawal. Every such row in production is
`gateway=MANUAL, method=WALLET, direction=IN` against a savings plan; not one
came from a payment gateway.

It is money already inside the platform moving between the customer's own
buckets, so it maps to **`TRANSFER`**, not `DEPOSIT`. Filing it under `DEPOSIT`
would overstate deposits by ₦3.58M of money that never entered the system, and
would put the Deposit filter out of step with the Total Deposits card.

`DEPOSIT` is `FUNDING` alone — **the filter sums to exactly the Total Deposits
card**, verified in both currencies (NGN 23,409,973.10, USD 9,514.60). That is
the Q8 guarantee: one metric, one calculation.

### ⚠️ `ROI_CLAWBACK` is filter-only

A clawback has **no row of its own** — it rides on the break settlement that
triggered it. So:

- **`category` never returns `ROI_CLAWBACK`.** A break settlement reports as
  `WITHDRAWAL`, because that is the money movement that actually happened.
  Reporting it as a clawback would hide a genuine withdrawal from the Withdrawal
  filter, which is the opposite of what Compliance needs.
- **Filtering on `ROI_CLAWBACK` works** and returns every row that recovered
  interest, whatever its stored type.
- **`roi_clawback_amount`** carries how much was recovered — `0` on almost every
  row. Show it in the drawer, and it is what tells you a `WITHDRAWAL` row
  matched the clawback filter.

Both clawback mechanisms are summed: `forfeited_interest` (accrued-but-unpaid
interest a Target plan loses) and `paid_interest_recovery` (upfront interest a
Fixed Deposit was already paid and the break takes back). Reading only the first
would silently drop every FD clawback.

### `category` and `type` are mutually exclusive

Sending both returns `400` ("category cannot be used together with type or
types"). Use `category` for the redesigned Type filter; `type`/`types` remain for
programmatic callers that need the storage enum.

---

## 4. `flow` — the source → destination column

Neither side is stored. Both are derived from the row, so the Flexi table, this
ledger, and the detail drawer all show identical wording for the same movement
instead of each screen inventing its own labels.

| Row | Source → Destination |
|---|---|
| Wallet funding | `Card` / `Bank Transfer` / `Paystack` / … → `NGN Flexi Wallet` |
| Plan funding | payment rail → `Target Savings` † |
| Plan payout (the `DEPOSIT` type above) | `Flex Savings` † → `NGN Flexi Wallet` |
| Plan withdrawal | `Fixed Savings` † → `NGN Flexi Wallet` |
| Wallet withdrawal | `NGN Flexi Wallet` → payment rail |
| Transfer | `NGN Flexi Wallet` → `Recipient` (or `Sender` → wallet, on the credit side) |
| Conversion | `USD Flexi Wallet` → `NGN Flexi Wallet` |
| ROI vesting | `Surd ROI` → `Fixed Savings` |
| ROI withdrawal | `ROI Earnings` → `NGN Flexi Wallet` |
| Tax | `NGN Flexi Wallet` → `Tax` |
| Admin outflow / refund | `Treasury` ↔ payment rail |

<sub>† The plan side is whichever type that row's plan actually is — see below.</sub>

### The plan side names the product

Anywhere a savings plan appears it is named by type — **`Fixed Savings`**,
**`Target Savings`**, or **`Flex Savings`** — matching how the plan is labelled
everywhere else in the UI. A bare `Savings Plan` would make a maturity payout and
a target withdrawal look like the same movement.

The type is loaded with the page, not per row, so it costs one extra query for
the whole table rather than one per transaction. It is also exposed directly as
`savings_template` (an `ETemplate`, null on wallet-only rows) if you need the
raw value rather than the sentence.

`Savings Plan` still appears as a fallback when the plan behind a transaction no
longer exists — one row in production today. The row renders normally rather
than erroring.

Both fields are **non-null strings, already human-readable** — render them
directly, don't map them again. `External` is the fallback when the rail cannot
be determined.

---

## 5. Filter reference

| Field | Type | Notes |
|---|---|---|
| `search` | `String` | Reference, currency, type, remark, and the customer's name/email are fuzzy. **`id` is matched exactly** — ids are UUIDs and hex includes `a`–`f`, so a substring match on one letter returned 1003 of 1186 rows at the time. |
| `category` | `ETransactionCategory` | The redesigned Type filter. Excludes `type`/`types`. |
| `type` / `types` | `ETransactionType` | Storage enum. Mutually exclusive with each other and with `category`. |
| `status` / `statuses` | `ETransactionStatus` | Mutually exclusive with each other. |
| `currency` | `ECurrency` | |
| `min_amount` / `max_amount` | `Float` | The amount-bucket filters. |
| `start_date` / `end_date` | `Time` | On `created_at`. |
| `user_id` | `String` | Scopes to one customer — this is what the user detail page's Transactions tab sends. |
| `savings_id` / `wallet_id` | `String` | Scope to one plan or wallet. |
| `reference` | `String` | Exact. |
| `method` | `EPaymentMethod` | |
| `pending_approval` | `Boolean` | The withdrawal approval queue. Threshold comes from Platform Configuration server-side, so this list always matches the dashboard's `pending_withdrawals`. Overrides type and status. |
| `roi_withdrawal` / `roi_activity` / `capital_transaction` | `Boolean` | Pre-existing shortcuts used by the ROI and Treasury modules. |
| `sort` / `sort_by` | | Defaults to `created_at DESC`; ties break on `id` so paging is stable. |
| `limit` / `page` / `paginate` | | `page` is 1-based. Set `paginate: true` to get `pagination`. |

**Non-admins are scoped to their own rows automatically** — a `user_id` for
somebody else resolves to "not found" rather than leaking the row.

---

## 6. The detail drawer

```graphql
query TxDetail($input: TransactionFilterInput!) {
  transaction(input: $input) {
    ... on ResponseWithTransaction {
      data {
        id reference type category status
        currency amount fees total
        roi_clawback_amount
        savings_template
        flow { source destination }
        remark
        method gateway
        pre_balance post_balance
        invoice { key name amount }
        rate { base exchange rate }
        created_at completed_at failed_at cancelled_at
        user { firstname lastname email }
      }
    }
    ... on Error { message code status }
  }
}
```

Query by `transaction_id` or `reference`.

| Drawer element | Field |
|---|---|
| Fee | `fees` |
| **Total charged** | `total` — `amount + fees`, computed server-side |
| Source / Destination | `flow { source destination }` |
| Breakdown lines | `invoice` |
| Conversion rate | `rate` |

**`amount` excludes fees by definition.** `total` is what the customer was
actually charged — use it wherever the drawer says "Total", or the two numbers
will not reconcile.

`pre_balance` / `post_balance` are the wallet balance either side of the row —
this is what makes a dispute traceable.

### The downloadable receipt

```graphql
query Receipt($input: TransactionFilterInput!) {
  transactionReceipt(input: $input) {
    ... on Response { url }
    ... on Error { message code status }
  }
}
```

Filter by `transaction_id` or `reference` — the same input as the drawer query.
It generates a PDF and returns a public link in `url`; point the download button
at that. **Completed transactions only.** Scoping matches the `transaction`
query, so a non-admin can only receipt their own row.

Not to be confused with `statement(input: StatementFilterInput!)`, which produces
a multi-transaction account statement for a period.

---

## Behaviour worth knowing

**All timestamps are Africa/Lagos day-bounded** on the server side. Send
`start_date`/`end_date` as instants; don't pre-shift them.

**Empty is not an error.** A filter matching nothing returns `data: []` with
`pagination.total = 0`. Only the `Error` branch means something failed.

**Derived fields cost nothing extra.** `category`, `flow`, `roi_clawback_amount`
and `total` are all computed from the row already in hand — no additional query.
`savings_template` costs one batched lookup for the whole page. Only `user` is a
per-row lookup, so omit it where you don't need it.

---

## What changed in this revision

If you built against an earlier version of this endpoint:

| Change | Action |
|---|---|
| `savings_funding` / `roi_withdrawals` removed | Delete those cards; use `net_flow` |
| `total_deposits_change_pct` → `..._vs_previous_period` | Rename (same for withdrawals) |
| `total_transaction_volume` widened to all types except `CONVERT` | Figure is larger than before; stop expecting it to equal deposits + withdrawals |
| `category` added | Render it in the Type column instead of `type` |
| `flow` added | Replaces any client-side source/destination guessing |
| `savings_template` added | Optional; the plan type is already inside `flow` |

---

## Error handling

```graphql
... on ResponseWithTransactions { ... }
... on Error { message code status }
```

| Status | Meaning |
|---|---|
| `400` | Mutually-exclusive filters combined, or an unsupported category. |
| `401` | Not authenticated. |
| `404` | Transaction not found, or not visible to the caller. |
| `500` | Server fault. |
