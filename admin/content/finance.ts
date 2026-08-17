import type { Currency } from "@/content/configuration";

/**
 * Sample data for the Finance module.
 *
 * Shaped like the API response so each page reads a typed array and swapping
 * in a fetch touches this file only.
 *
 * NOTE: the Finance screens were not among the readable Figma frames, so these
 * pages follow the console's established patterns — page header, headline
 * stats, filterable table — rather than replicating a specific comp. Confirm
 * the columns and metrics with design before they ship.
 */

export type MoneyFlow = "credit" | "debit";

/* ------------------------------------------------------------ flexi wallet */

export type WalletHolder = {
  id: string;
  name: string;
  email: string;
  currency: Currency;
  balance: string;
  lastActivity: string;
  status: "active" | "suspended";
};

const HOLDER_NAMES = [
  "Aisha Bello",
  "Patrick Adanini",
  "Liam Chen",
  "Sophia Martinez",
  "Ava Patel",
  "Benjamin Masebinu",
];

export const WALLET_HOLDERS: WalletHolder[] = HOLDER_NAMES.map(
  (name, index) => ({
    id: `WAL-88${40 + index}`,
    name,
    email: `${name.split(" ")[0].toLowerCase()}@mail.com`,
    currency: index % 3 === 0 ? "USD" : "NGN",
    balance:
      index % 3 === 0
        ? `$${(12_400 + index * 830).toLocaleString()}.00`
        : `₦${(4_820_000 + index * 315_000).toLocaleString()}.00`,
    lastActivity: ["12 Mar, 2024. 7:00PM", "13 Mar, 2024. 8:00PM", "14 Mar, 2024. 9:00PM"][
      index % 3
    ],
    status: index === 1 ? "suspended" : "active",
  }),
);

export const FLEXI_WALLET_SUMMARY = {
  totalNgn: "₦1.82B",
  totalUsd: "$1.24M",
  holders: "18,402",
  netFlowToday: "+₦42.8M",
} as const;

/* ---------------------------------------------------------------- savings */

export type SavingsPlanRecord = {
  id: string;
  owner: string;
  ownerEmail: string;
  template: string;
  currency: Currency;
  saved: string;
  target: string;
  progress: number;
  status: "active" | "matured" | "broken";
  maturity: string;
};

const TEMPLATES = [
  "Rent Payment",
  "Japa/Study Abroad",
  "Buy a Car",
  "Wedding",
  "School fees",
  "Business Capital",
];

export const SAVINGS_PLANS: SavingsPlanRecord[] = HOLDER_NAMES.map(
  (name, index) => ({
    id: `SAV-44${21 - index}`,
    owner: name,
    ownerEmail: `${name.split(" ")[0].toLowerCase()}@mail.com`,
    template: TEMPLATES[index],
    currency: index % 3 === 0 ? "USD" : "NGN",
    saved: index % 3 === 0 ? "$18,220.00" : "₦8,500,000.00",
    target: index % 3 === 0 ? "$25,000.00" : "₦12,000,000.00",
    progress: [72, 40, 96, 18, 64, 100][index],
    status: (["active", "active", "broken", "active", "matured", "active"] as const)[
      index
    ],
    maturity: ["12 Mar, 2026", "13 Jun, 2026", "14 Sep, 2026"][index % 3],
  }),
);

export const SAVINGS_SUMMARY = {
  totalSaved: "₦318.4M",
  activePlans: "4,812",
  maturedPlans: "1,204",
  brokenPlans: "318",
} as const;

/* -------------------------------------------------------------------- roi */

export type RoiPayout = {
  id: string;
  owner: string;
  ownerEmail: string;
  product: string;
  currency: Currency;
  principal: string;
  rate: string;
  accrued: string;
  status: "accrued" | "paid" | "clawed back";
  payoutDate: string;
};

