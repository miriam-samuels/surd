/**
 * Every URL in the console, in one place.
 *
 * Import from here instead of writing string literals — renaming a route then
 * means editing one line, and TypeScript catches anything that still points at
 * the old path.
 *
 *   import { ROUTES } from "@/constants/routes";
 *   <Link href={ROUTES.users.detail("USR-8842")}>…</Link>
 */

export const ROUTES = {
  /** Unauthenticated */
  login: "/login",
  verifyEmail: "/verify-email",

  dashboard: "/dashboard",

  finance: {
    flexiWallet: "/flexi-wallet",
    savings: "/savings",
    roi: "/roi",
    vault: "/vault",
    treasury: "/treasury",
    transactions: "/transactions",
  },

  users: {
    list: "/users",
    detail: (id: string) => `/users/${id}`,
    kyc: "/kyc",
  },

  configurations: {
    rates: "/rates",
    products: "/product-configuration",
  },

  settings: {
    admins: "/admin-accounts",
    content: "/content",
    platform: "/platform-configuration",
    auditLogs: "/audit-logs",
  },

  /** Developer references, not product pages. */
  internal: {
    components: "/components",
    foundations: "/foundations",
  },
} as const;

/** Where a signed-in admin lands. */
export const DEFAULT_AUTHENTICATED_ROUTE = ROUTES.dashboard;

/** Where an unauthenticated visitor lands. */
export const DEFAULT_PUBLIC_ROUTE = ROUTES.login;
