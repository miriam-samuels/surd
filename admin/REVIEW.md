# Things to check personally

Everything from the thirteen integration notes is wired up, typechecks, lints
and builds. This file is only the parts where I had to **decide something the
docs did not settle**, or where the code is now betting on an unverified fact.

Ordered by how much it costs you if I got it wrong.

---

## 1. Wire values I changed or guessed

These are the highest-risk items: a wrong string here fails silently at runtime,
not at build time.

### 1a. `KycStatus` — I changed all four values ⚠️

`kyc-compliance.md` names them explicitly with a `KYC_` prefix, and the existing
enum had them unprefixed. I trusted the doc.

| Was (inferred) | Now (from the doc) |
| --- | --- |
| `PENDING` | `KYC_PENDING` |
| — | `KYC_PROCESSING` |
| `VERIFIED` | `KYC_VERIFIED` |
| `REJECTED` | `KYC_REJECTED` |
| `SUSPENDED` | *(dropped — not in the doc's list)* |

**Check:** hit `adminKYCs` and confirm the `status` strings coming back. If the
old unprefixed values are real, every KYC status badge and both decision
buttons break. `types/enum.ts`.

### 1b. `UserStatus` — unresolved contradiction, left as-is ⚠️

`admin-accounts.md` says suspending sets **`USER_SUSPEND`**; `users.md` says
closing sets **`USER_DELETED`**. Our `UserStatus` enum (inferred, never
verified) says `SUSPENDED` and `DELETED`.

So the wire values are probably `USER_`-prefixed like the KYC ones, and our enum
is probably wrong — but no doc lists the full set, so I did not guess at all
seven. `accountStatus()` in `types/admin-account.ts` accepts **both** spellings
as a stopgap.

**Check:** ask the backend for the full `EUserStatus`. Until then, the Users
list status filter may silently match nothing, and a suspended admin may show as
"Active" on Admin Accounts.

### 1c. Capital outflow `reason` — I invented two of three values

`treasury.md` shows `"reason": "EXTERNAL_INVESTMENT"` and says it is an enum but
never lists it. I put three options in the dropdown:

```
EXTERNAL_INVESTMENT   ← from the doc
OPERATIONAL_EXPENSE   ← invented
OTHER                 ← invented
```

**Check:** get the real enum. Picking either invented value will 400 at initiate
time. `app/(dashboard)/treasury/page.tsx`.

---

## 2. Where the API can't do what the design asks

Three places I could not build the screen as drawn. Each is a `FIXME(api)` in
the code and needs a backend decision, not a frontend one.

### 2a. ROI Activity has no Type filter

The design has a Credited / Withdrawn / Clawed Back dropdown.
`TransactionFilterInput` has no `roi_activity_type` field.

I **left the filter out**. Filtering the fetched page client-side would show 3
rows under a "200 results" pagination footer, which is worse than no filter. The
Type column still renders the value.

**Ask for:** `roi_activity_type` on `TransactionFilterInput`.

### 2b. Flexi Wallet's transaction table isn't actually scoped to Flexi

`flexi-wallet.md` says "there is no Flexi-specific endpoint, so scope it
yourself" — but the filter input has no wallet-type field, only per-account
`wallet_id`. Currency is as narrow as it gets, so **that panel currently shows
platform activity in the selected currency**, not Flexi activity.

**Ask for:** `wallet_type` on `TransactionFilterInput`.

### 2c. Transaction History type filter is single-select, not multi

The doc is explicit that `category` takes one value and combining it with
`type`/`types` is a 400. The design's dropdown looks multi-select. I kept the
multi-select control but made it keep only the last pick, so it behaves as
single-select.

**Decide with design:** either make it visually single-select, or ask backend
for a `categories` array.

---

## 3. Design decisions I made — worth a sanity check

Places the docs flagged a mockup/API disagreement and told me to pick. I picked;
you may disagree.

| Where | What I did | Why |
| --- | --- | --- |
| **Audit Logs → Module column** | Renders the **group** ("Finance"), not the raw value ("Treasury") | The doc says pick one deliberately — a filter labelled Finance returning rows labelled Treasury reads like a bug |
| **Audit Logs → Status column** | **Added** one (not in the design) | The doc argues "admin login failed ×12" is what an auditor most wants and is otherwise invisible |
| **Admin Accounts → Reactivate** | **Added** a button (not in the mockup) | Without it, a suspension is irreversible from the UI |
| **KYC → Approve/Reject** | **Added** buttons (not in the mockup) | The doc: "without them a reviewer can read a document but not act on it" |
| **Content → enable/disable** | **Added** a Live toggle column | A disabled row is otherwise indistinguishable from a live one |
| **Content → Add key** | **Added** a create modal | `content_marketing_items` starts empty, so the page renders blank forever without it |
| **Rates → Effective date picker** | **Removed** it | Not backed; a future date would take effect immediately while displaying otherwise |
| **Rates → From/To dropdowns** | Made them **read-only** | The mutation is an upsert on `(base, exchange)` — a changed pair silently creates a different row |
| **Platform Config → unit dropdown** | Made it a **fixed suffix** | Otherwise "Operating Buffer = 2.5 NGN" is settable and the formula still reads 2.5 as a percent |
| **Platform Config → description** | Made it **read-only** | The mutation doesn't accept it |
| **Savings → status filter** | Dropped "Matured" | `SavingStatus` has no such value; `COMPLETED` covers matured and broken |

Two things I did **not** add, both flagged in the docs as possible but with no
design: role management CRUD (`adminCreateRole` etc.), and the Treasury
`obligations`/`liquid_assets` figures.

---

## 4. Two display bugs I fixed along the way

Not asked for, but they were actively misleading:

- **`StatCard`'s `note` was hardcoded green.** So `liquidity_status: CRITICAL`
  and `treasury_exposure_status: BREACH` would both have rendered in reassuring
  green. Added `healthTone()`, which maps HEALTHY→green, WARN→orange,
  CRITICAL→red, and **anything unrecognised→neutral grey** rather than
  defaulting to green. See `components/dashboard/stat-card.tsx`.
  **Check:** the real status vocabulary, so the regexes there actually match.

- **Absolute change figures were also always green.** A ROI liability that
  *fell* ₦5M rendered identically to one that rose ₦5M. `formatAbsoluteChange`
  now carries a direction.

---

## 5. Assumptions in shared code

- **Date presets.** `hooks/use-date-range.ts` — I invented four (7d / 30d / 12m
  / all time) and pair granularity with span automatically. No doc specified
  these; the designs just say "Period" and "Range".
- **`start_date`/`end_date` naming.** The docs use these; the old
  `types/filters.ts` used `from`/`to`. I renamed everything to match the docs.
  **Check** one series query actually accepts them.
- **`pagination.total`.** Every doc's example selects it; the old fragment did
  not. Added. If the field doesn't exist, every paginated table errors.
- **Search debounce** is 350ms (`hooks/use-debounced.ts`). Arbitrary.
- **Page size** is 20 everywhere, matching the docs' default.

---

## 6. Things the docs told us to raise with the backend

Carried forward verbatim so they don't get lost — none are frontend work:

1. **Rates are not reciprocals.** `USD→NGN = 1355` vs `NGN→USD = 0.00073`
   (true reciprocal `0.000738`) — a **1.09% round-trip loss**, unenforced and
   unwarned. Confirm with whoever owns FX.
2. **FX Margin is stored, settable, displayed — and applied to nothing.** No
   conversion path reads it. I label it "not applied to conversions" on the
   table rather than describing it as a spread.
3. **`Saving.user` is declared `User!` but resolved lazily**, so a deleted
   customer nulls the *entire row*. Savings tables will show gaps until the
   schema drops the `!`.
4. **`rates` returns a 400 when empty**, not an empty list. Handled as an empty
   state, but it's an odd contract.
5. **No short human-readable user id.** The mock shows `USR-8842`; the real `id`
   is a UUID. The table prints the UUID.
6. **`adminPrivileges` has 10 values; the mockup shows 4**, two of which
   (`EDIT_RECORDS`, `OVERRIDE_LIMITS`) don't exist. The checklist is driven off
   the endpoint. Confirm the mockup was illustrative.

---

## 7. Fastest way to smoke-test

Once pointed at a live endpoint, these six clicks cover the risky paths:

1. **KYC page** → do the status badges render, or say "—"? (validates §1a)
2. **Admin Accounts** → is a suspended admin labelled "Suspended"? (validates §1b)
3. **Any table** → does pagination show a real page count? (validates
   `pagination.total`)
4. **Treasury** → start an outflow. Does initiate succeed? (validates §1c and
   the two-step challenge)
5. **Dashboard** → do the four hero cards show numbers, or "…" stuck forever?
   (validates the renamed metric fields)
6. **Dashboard → reject a withdrawal** → the reason dropdown must be required
   and the modal must appear before anything moves.

Note that **every page load writes an audit row**, including Audit Logs itself —
so expect your own smoke test to show up in the log.
