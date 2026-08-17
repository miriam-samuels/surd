/**
 * Sample data for the Configurations and Settings modules.
 *
 * Shaped like the API response so swapping in a fetch touches this file only.
 */

export type Currency = "NGN" | "USD";

/** Currency for a flag lookup. */
export const CURRENCY_COUNTRY: Record<Currency, string> = {
  NGN: "NG",
  USD: "US",
};

export type Editor = {
  name: string;
  email: string;
};

const EDITOR: Editor = { name: "Benjamin Masebinu", email: "ben@gmail.com" };

/* ------------------------------------------------------------------- rates */

export type ExchangeRate = {
  id: string;
  from: Currency;
  to: Currency;
  value: string;
  fxMargin: string;
  effectiveDate: string;
  updatedBy: Editor;
};

export const EXCHANGE_RATES: ExchangeRate[] = [
  {
    id: "rate-1",
    from: "USD",
    to: "NGN",
    value: "1 USD = ₦1,450",
    fxMargin: "+3.00%",
    effectiveDate: "12 Mar, 2024. 7:00PM",
    updatedBy: EDITOR,
  },
  {
    id: "rate-2",
    from: "NGN",
    to: "USD",
    value: "1 NGN = $0.00069",
    fxMargin: "+2.00%",
    effectiveDate: "13 Mar, 2024. 8:00PM",
    updatedBy: EDITOR,
  },
];

/* ---------------------------------------------------- product configuration */

export const PRODUCTS = [
  {
    id: "target-savings",
    title: "Target savings",
    description: "Configure templates and fees",
  },
  {
    id: "fixed-deposit",
    title: "Fixed deposit",
    description: "Configure interest rates and limits",
  },
  {
    id: "flexi-wallet",
    title: "Flexi Wallet",
    description: "Configure limits and thresholds",
  },
] as const;

export type ProductId = (typeof PRODUCTS)[number]["id"];

export type SavingsTemplate = {
  id: string;
  name: string;
  mode: string;
  currencies: Currency[];
  status: "active" | "suspended";
  lastUpdated: string;
};

export const SAVINGS_TEMPLATES: SavingsTemplate[] = [
  "Japa/Study Abroad",
  "Rent Payment",
  "Business Capital",
  "Buy a Car",
  "Gadgets",
  "Wedding",
  "School fees",
  "Vacation",
].map((name, index) => ({
  id: `tpl-${index}`,
  name,
  mode: "Locked, Flexible",
  currencies: ["NGN", "USD"] as Currency[],
  status: "active" as const,
  lastUpdated:
    index === 0 ? "12 Mar, 2024. 7:00PM" : "13 Mar, 2024. 8:00PM",
}));

export type FeeCharge = {
  id: string;
  name: string;
  appliesTo: string;
  currencies: Currency[];
  value: string;
  effectiveDate: string;
};

/** The dropdown options in the Edit Configuration dialog. */
export const FEE_TYPES = [
  "Interest Rate",
  "Break Fee",
  "ROI Clawback",
  "Early Withdrawal Penalty",
  "Max Withdrawal",
  "Min Deposit",
] as const;

export const TARGET_FEES: FeeCharge[] = [
  { name: "Interest Rate", value: "2%" },
  { name: "Break Fee", value: "2%" },
  { name: "ROI Clawback", value: "2%" },
  { name: "Early Withdrawal Penalty", value: "2%" },
  { name: "Max Withdrawal", value: "₦100.00" },
  { name: "Min. Deposit", value: "₦100.00" },
].map((fee, index) => ({
  id: `fee-${index}`,
  name: fee.name,
  appliesTo: "All Templates",
  currencies: ["NGN", "USD"] as Currency[],
  value: fee.value,
  effectiveDate:
    index === 0 ? "12 Mar, 2024. 7:00PM" : "13 Mar, 2024. 8:00PM",
}));

export type Tenure = {
  id: string;
  duration: string;
  rates: { currency: Currency; rate: string }[];
  effectiveDate: string;
  updatedBy: Editor;
};

