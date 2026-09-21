export const SCOPES = [
  "session",
  "metrics",
  "users",
  "kyc",
  "wallets",
  "savings",
  "roi",
  "treasury",
  "transactions",
  "rates",
  "products",
  "templates",
  "platform",
  "faqs",
  "liens",
  "admins",
  "audit",
  "content",
] as const;

export type Scope = (typeof SCOPES)[number];

export function queryKey(scope: Scope, ...parts: unknown[]) {
  return [scope, ...parts] as const;
}
