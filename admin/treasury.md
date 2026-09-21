# Treasury — Frontend Integration

**Page:** Finance → Treasury
**Purpose:** how much capital the business can safely deploy, how much is
currently deployed out, and the record of every movement in and out.

---

## Endpoints

| What | Operation | Type |
|---|---|---|
| The six cards | `adminTreasuryOverview(input: AdminCurrencyInput)` | query |
| Liquidity Ratio Over Time | `adminTreasurySeries(input: AdminSeriesInput)` | query |
| Capital Transactions table | `transactions(input: TransactionFilterInput!)` with `capital_transaction: true` | query |
| Add Capital Outflow — step 1 | `adminInitiateCapitalOutflow` | mutation |
| Add Capital Outflow — step 2 | `adminConfirmCapitalOutflow` | mutation |
| Add a Capital Refund — step 1 | `adminInitiateCapitalRefund` | mutation |
| Add a Capital Refund — step 2 | `adminConfirmCapitalRefund` | mutation |

All four mutations require the **`TREASURY_MANAGEMENT`** privilege. Hide the two
buttons without it; the server enforces it regardless.

---

## 1. The six cards

```graphql
query Treasury($input: AdminCurrencyInput) {
  adminTreasuryOverview(input: $input) {
    ... on ResponseWithAdminTreasuryOverview {
      data {
        currency
        safe_deployable_capital
        total_capital_outflow
        total_capital_refund
        net_capital_position  net_capital_position_change_today
        liquidity_ratio       liquidity_status
        treasury_exposure_pct treasury_exposure_status
        obligations liquid_assets
      }
    }
    ... on Error { message code status }
  }
}
```

| Card | Field | Badge |
|---|---|---|
| Safe Deployable Capital | `safe_deployable_capital` | — |
| Total Capital Outflow | `total_capital_outflow` | — |
| Total Capital Refund | `total_capital_refund` | — |
| Net Capital Position | `net_capital_position` + `net_capital_position_change_today` | — |
| Liquidity Ratio | `liquidity_ratio` (render as `2.84×`) | `liquidity_status` |
| Treasury Exposure | `treasury_exposure_pct` | `treasury_exposure_status` |

**One row per currency, and nothing is converted.** Pick the row matching the
currency toggle, or pass `currency` to have the server return only one. NGN and
USD are independent books — see below.

### What the figures mean

The screen puts an ⓘ on every card. These are the definitions behind them —
all per currency, none converted.

**Safe Deployable Capital** is money the business can move out without
endangering its ability to honour what it owes customers. Start from everything
in the platform, then strip out every claim already spoken for:

```
   flexi balance
 + savings principal           (non-flexi plans)
 + ROI liability
 - net capital position        (already drawn out)
 = Total Funds in System

 - ROI liability               (interest owed to savers)
 - pending withdrawals         (large requests awaiting admin approval)
 - locked savings principal    (active, not-yet-matured, locked-withdrawal plans)
 - operating buffer            (policy % of Total Funds, set in Platform Configuration)
 = Safe Deployable Capital
```

Each deduction is a different way the money is already claimed: ROI belongs to
savers, pending withdrawals are earmarked to leave, locked principal cannot be
recalled without penalty, and the buffer is deliberate headroom.

**Do not recompute this client-side.** The components carry filters that are
easy to get subtly wrong — savings principal excludes flexi, "locked" means
locked *withdrawal mode* on an active unmatured plan rather than fixed deposits,
and pending withdrawals counts only requests at or above the large-transaction
threshold. Read `safe_deployable_capital`; it is calculated once by the
dashboard module and referenced here so both pages agree (spec Q8).

| Card | Means |
|---|---|
| Total Capital Outflow | All-time capital drawn out. Not scoped by any date filter. |
| Total Capital Refund | All-time capital returned. |
| Net Capital Position | Outflow − refund: what is *currently* deployed out. |
| Liquidity Ratio | Safe deployable ÷ obligations, as a multiple. `HEALTHY` at 1.0× or above. |
| Treasury Exposure | Net position as a share of total system funds. `HEALTHY` while inside the configured ceiling. |

`obligations` is ROI owed plus withdrawals awaiting settlement, and
`liquid_assets` is total funds minus the net position. Both are returned if you
want to show the ratio's inputs.

### Two fields are nullable

