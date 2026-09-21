export const ROUTES = {
  login: "/login",
  verifyEmail: "/verify-email",

  dashboard: "/dashboard",

  finance: {
    flexiWallet: "/flexi-wallet",
    savings: "/savings",
    savingsMaturities: "/savings/maturities",
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

  internal: {
    components: "/components",
    foundations: "/foundations",
  },
} as const;

export const DEFAULT_AUTHENTICATED_ROUTE = ROUTES.dashboard;

export const DEFAULT_PUBLIC_ROUTE = ROUTES.login;
