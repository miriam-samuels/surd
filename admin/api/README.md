# API layer

GraphQL over **`@tanstack/react-query` + `graphql-request`**.

Apollo was the other candidate and was passed over deliberately: its value is a
normalised cache, and this graph returns `Error | ResponseWithX` unions with no
stable `id` on most payloads, so normalisation buys nothing and costs a lot of
bundle. React Query gives caching, retries and invalidation over plain document
strings, which is all an admin console needs — and it is what the Jeran product
app uses, so the two codebases read the same.

```
api/
  graphql-client.ts   the fetcher: unions, tokens, 401s
  session-token.ts    where the bearer token lives, and its two clocks
  factory.ts          createQuery / createMutation
  fragments.ts        shared field selections
  query-keys.ts       cache scopes
  <domain>/
    document.ts       the GraphQL strings
    <domain>.ts       the hooks
```

Domains: `admins`, `audit`, `auth`, `content`, `dashboard`, `faq`, `kyc`,
`liens`, `platform`, `products`, `rates`, `roi`, `savings`, `transactions`,
`treasury`, `users`, `wallet`.

## Writing an endpoint

A domain module is a list of declarations, not a pile of `useQuery` bodies:

```ts
export const useAdminUsers = createQuery<AdminUserSummary[], AdminUsersFilterInput>({
  resolver: "adminUsers",
  document: ADMIN_USERS_QUERY,
  scope: "users",
  paginated: true,
});

export const useAdminUpdateUserStatus = createMutation<User, AdminUpdateUserStatusInput>({
  resolver: "adminUpdateUserStatus",
  document: ADMIN_UPDATE_USER_STATUS_MUTATION,
  success: "Account status updated.",
  invalidates: ["users", "kyc", "metrics"],
});
```

Then, in a page:

```tsx
const { data, isLoading } = useAdminUsers({ page, limit: 20, status: "ACTIVE" });
const users = data?.data ?? [];
const pages = data?.pagination?.pages ?? 1;
```

`input` is optional wherever the schema says the filter is nullable — the
factory works that out from the type, so `useAdminSystemFunds()` is legal while
`useAdminSettleTransaction` still demands its argument.

## Four things the layer guarantees

**Variables are always `input`.** Every document declares `$input`, including
the handful whose backend argument is `faq_id` or `template_id` — those map
`$input` onto the real name inside the document. Nothing above the client has
to know.

**A failure is never data.** The graph returns errors as a 200 with an `Error`
payload. `request()` reads `__typename` and throws `APIError`, so a hook's
`data` is always a success. On a screen full of balances, rendering an error
payload as a number is not a bug you want to be possible.

**Mutations never retry.** A retried mutation here is a second withdrawal.
See the note in `factory.ts`.

**Errors carry nothing sensitive.** `graphql-request` puts the whole request —
document *and variables* — into `error.message`. Those variables hold codes,
amounts and BVNs. `APIError` keeps only the message, code and status, and the
debug log is development-only.

## Session and access control

- `api/session-token.ts` — token in memory, encrypted mirror in
  `sessionStorage`, an 8-hour absolute clock and a 15-minute idle clock.
- `hooks/use-idle-timer.ts` — advances the idle clock on **interaction**, not
  on responses. React Query refetches on focus and on a timer; a clock driven
  by traffic would never expire in front of an empty chair.
- `contexts/session.tsx` — who is signed in; clears the whole query cache when
  the session ends.
- `contexts/permissions.tsx`, `types/permission.ts` — role → permissions, and
  it fails closed. This decides what is *shown*; the server decides what is
  *allowed*.
- `components/auth/` — `RequireSession`, `RequirePermission`, `Can`.

## Known backend gaps

Transcribed from `api-query.md` / `api-mutation.md` (August 2026). Everything
below is marked `FIXME(api)` or `TODO(api)` at the point it matters.

**Mutations with an empty selection set** — the playground could not expand
their return type, which usually means a stub. Return shapes are modelled on
the nearest sibling and are unverified:

| Resolver | Assumed to return |
| --- | --- |
| `adminLogin` | `Response { message }` |
| `adminUpdateUserStatus` | `ResponseWithUser` |
| `adminUpdateKYCStatus` | `ResponseWithKYC` |
| `adminSettleTransaction` | `ResponseWithTransaction` |
| `adminInitiateCapitalRefund` | `ResponseWithCapitalTransactionChallenge` |
| `adminConfirmCapitalRefund` | `ResponseWithTransaction` |

**Queries that return only `message`** — `faqs`, `products`, `savings`. This is
the exporter truncating a list type it emitted elsewhere, not a missing field:
`liens` is the same union shape and does list `data` and `pagination`. The
documents select both.

**`products` has no `... on Error` member** in the export, and takes no filter
argument, while every sibling list has both. Worth raising.

**Input field names are inferred.** The export names the input *types*
(`AdminSeriesInput`, `AdminUsersFilterInput`, …) but not their fields.
`types/filters.ts` is a proposal built from what each resolver returns and what
the console needs. Documents pass the object straight through as `input`, so a
rename there is the whole change.

**Enums.** Domain vocabularies are string `enum`s in `types/enum.ts`, so a
value carries its name at the call site and the wire string stays on the right.
The component library's variant axes (`TOAST_TONES`, `DIALOG_TONES`, …) remain
`as const` arrays — those are style-table keys, not backend contracts.

`api-enum.md` covers currency, transaction status, savings template,
frequency, withdrawal mode, source of funds and the generic `Estatus`. It does
**not** cover user status, KYC status, tier, wallet type, transaction type or
direction — those unions in `types/enum.ts` are inferred and marked. Note that
`adminUsersOverview` counts `suspended_users` and `frozen_users`, neither of
which `Estatus` names.

The module integration notes (August 2026) do name their own vocabularies, and
those are transcribed exactly: `EAuditModule`, `EAdminPrivilege`,
`EContentPlatform`, `ECancellationReason`, `TransactionCategory` and the config
units. **`accountStatus()` in `types/admin-account.ts` is the one place still
guessing**: the admin-accounts note spells the suspended value `USER_SUSPEND`
while `UserStatus` says `SUSPENDED`, so it accepts both.

**Currency mixes fiat and crypto.** `USDT` and `USDC` are four letters and make
`Intl.NumberFormat` throw; `BTC` parses but formats to two decimal places.
`lib/format.ts` handles crypto separately — do not call `Intl` on a currency
code directly.

## Notes the integration docs make that the code depends on

Each is load-bearing — undoing one produces a screen that looks right and is
wrong.

**A metric is never recomputed on the client.** `safe_deployable_capital`,
`liquidity_ratio` and `locked_savings_principal` come down already derived, and
are referenced by Treasury and ROI from the same query. `locked_savings_principal`
is not "fixed deposits": it is every fixed deposit *plus* locked-mode target
savings still running.

**`liquidity_ratio: 0` is not "uncovered".** It is zero when nothing is owed.
`liquidity_status` carries the verdict, and `healthTone()` in `stat-card.tsx`
colours it — an unrecognised status stays neutral rather than green, so a
breached platform is never painted healthy.

**`null` on a `_change_pct_*` means "no baseline", not zero.** `formatChange`
renders a dash for it and keeps a real `0%` distinct.

**The Funds Breakdown donut draws three of SYSTEM's seven keys.** Fixed and
Target *are* the Savings slice, pending withdrawals are a claim on money already
counted, and capital outflow is a flow. `SYSTEM_DONUT_KEYS` is the filter.

**Tables render `category`, never `type`.** `category` is the six-bucket display
taxonomy; `type` is storage. Filtering by both in one call is a 400, not a
merge.

**Everything renders in Africa/Lagos.** The server bounds every "today" and
"yesterday" that way, so `lib/format.ts` pins the zone rather than using the
viewer's.

## Deliberate choices worth knowing

**The transactions list asks for a minimal user.** The resolver will return the
whole customer, including a nested `kyc` block with BVN and NIN. A table
rendering fifty rows has no use for government identifiers, so
`COUNTERPARTY_FIELDS` selects a name and a face.

**KYC detail is never cached.** `staleTime: 0` — the document URLs are signed
and short-lived, so a cached copy is a broken image.

**Invalidation is coarse.** A settlement invalidates transactions, wallets,
savings, metrics and treasury. Refetching too much beats patching a cache and
getting a balance subtly wrong.