export const ROI_PAYOUTS: RoiPayout[] = HOLDER_NAMES.map((name, index) => ({
  id: `ROI-77${10 + index}`,
  owner: name,
  ownerEmail: `${name.split(" ")[0].toLowerCase()}@mail.com`,
  product: ["Fixed Deposit", "Target Savings", "Flexi Wallet"][index % 3],
  currency: index % 3 === 0 ? "USD" : "NGN",
  principal: index % 3 === 0 ? "$120,400.00" : "₦85,000,000.00",
  rate: ["14%", "10%", "12%"][index % 3],
  accrued: index % 3 === 0 ? "$1,404.00" : "₦890,000.00",
  status: (["accrued", "paid", "paid", "clawed back", "accrued", "paid"] as const)[
    index
  ],
  payoutDate: ["12 Mar, 2024. 7:00PM", "13 Mar, 2024. 8:00PM", "14 Mar, 2024. 9:00PM"][
    index % 3
  ],
}));

export const ROI_SUMMARY = {
  totalLiability: "₦313.0M",
  paidThisMonth: "₦48.2M",
  accruedToday: "+₦890K",
  averageRate: "12.4%",
} as const;

/* ------------------------------------------------------------------ vault */

export type VaultPosition = {
  id: string;
  owner: string;
  ownerEmail: string;
  tenure: string;
  currency: Currency;
  principal: string;
  rate: string;
  status: "locked" | "matured" | "broken";
  started: string;
  maturity: string;
};

export const VAULT_POSITIONS: VaultPosition[] = HOLDER_NAMES.map(
  (name, index) => ({
    id: `VLT-32${10 + index}`,
    owner: name,
    ownerEmail: `${name.split(" ")[0].toLowerCase()}@mail.com`,
    tenure: ["30 days", "60 days", "90 days"][index % 3],
    currency: index % 3 === 0 ? "USD" : "NGN",
    principal: index % 3 === 0 ? "$50,000.00" : "₦35,000,000.00",
    rate: "14%",
    status: (["locked", "locked", "matured", "locked", "broken", "locked"] as const)[
      index
    ],
    started: ["12 Feb, 2024", "13 Feb, 2024", "14 Feb, 2024"][index % 3],
    maturity: ["12 Mar, 2024", "13 Apr, 2024", "14 May, 2024"][index % 3],
  }),
);

export const VAULT_SUMMARY = {
  lockedFunds: "₦842.6M",
  activeVaults: "2,140",
  maturingThisWeek: "184",
  brokenThisMonth: "42",
} as const;

/* --------------------------------------------------------------- treasury */

/**
 * Safe Deployable Capital, as the platform brief defines it:
 *
 *   customer funds − ROI liability − operating buffer = safe deployable
 *
 * Each line is rendered in order so the arithmetic stays legible on screen.
 */
export type CapitalLine = {
  id: string;
  label: string;
  value: string;
  /** How the line affects the running total. */
  effect: "base" | "subtract" | "total";
  note: string;
};

export const CAPITAL_BREAKDOWN: CapitalLine[] = [
  {
    id: "customer-funds",
    label: "Total customer funds",
    value: "₦2.66B",
    effect: "base",
    note: "Flexi Wallet, Target Savings and Fixed Deposit balances combined",
  },
  {
    id: "roi-liability",
    label: "ROI liability",
    value: "₦313.0M",
    effect: "subtract",
    note: "Interest already accrued and owed to customers",
  },
  {
    id: "operating-buffer",
    label: "Operating buffer (2.5%)",
    value: "₦66.5M",
    effect: "subtract",
    note: "Policy-set safety margin from Platform Configuration",
  },
  {
    id: "safe-deployable",
    label: "Safe deployable capital",
    value: "₦2.28B",
    effect: "total",
    note: "What treasury may deploy without touching customer obligations",
  },
];

export type PendingWithdrawalRecord = {
  id: string;
  reference: string;
  owner: string;
  ownerEmail: string;
  currency: Currency;
  amount: string;
  source: string;
  requested: string;
  /** Why it landed in the queue rather than auto-approving. */
  reason: string;
};