export const TENURES: Tenure[] = ["30 days", "60 days", "90 days"].map(
  (duration, index) => ({
    id: `tenure-${index}`,
    duration,
    rates: [
      { currency: "NGN" as Currency, rate: "14%" },
      { currency: "USD" as Currency, rate: "14%" },
    ],
    effectiveDate: ["13 Mar, 2024. 8:00PM", "14 Mar, 2024. 9:00PM", "12 Mar, 2024. 7:00PM"][index],
    updatedBy: EDITOR,
  }),
);

export const FIXED_DEPOSIT_FEES: FeeCharge[] = [
  { name: "Max Withdrawal", currency: "NGN" as Currency, value: "₦1,000,000.00" },
  { name: "Min. Deposit", currency: "NGN" as Currency, value: "₦100.00" },
  { name: "Max Withdrawal", currency: "USD" as Currency, value: "$1000" },
  { name: "Min. Deposit", currency: "USD" as Currency, value: "$1" },
].map((fee, index) => ({
  id: `fd-fee-${index}`,
  name: fee.name,
  appliesTo: "All tenures",
  currencies: [fee.currency],
  value: fee.value,
  effectiveDate:
    index === 0 ? "12 Mar, 2024. 7:00PM" : "13 Mar, 2024. 8:00PM",
}));

export type FlexiRate = {
  id: string;
  currency: Currency;
  type: string;
  rate: string;
  effectiveDate: string;
  updatedBy: Editor;
};

export const FLEXI_RATES: FlexiRate[] = [
  {
    id: "flexi-ngn",
    currency: "NGN",
    type: "ROI",
    rate: "10 %",
    effectiveDate: "13 Mar, 2024. 8:00PM",
    updatedBy: EDITOR,
  },
  {
    id: "flexi-usd",
    currency: "USD",
    type: "ROI",
    rate: "10 %",
    effectiveDate: "13 Mar, 2024. 8:00PM",
    updatedBy: EDITOR,
  },
];

/* ---------------------------------------------------------- admin accounts */

export const ADMIN_ROLES = [
  "Super Admin",
  "Admin",
  "Finance",
  "Support",
  "Legal",
  "Content & Marketing",
] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];

export const ADMIN_PERMISSIONS = [
  { id: "view-audit-logs", label: "View Audit Logs" },
  { id: "edit-records", label: "Edit Records" },
  { id: "export-reports", label: "Export Reports" },
  { id: "override-limits", label: "Override Limits" },
] as const;

export type AdminAccount = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: "active" | "suspended" | "pending invite";
  dateAdded: string;
  lastLogin: string;
  permissions: string[];
};

export const ADMIN_ACCOUNTS: AdminAccount[] = (
  [
    ["Super Admin", "active"],
    ["Admin", "pending invite"],
    ["Finance", "suspended"],
    ["Support", "active"],
    ["Legal", "active"],
    ["Content & Marketing", "active"],
  ] as [AdminRole, AdminAccount["status"]][]
).map(([role, status], index) => ({
  id: `ADM-00${index + 1}`,
  name: "Benjamin Masebinu",
  email: "ben@gmail.com",
  role,
  status,
  dateAdded: ["12 Mar, 2024. 7:00PM", "13 Mar, 2024. 8:00PM", "14 Mar, 2024. 9:00PM"][
    Math.min(index, 2)
  ],
  lastLogin: ["12 Mar, 2024. 7:00PM", "13 Mar, 2024. 8:00PM", "14 Mar, 2024. 9:00PM"][
    Math.min(index, 2)
  ],
  permissions: ["view-audit-logs", "edit-records"],
}));

/* ------------------------------------------------------ content & marketing */

export const CONTENT_PLATFORMS = ["Mobile app", "Admin", "Website"] as const;
export type ContentPlatform = (typeof CONTENT_PLATFORMS)[number];

export const CONTENT_PLACEMENTS = [
  "Home banner",
  "Onboarding",
  "Empty state",
  "Push notification",
] as const;

export type ContentEntry = {
  id: string;
  key: string;
  title: string;
  placement: string;
  english: string;
  french: string;
  updatedBy: Editor;
  lastUpdated: string;
};

