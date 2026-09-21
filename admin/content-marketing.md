# Content & Marketing — Frontend Integration

**Page:** Settings → Content & Marketing
**Purpose:** the bilingual copy shown across Surd's surfaces — mobile app, admin portal, and website — editable without a release.

---

## Endpoints

| What | Operation | Type |
|---|---|---|
| The table | `adminContents(input: AdminContentsFilterInput)` | query |
| One row (Edit modal) | `adminContent(input: AdminContentInput!)` | query |
| Add a new key | `adminCreateContent(input: AdminCreateContentInput!)` | mutation |
| Save the Edit modal | `adminUpdateContent(input: AdminUpdateContentInput!)` | mutation |
| Enable / disable | `adminSetContentStatus(input: AdminSetContentStatusInput!)` | mutation |

All require an authenticated admin. **The three mutations additionally require
`ContentMarketingPrivilege`** — an admin without it gets a `403`, so hide the
Edit and Add controls for those users rather than letting the save fail.

---

## 1. The table

```graphql
query Contents($input: AdminContentsFilterInput) {
  adminContents(input: $input) {
    ... on ResponseWithAdminContents {
      message
      data {
        id
        key
        platform
        title
        placement
        enabled
        english
        french
        updated_by_id
        updated_by { id firstname lastname email avatar }
        updated_at
      }
      pagination { page limit pages total }
    }
    ... on Error { message code status }
  }
}
```

### Variables — driven by the platform tabs

```json
{ "input": { "platform": "MOBILE_APP", "limit": 20, "page": 1, "paginate": true } }
```

The three tabs map to `EContentPlatform`:

| Tab | Value |
|---|---|
| Mobile app | `MOBILE_APP` |
| Admin | `ADMIN_PORTAL` |
| Website | `WEBSITE` |

Send `platform` on every request — switching tabs is a refetch, not a client-side
filter. Omitting it returns all three surfaces mixed together.

### Input reference

| Field | Type | Notes |
|---|---|---|
| `search` | `String` | Matches key, title, and both language bodies. |
| `platform` | `EContentPlatform` | The tab. Omit for all surfaces. |
| `placement` | `String` | Where on the surface the copy sits. Useful for grouping; the design does not expose it. |
| `limit` / `page` | `Int` | `page` is 1-based. |
| `paginate` | `Boolean` | `false` skips the count query and returns `pagination: null`. |

### Rendering the columns

| Column | Field |
|---|---|
| Key | `key` |
| English | `english` |
| French | `french` |
| Actions | Edit → opens the modal with `id` |

Both language bodies are `String!` — never null, `""` when unset. The design
truncates French with an ellipsis; that is CSS, the API returns the full text.

`id` is what every mutation takes. `key` is the identifier the *client apps* look
copy up by — do not use it as the mutation target.

---

## 2. The Edit modal

Fetch the single row so the modal opens against current values rather than a
possibly-stale table row:

```graphql
query Content($input: AdminContentInput!) {
  adminContent(input: $input) {
    ... on ResponseWithAdminContent {
      data { id key platform title placement enabled english french }
    }
    ... on Error { message code status }
  }
}
```

```json
{ "input": { "content_id": "<id>" } }
```

### Saving

```graphql
mutation UpdateContent($input: AdminUpdateContentInput!) {
  adminUpdateContent(input: $input) {
    ... on ResponseWithAdminContent {
      message
      data { id key english french updated_at updated_by { firstname lastname } }
    }
    ... on Error { message code status }
  }
}
```

```json
{
  "input": {
    "content_id": "<id>",
    "english": "Pay your future self by saving first.",
    "french":  "Payez-vous d'abord pour votre avenir."
  }
}
```

**Both languages save in one call.** Every field except `content_id` is optional
and only what you send is written, so:

- Changed English only? Send `english` alone. `french` is untouched.
- Changed neither? The API returns a **`400`** rather than silently doing nothing.

`title` and `placement` are also optional here. The modal does not show them, so
**do not send them** — echoing back stale values would overwrite a change someone
else made to those columns.

### ⚠️ `Key` is not editable

The modal renders a Key field with a placeholder, but `AdminUpdateContentInput`
has no `key`. That is deliberate: the key is the identifier client apps look copy
up by, so renaming it silently breaks whichever screen references it.

Render it **read-only** in the Edit modal. It *is* settable at creation — see below.

---

## 3. Adding a key

Not in the mockup, but the table cannot be populated without it —
`content_marketing_items` starts empty, so the page renders blank until rows exist.

```graphql
mutation CreateContent($input: AdminCreateContentInput!) {
  adminCreateContent(input: $input) {
    ... on ResponseWithAdminContent { message data { id key } }
    ... on Error { message code status }
  }
}
```

```json
{
  "input": {
    "key": "homeBannerSavingsPrompt",
    "platform": "MOBILE_APP",
    "title": "Home banner — savings prompt",
    "placement": "home_banner",
    "english": "Pay your future self by saving first.",
    "french": "Payez-vous d'abord pour votre avenir.",
    "enabled": true
  }
}
```

All fields required except `enabled`, which defaults to `true`.

**Duplicate keys return `409`** with a message naming the key. The same key is
allowed once *per platform* — mobile and website can both have
`homeBannerSavingsPrompt` with different copy. Surface `Error.message` directly.

---

## 4. Enable / disable

```graphql
mutation SetContentStatus($input: AdminSetContentStatusInput!) {
  adminSetContentStatus(input: $input) {
    ... on ResponseWithAdminContent { data { id enabled } }
    ... on Error { message code status }
  }
}
```

```json
{ "input": { "content_id": "<id>", "enabled": false } }
```

`enabled` is on every row but the mockup has no control for it. A disabled row
still appears in this table — it is hidden from the *client apps*, not from
admins. Worth a toggle or a muted row style so admins can tell the difference.

---

## Behaviour worth knowing

**Attribution comes back with the save.** `updated_by` and `updated_at` are stored
columns on the row, so a successful mutation returns the new values — no refetch
needed for those two fields.

**Empty is not an error.** A platform with no rows returns `data: []` and
`pagination.total = 0`. Only the `Error` branch means something failed.

**Every change is audited.** Create, update, and status changes each write an
`CONTENT_MARKETING` row visible in Audit Logs, including failures.

**`updated_by` is a federated `User`** and may be `null` if the admin record was
removed. Guard before reading `firstname`.

---

## Error handling

Every response is a union. Spread both branches:

```graphql
... on ResponseWithAdminContents { ... }
... on Error { message code status }
```

| Status | Meaning |
|---|---|
| `400` | Validation — nothing to update, or a required field blank. Message names it. |
| `401` | Not authenticated. |
| `403` | Missing `ContentMarketingPrivilege`. |
| `404` | `content_id` does not exist. |
| `409` | Duplicate key on that platform. |
| `500` | Server fault. |