export const PENDING_WITHDRAWAL_QUEUE: PendingWithdrawalRecord[] =
  HOLDER_NAMES.slice(0, 4).map((name, index) => ({
    id: `PW-99${10 + index}`,
    reference: `TXN-88${42 + index}`,
    owner: name,
    ownerEmail: `${name.split(" ")[0].toLowerCase()}@mail.com`,
    currency: index % 3 === 0 ? "USD" : "NGN",
    amount: index % 3 === 0 ? "$62,000.00" : "₦50,000,000.00",
    source: ["Flexi Wallet", "Fixed Deposit", "Target Savings"][index % 3],
    requested: ["12 Mar, 2024. 7:00PM", "13 Mar, 2024. 8:00PM"][index % 2],
    reason: "Above large-transaction threshold",
  }));

export const TREASURY_SUMMARY = {
  safeDeployable: "₦2.28B",
  deployed: "₦1.64B",
  liquidityRatio: "2.84×",
  pendingApprovals: String(PENDING_WITHDRAWAL_QUEUE.length),
} as const;

/* ----------------------------------------------------- transaction history */

export type LedgerEntry = {
  id: string;
  reference: string;
  owner: string;
  ownerEmail: string;
  type: string;
  flow: MoneyFlow;
  currency: Currency;
  amount: string;
  status: "processing" | "completed" | "failed";
  source: string;
  destination: string;
  timestamp: string;
};

export const TRANSACTION_TYPES = [
  "Deposit",
  "Withdrawal",
  "ROI Payout",
  "Savings",
  "Transfer",
] as const;

const LEDGER_SEED: Array<{
  type: (typeof TRANSACTION_TYPES)[number];
  flow: MoneyFlow;
  status: LedgerEntry["status"];
  source: string;
  destination: string;
}> = [
  {
    type: "Deposit",
    flow: "credit",
    status: "processing",
    source: "Card Payment",
    destination: "Flexi Wallet",
  },
  {
    type: "ROI Payout",
    flow: "credit",
    status: "completed",
    source: "Treasury",
    destination: "Flexi Wallet",
  },
  {
    type: "Savings",
    flow: "debit",
    status: "completed",
    source: "Flexi Wallet",
    destination: "Target Savings",
  },
  {
    type: "Withdrawal",
    flow: "debit",
    status: "completed",
    source: "Flexi Wallet",
    destination: "Bank Transfer",
  },
  {
    type: "Deposit",
    flow: "credit",
    status: "failed",
    source: "Bank Transfer",
    destination: "Fixed Deposit",
  },
  {
    type: "Transfer",
    flow: "debit",
    status: "completed",
    source: "Fixed Deposit",
    destination: "Flexi Wallet",
  },
];

export const LEDGER_ENTRIES: LedgerEntry[] = LEDGER_SEED.flatMap(
  (seed, seedIndex) =>
    HOLDER_NAMES.map((name, nameIndex) => {
      const index = seedIndex * HOLDER_NAMES.length + nameIndex;
      const currency: Currency = index % 4 === 0 ? "USD" : "NGN";

      return {
        id: `ledger-${index}`,
        reference: `TXN-8${800 + index}`,
        owner: name,
        ownerEmail: `${name.split(" ")[0].toLowerCase()}@mail.com`,
        currency,
        amount:
          currency === "USD"
            ? `$${(4_200 + index * 310).toLocaleString()}.00`
            : `₦${(1_500_000 + index * 240_000).toLocaleString()}.00`,
        timestamp: [
          "12 Mar, 2024. 7:00PM",
          "13 Mar, 2024. 8:00PM",
          "14 Mar, 2024. 9:00PM",
          "15 Mar, 2024. 10:00PM",
        ][index % 4],
        ...seed,
      };
    }),
);

export const LEDGER_SUMMARY = {
  volumeToday: "₦3.28B",
  deposits: "₦1.82B",
  withdrawals: "₦1.46B",
  failed: "12",
} as const;