export const CONTENT_ENTRIES: ContentEntry[] = Array.from(
  { length: 6 },
  (_, index) => {
    const isSavings = index % 2 === 0;
    return {
      id: `CNT-00${index + 1}`,
      key: `CNT-00${index + 1}`,
      title: isSavings ? "Home banner — savings prompt" : "USD conversion prompt",
      placement: "Home banner",
      english: isSavings
        ? "Pay your future self by saving first."
        : "Convert your USD earnings today.",
      french: isSavings
        ? "Payez-vous d'abord pour votre avenir."
        : "Convertissez vos gains en USD.",
      updatedBy: EDITOR,
      lastUpdated: ["12 Mar, 2024. 7:00PM", "13 Mar, 2024. 8:00PM", "14 Mar, 2024. 9:00PM"][
        Math.min(index, 2)
      ],
    };
  },
);

/* ---------------------------------------------------- platform configuration */

export type PlatformConfig = {
  id: string;
  type: string;
  value: string;
  /** Percentage, currency or duration — drives the unit selector. */
  unit: "percentage" | "currency" | "duration";
  description: string;
  updatedBy: Editor;
  lastUpdated: string;
};

export const PLATFORM_CONFIGS: PlatformConfig[] = [
  {
    id: "operating-buffer",
    type: "Operating Buffer",
    value: "2.5%",
    unit: "percentage",
    description:
      "Policy-set safety margin subtracted in the Safe Deployable Capital formula. Platform-wide — not overridable per product.",
    updatedBy: EDITOR,
    lastUpdated: "12 Mar, 2024. 7:00PM",
  },
  {
    id: "large-transaction-threshold",
    type: "Large-Transaction Threshold (Default)",
    value: "₦5,000,000",
    unit: "currency",
    description:
      "Platform-wide default amount that flags a withdrawal into the Pending Withdrawals admin-approval queue. Individual products may set their own override in Product Configuration; the override wins for that product, this default covers every product that hasn't set one.",
    updatedBy: EDITOR,
    lastUpdated: "13 Mar, 2024. 8:00PM",
  },
  {
    id: "hni-threshold",
    type: "HNI Threshold",
    value: "₦50,000,000",
    unit: "currency",
    description:
      "Minimum total balance for an account to count toward the “HNIs” metric in the Users module.",
    updatedBy: EDITOR,
    lastUpdated: "13 Mar, 2024. 8:00PM",
  },
  {
    id: "withdrawal-processing-time",
    type: "Withdrawal Processing Time",
    value: "24 hours",
    unit: "duration",
    description:
      "The time between when a user initiates a withdrawal (or breaks a savings plan) and when the funds become available in their Flexi Wallet.",
    updatedBy: EDITOR,
    lastUpdated: "13 Mar, 2024. 8:00PM",
  },
  {
    id: "bank-verification-period",
    type: "Bank Account Verification Period",
    value: "14 days",
    unit: "duration",
    description:
      "Hold period before a newly linked bank account becomes active for withdrawals, per the product brief.",
    updatedBy: EDITOR,
    lastUpdated: "13 Mar, 2024. 8:00PM",
  },
];

/* -------------------------------------------------------------- audit logs */

export const AUDIT_MODULES = [
  "Finance",
  "Users",
  "Configurations",
  "Settings",
] as const;

export type AuditEntry = {
  id: string;
  timestamp: string;
  admin: Editor;
  module: string;
  action: string;
  ipAddress: string;
  device: string;
  browser: string;
};

export const AUDIT_ENTRIES: AuditEntry[] = [
  {
    module: "Finance",
    action: "Updated FX Margin (1.5% → 2.0%)",
    device: "Windows 11",
    browser: "Chrome 137",
  },
  {
    module: "Users",
    action: "User suspended for breach",
    device: "MacBook Pro M2",
    browser: "Chrome 138",
  },
  {
    module: "Finance",
    action: "Target template created for new savings goal",
    device: "MacBook Pro M2",
    browser: "Chrome 138",
  },
  {
    module: "Settings",
    action: "Admin login",
    device: "MacBook Pro M2",
    browser: "Chrome 138",
  },
  {
    module: "Configurations",
    action: "90-day NGN rate edited from +1% to +2%",
    device: "Windows 11",
    browser: "Chrome 137",
  },
].map((entry, index) => ({
  id: `audit-${index}`,
  timestamp: "13 Mar, 2024. 8:00: 00 PM",
  admin: EDITOR,
  ipAddress: "102.89.xxx.xxx",
  ...entry,
}));
