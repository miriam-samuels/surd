# Rates — Frontend Integration

**Page:** Configurations → Rates
**Purpose:** the exchange rate the platform uses for every NGN ↔ USD conversion.

This is the single source of truth for conversions system-wide — USD savings
withdrawals settling to the NGN-only Flexi Wallet, USD earnings converted to NGN,
the HNI threshold comparison, and the Treasury USD cap fallback. No module keeps
its own copy.

---

## Endpoints

| What | Operation | Type |
|---|---|---|
| The table | `rates(input: RateFilter!)` | query |
| Save the Edit modal | `rate(input: RateInput!)` | mutation |

The mutation requires **`PLATFORM_SETTINGS`**; the read does not. Hide the Edit
button for admins without it — the server enforces it regardless.

---

## 1. The table

```graphql
query Rates($input: RateFilter!) {
  rates(input: $input) {
    ... on ResponseWithRates {
      message
      data {
        id
        base
        exchange
        val
        markup
        updated_by
        user { id firstname lastname email avatar }
        updated_at
      }
    }
    ... on Error { message code status }
  }
}
```

**`input` is required but every field inside it is optional.** Send `{}` for all
pairs:

```json
{ "input": {} }
```

| Field | Type | Notes |
|---|---|---|
| `base` | `ECurrency` | The "from" currency. |
| `exchange` | `ECurrency` | The "to" currency. |
| `symbol` | `ECurrency` | Rarely used. |

Both currencies must be FIAT, and `base` cannot equal `exchange` — either
returns a `400`.

### Rendering the columns

| Column | Field | Notes |
|---|---|---|
| Currency Pair | `base` → `exchange` | e.g. `USD → NGN`. |
| Value | `val` | Render as `1 {base} = {val} {exchange}`. |
| FX Margin | `markup` | Nullable. See the warning below. |
| Effective date | **`updated_at`** | Not a separate field — see below. |
| Last Updated by | `user { … }` | Null when never edited or the admin was removed. |

### `user` is resolved on demand

`updated_by` is the admin's id; `user` is the full record, fetched **only when
you select it**. Nothing about the admin is stored on the rate row, so a rename
or a new avatar shows up on historical rows automatically.

Omit `user` from the selection set on any screen that doesn't display it and you
skip the lookup entirely.

### ⚠️ There is no `effective_date`

The mockup shows an "Effective date" column and a date picker in the Edit modal.
**Neither is backed, deliberately.**

Rates are stored one row per currency pair (`UNIQUE (base, exchange)`) and
`ExchangeRate` reads that row directly. A future date could not defer anything —
a rate saved with next month's date would take effect **immediately** while
displaying a date implying otherwise, which is worse than having no field.

So:

- **Render the Effective date column from `updated_at`.**
- **Drop the date picker from the Edit modal.** The date is a consequence of
  saving, not an input.

Real scheduling would need rate *history* — many rows per pair and a date-aware
lookup on every conversion path. Not built; raise it if Finance needs it.

### ⚠️ FX Margin is displayed but not applied

`markup` is stored, settable, and shown — but **no conversion uses it**.
`ExchangeRate` returns `val` directly. Changing the margin moves no money.

It exists because rates were once fetched from Quidax and adjusted by a spread;
that path is disabled. Render it, let admins set it, but do not describe it in
tooltips as affecting conversions until product decides whether it should.

---

## 2. The Edit modal

```graphql
mutation SaveRate($input: RateInput!) {
  rate(input: $input) {
    ... on ResponseWithRate {
      message
      data { id base exchange val markup updated_at user { firstname lastname } }
    }
    ... on Error { message code status }
  }
}
```

```json
{
  "input": {
    "base": "USD",
    "exchange": "NGN",
    "value": 1450,
    "markup": 3.0
  }
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `base` | `ECurrency!` | yes | The modal's **From**. |
| `exchange` | `ECurrency!` | yes | The modal's **To**. |
| `value` | `Float!` | yes | The rate. Note the field is `value` on input but `val` on output. |
| `markup` | `Float` | no | FX spread. |
| `quote` / `fee` / `fee_type` | | no | Not surfaced in the design. |

### It is an upsert, not an update

There is no `rate_id`. The mutation keys on `(base, exchange)` — editing the
existing `USD → NGN` and creating a brand-new pair are the same call. Two
consequences:

- **Send the pair from the row being edited**, not from a picker the admin can
  change. Changing `From`/`To` in the modal will create or overwrite a *different*
  pair, silently leaving the original untouched.
- Omitted optional fields are written as `null`. To preserve an existing
  `markup`, send it back.

`updated_by` is stamped from the authenticated admin server-side and **cannot be
set through the input** — an accountability trail the caller can set is not a
trail.

### Validation

| Condition | Status |
|---|---|
| `base` or `exchange` not FIAT | `400` |
| `base == exchange` | `400` |
| `value <= 0` | `400` |
| Not an admin | `401` |
| Missing `PLATFORM_SETTINGS` | `403` |

Surface `Error.message` — each names the specific problem.

---

## Behaviour worth knowing

**Every change is audited** under the `RATES` module, failures included.

**Both directions are independent rows.** `USD → NGN` and `NGN → USD` are
separate records with separate values and separate margins. Editing one does
**not** update the other.

> **Known data issue:** the two are currently not reciprocals —
> `USD→NGN = 1355` against `NGN→USD = 0.00073`, where the true reciprocal is
> `0.000738`. That is a **1.09% drift**, so a round-trip conversion loses about
> 1%. Nothing in the system enforces or warns about this. Worth confirming with
> whoever owns FX whether the reverse rate should be derived rather than typed.

**`rates` errors when empty.** A filter matching no rows returns a `400`
("rates not found"), not an empty list. Handle it as an empty state rather than
a failure.

---

## Error handling

```graphql
... on ResponseWithRates { ... }
... on Error { message code status }
```

| Status | Meaning |
|---|---|
| `400` | Validation, or no rates matched the filter. |
| `401` | Not authenticated, or not an admin. |
| `403` | Missing `PLATFORM_SETTINGS`. |
| `500` | Server fault. |
