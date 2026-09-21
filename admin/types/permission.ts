export enum AdminRole {
  SuperAdmin = "SUPER_ADMIN",

  Admin = "ADMIN",

  Compliance = "COMPLIANCE",

  Treasury = "TREASURY",

  Support = "SUPPORT",

  Viewer = "VIEWER",
}

export const FALLBACK_ROLE = AdminRole.Viewer;

export enum Permission {
  DashboardView = "dashboard.view",

  FinanceView = "finance.view",

  TreasuryMove = "treasury.move",
  TransactionsSettle = "transactions.settle",

  UsersView = "users.view",

  UsersManage = "users.manage",
  KycView = "kyc.view",
  KycDecide = "kyc.decide",

  LiensManage = "liens.manage",

  ConfigView = "config.view",

  ConfigManage = "config.manage",

  PlatformManage = "platform.manage",
  ContentManage = "content.manage",

  AdminsManage = "admins.manage",
  AuditView = "audit.view",
}

const READ_ONLY: readonly Permission[] = [
  Permission.DashboardView,
  Permission.FinanceView,
  Permission.UsersView,
  Permission.KycView,
  Permission.ConfigView,
];

export const ROLE_PERMISSIONS: Record<AdminRole, readonly Permission[]> = {
  [AdminRole.SuperAdmin]: Object.values(Permission),

  [AdminRole.Admin]: [
    ...READ_ONLY,
    Permission.TreasuryMove,
    Permission.TransactionsSettle,
    Permission.UsersManage,
    Permission.KycDecide,
    Permission.LiensManage,
    Permission.ConfigManage,
    Permission.ContentManage,
    Permission.AuditView,
  ],

  [AdminRole.Compliance]: [
    ...READ_ONLY,
    Permission.UsersManage,
    Permission.KycDecide,
    Permission.LiensManage,
    Permission.AuditView,
  ],

  [AdminRole.Treasury]: [
    ...READ_ONLY,
    Permission.TreasuryMove,
    Permission.TransactionsSettle,
    Permission.AuditView,
  ],

  [AdminRole.Support]: READ_ONLY,

  [AdminRole.Viewer]: READ_ONLY,
};

function matchRole(role: string | null | undefined): AdminRole | null {
  const upper = role?.toUpperCase().replace(/[\s-]/g, "_");
  return (Object.values(AdminRole) as string[]).includes(upper ?? "")
    ? (upper as AdminRole)
    : null;
}

/**
 * Whether this role gets into the console at all.
 *
 * Unlike `toAdminRole` it never falls back: an unknown or missing role is a
 * no, not a Viewer. Using `toAdminRole` here would admit every account, since
 * it answers with a real role for any input.
 */
export function isAdminRole(role: string | null | undefined): boolean {
  return matchRole(role) !== null;
}

/** The role's permissions, defaulting to the least privileged set. */
export function toAdminRole(role: string | null | undefined): AdminRole {
  return matchRole(role) ?? FALLBACK_ROLE;
}
