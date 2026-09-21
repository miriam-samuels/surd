# Platform Configuration — Frontend Integration

**Page:** Settings → Platform Configuration
**Purpose:** the platform-wide tunables Finance can change without a deploy.

---

## Endpoints

| What | Operation |
|---|---|
| The table | `adminPlatformConfigKeys` (query, no arguments) |
| Save from the Edit modal | `modifyPlatformConfig(input: PlatformConfigInput!)` (mutation) |

Both require an authenticated admin. The mutation additionally requires the
**`PlatformSettingsPrivilege`** — an admin without it gets a `403`, so hide or
disable the Edit button for those users rather than letting the save fail.

---

## 1. The table

```graphql
query PlatformConfigKeys {
  adminPlatformConfigKeys {
    ... on ResponseWithAdminPlatformConfigKeys {
      message
      data {
        key
        label
        value
        unit
        description
        updated_by_id
        updated_by_firstname
        updated_by_lastname
        updated_by_email
        updated_by_avatar
        updated_at
      }
    }
    ... on Error { message code status }
  }
}
```

No arguments, no pagination — it returns the full set every time.

### Rendering the columns

| Column | Field | Notes |
|---|---|---|
| Type | `label` | Already the display string ("Operating Buffer"). Use `key` as the React key and to route the save. |
| Value | `value` + `unit` | `value` is a plain `Float`. Format it with `unit` — see below. |
| Description | `description` | Static copy explaining what the key controls. |
| Updated by | `updated_by_*` | **Empty when the key has never been edited.** Render a dash, not a blank avatar. |
| Last updated | `updated_at` | **`null` when never edited.** UTC ISO-8601 — render in Africa/Lagos. |

### Formatting by unit

| `unit` | Render as |
|---|---|
| `PERCENTAGE` | `2.5%` |
| `NGN` | `₦5,000,000` |
| `USD` | `$1,000` |
| `HOURS` | `24 hours` |
| `DAYS` | `14 days` |

---

## 2. The Edit modal

Save through the existing mutation, sending **only the field that changed**:

```graphql
mutation SaveConfig($input: PlatformConfigInput!) {
  modifyPlatformConfig(input: $input) {
    ... on ResponseWithPlatformConfig { message data { updated_at } }
    ... on Error { message code status }
  }
}
```

```json
{ "input": { "operating_buffer_pct": 2.5 } }
```

Every field on `PlatformConfigInput` is optional. Omitted fields are left
untouched, so never send the whole object back — that would overwrite keys the
admin did not open.

### Key → input field

| `key` | Input field | Type | Unit |
|---|---|---|---|
| `OPERATING_BUFFER` | `operating_buffer_pct` | `Float` | `PERCENTAGE` |
| `LARGE_TRANSACTION_THRESHOLD` | `large_transaction_threshold` | `Float` | `NGN` |
| `HNI_THRESHOLD` | `hni_threshold` | `Float` | `NGN` |
| `WITHDRAWAL_PROCESSING_TIME` | `withdrawal_processing_hours` | `Int` | `HOURS` |
| `BANK_ACCOUNT_VERIFICATION_PERIOD` | `bank_account_verification_days` | `Int` | `DAYS` |
| `MAXIMUM_NET_CAPITAL_OUTFLOW` | `maximum_net_capital_outflow` | `Float` | `NGN` |
| `MAXIMUM_NET_CAPITAL_OUTFLOW_USD` | `maximum_net_capital_outflow_usd` | `Float` | `USD` |

Two of these take **`Int`, not `Float`** — sending `24.0` for
`withdrawal_processing_hours` is a type error.

The `value` returned by the table is a number; the design renders it as `2.5%`.
**Strip the unit before sending.** The API rejects strings.

### Validation

The server rejects negatives per field with a `400` and a specific message
("HNI threshold cannot be negative"). Surface `Error.message` directly — it
names the field. Validate `>= 0` client-side too so the modal fails fast.

### After a successful save

Refetch `adminPlatformConfigKeys`. **Updated by / Last updated will be
populated by the save itself** — they are derived from the audit trail, so
saving is the only thing needed to make them appear. There is no separate write
and no field to send.

---

## ⚠️ Three places the mockup and the API disagree

Worth settling before build.

**1. Description is not editable.** The modal shows it as a textarea, but the
copy lives in the backend and is not accepted by the mutation. It describes
behaviour that only changes when the code does. Render it **read-only**. If it
genuinely needs to be admin-editable, it needs new storage — raise it and it
can be added.

**2. Unit must not be a dropdown.** The unit is intrinsic to the key —
Operating Buffer *is* a percentage. If an admin can switch it to NGN they can
set "Operating Buffer = 2.5 NGN", and the Safe Deployable Capital formula will
still read `2.5` as a percent. Render the unit as a **fixed suffix**.

**3. Type should be locked in the Edit modal.** As a dropdown it implies you can
change which key a row *is*, which the backend cannot do. Lock it to the row
that was clicked. (A picker makes sense in an "Add key" flow — but there is no
add endpoint; the key set is fixed.)

---

## What these values actually drive

Useful for tooltips, and for knowing what a bad value breaks.

| Key | Effect |
|---|---|
| Operating Buffer | Subtracted in Safe Deployable Capital, as a % of total funds. Raising it lowers deployable capital on the Dashboard and Treasury. |
| Large-Transaction Threshold | Withdrawals at or above this are held for admin approval instead of paying out. **Converted into the transaction's own currency**, so a USD withdrawal is measured against the NGN equivalent. Lowering it grows the Pending Withdrawals queue. |
| HNI Threshold | Minimum total balance for an account to count toward the HNIs tile in Users. Non-NGN balances are converted first. |
| Withdrawal Processing Time | Hours between a withdrawal being initiated and the funds landing in Flexi. |
| Bank Account Verification Period | Days a newly linked bank account is held before it can be withdrawn to. |
| Max Net Capital Outflow (NGN / USD) | Ceiling on capital drawn out of the platform, enforced when an outflow is confirmed. |

### Note on the two capital-outflow keys

They are **not in the design's table** but are returned by this endpoint. Left
out of the UI, Finance would have no way to set the USD cap at all.

While `MAXIMUM_NET_CAPITAL_OUTFLOW_USD` is `0`, the system falls back to the NGN
cap converted at the live FX rate — so the USD ceiling drifts with the exchange
rate until a real figure is set. Worth surfacing in the UI as a hint on that row.

---

## Error handling

Every response is a union. Spread both branches:

```graphql
... on ResponseWithAdminPlatformConfigKeys { ... }
... on Error { message code status }
```

`401` unauthenticated · `403` missing `PlatformSettingsPrivilege` ·
`400` validation (message names the field) · `500` server fault.