`liquidity_ratio` is `null` when there are no obligations to cover (dividing by
zero is not "infinitely healthy"), and `treasury_exposure_pct` is `null` when
there are no system funds to express the position against. Render a dash, not
`0`.

### The change figure

`net_capital_position_change_today` is an **absolute** change since the start of
today in Africa/Lagos, taken from the start-of-day snapshot — not a percentage.
The mock's `+₦890K today` is this field.

---

## 2. Liquidity Ratio Over Time

```graphql
query TreasurySeries($input: AdminSeriesInput) {
  adminTreasurySeries(input: $input) {
    ... on ResponseWithAdminTreasurySeries {
      data { date safe_deployable_capital_pct obligations_pct liquidity_ratio }
    }
    ... on Error { message code status }
  }
}
```

The two plotted series are **percentages of total system funds**, which is what
lets them share one 0–100% axis: `safe_deployable_capital_pct` is the green
line, `obligations_pct` the red one. `liquidity_ratio` rides along on each point
if you want it in the tooltip.

---

## 3. Capital Transactions table

Served by the shared ledger query, scoped to capital movements:

```graphql
query CapitalTransactions($input: TransactionFilterInput!) {
  transactions(input: $input) {
    ... on ResponseWithTransactions {
      data {
        id reference type currency amount created_at
        user { id firstname lastname avatar }
      }
      pagination { page limit pages total }
    }
    ... on Error { message code status }
  }
}
```

```json
{ "input": { "capital_transaction": true, "limit": 5, "page": 1, "paginate": true } }
```

| Column | Field |
|---|---|
| ID | `reference` (or `id`) |
| Currency | `currency` |
| Amount | `amount` |
| **Status** | **`type`** — see below |
| Authorized by | `user { firstname lastname avatar }` |
| Date & Time | `created_at` |

### ⚠️ The Status badge reads `type`, not `category`

This is the one place the ledger's `category` field is the wrong choice.
`ADMIN_OUTFLOW` and `ADMIN_REFUND` both fall into `category: OTHER`, because the
redesign's six-bucket taxonomy describes *customer* money movement and capital
movement is not one of those buckets. Rendering `category` here would label every
row "Other".

Map `type` directly:

| `type` | Badge |
|---|---|
| `ADMIN_OUTFLOW` | **Outflow** (red) |
| `ADMIN_REFUND` | **Refund** (green) |

Everywhere else in the ledger, keep using `category` — see
[transaction-history.md](transaction-history.md).

### Filters

Every control on the screen maps to the shared filter input:

| Control | Field |
|---|---|
| Status → All / Outflow / Refund | omit, or `type: ADMIN_OUTFLOW` / `ADMIN_REFUND` |
| Currency → NGN / USD | `currency` |
| Amount → Below ₦100K, ₦100K–₦1M, ₦1M–₦10M, Above ₦10M | `min_amount` / `max_amount` |
| Authorized by → admin | `user_id` (capital rows store the authorizing admin) |
| Date → Today / This week / This month / This year / Custom | `start_date` / `end_date` |
| Sort → Ascending / Descending | `sort` |
| Search | `search` |

`capital_transaction: true` must stay set alongside them, or the query widens to
the whole ledger.

---

## 4. Recording an outflow or a refund

Both are **two-step**: initiate, then confirm with a second factor.

### Step 1 — initiate

```graphql
mutation InitiateOutflow($input: AdminInitiateCapitalOutflowInput!) {
  adminInitiateCapitalOutflow(input: $input) {
    ... on ResponseWithCapitalTransactionChallenge {
      data { challenge_id expires_at type currency amount method }
    }
    ... on Error { message code status }
  }
}
```

```json
{ "input": { "amount": 85000000, "currency": "NGN",
             "reason": "EXTERNAL_INVESTMENT", "description": "optional note" } }
```

Refund takes the same shape without `reason`:

```json
{ "input": { "amount": 50000, "currency": "USD", "description": "optional" } }
```

**`currency` is required on both.** The platform keeps separate NGN and USD
books with separate configured ceilings, so a movement without a currency is
meaningless — there is no shared pool to draw from.

`description` is optional and capped at **256 characters**, matching the modal's
`0 / 256` counter. It is counted in characters, not bytes, so a `₦` costs one.

### Step 2 — confirm

```graphql
mutation ConfirmOutflow($input: AdminConfirmCapitalTransactionInput!) {
  adminConfirmCapitalOutflow(input: $input) {
    ... on ResponseWithTransaction { message data { id reference amount status } }
    ... on Error { message code status }
  }
}
```

```json
{ "input": { "challenge_id": "<from step 1>", "code": "123456" } }
```

The challenge lives for a few minutes and is single-use. Confirming a second
time returns `400`.

### ⚠️ `method` decides which prompt to show

The **`method`** field on the challenge tells you which second factor was issued:

| `method` | Prompt |
|---|---|
| `APP` | "Enter the code from your authenticator app" |
| `EMAIL` | "Enter the code we sent to your email" |

An admin with an authenticator linked gets `APP` and no email. An admin without
one gets `EMAIL` and a six-digit code in their inbox. **Do not hardcode the
authenticator wording** — today every admin resolves to `EMAIL`, because the
admin UI has no authenticator-setup screen yet.

The code is checked against the method the challenge was issued for; a TOTP will
not satisfy an `EMAIL` challenge or vice versa.

---

## 5. Guard rails the UI should surface

Both mutations can refuse at **confirm** time, after the code is accepted. Show
the server's message rather than a generic failure — each one names the limit
that was hit.

| Refusal | When |
|---|---|
| `insufficient system funds to record this capital outflow` | The outflow exceeds what is actually in that currency's book |
| `capital outflow exceeds the configured maximum net capital outflow for NGN` | The outflow exceeds the ceiling set in Platform Configuration |
| `capital refund exceeds the outstanding NGN capital outflow of 200000.00` | You cannot return more than was taken |
| `there is no outstanding USD capital outflow to refund` | Nothing has been drawn out of that currency |

### ⚠️ The USD ceiling may be in force even when it reads 0

Platform Configuration holds a separate ceiling per currency. **When the USD one
is unset (0), the NGN ceiling converted at the live rate is enforced instead** —
otherwise 0 would mean "deny every dollar outflow" and USD would be unusable
until Finance filled the field in.

So a `capital outflow exceeds the configured maximum net capital outflow for USD`
refusal is possible even though the config screen shows `0`. Two consequences
worth surfacing in the UI:

- The effective USD ceiling **moves with the FX rate** until a real figure is set.
- Setting an explicit USD value makes it win, and the figure stops drifting.

The config screen deliberately shows the stored `0` rather than the converted
figure, so an unset field never looks configured.

### Why a refund is capped

Total Funds in System *subtracts* the net capital position. Refunding more than
was taken makes that position negative, and subtracting a negative **adds** —
inventing money that was never in the platform. Safe Deployable Capital derives
from Total Funds, so the invented amount would then become drawable. The cap is
per currency: an NGN refund settles the NGN drawdown only.

---

## 6. Who gets emailed

Capital movement is not private to the admin performing it.

| Moment | Recipients |
|---|---|
| Initiate (outflow or refund) | Every `TREASURY_MANAGEMENT` holder — "X is attempting to lodge a …" |
| Confirm (outflow or refund) | Every `TREASURY_MANAGEMENT` holder — "… recorded", with reference and resulting deployable capital |

The initiator is inside that set rather than mailed separately, so they receive
one email per stage, not two. An admin whose session is compromised therefore
hears about a movement they did not start, whichever second factor they use.

Emails are best-effort and never block the transaction. The **`EMAIL`
verification code is the exception** — if that send fails, initiate fails, since
the admin would otherwise have no way to confirm.

---

## Behaviour worth knowing

**NGN and USD never mix.** Every card, every ceiling and every guard is per
currency, and no FX conversion is applied anywhere in this module. Do not sum
the two rows.

**Cards are cumulative and point-in-time** — `total_capital_outflow` is all-time,
not scoped to a date filter.

**Empty is not an error.** No capital movements yet returns `data: []` with
`pagination.total = 0` — the design's "No Capital Transactions Record Yet" state.

---

## Error handling

| Status | Meaning |
|---|---|
| `400` | Validation, an expired or reused challenge, a wrong code, or a guard rail above. |
| `401` | Not authenticated, or not an admin. |
| `403` | Missing `TREASURY_MANAGEMENT`, or the admin account is not active. |
| `429` | Too many verification attempts; wait and retry. |
| `500` | Server fault. |
