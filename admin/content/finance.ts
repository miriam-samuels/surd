import type { Currency } from "@/content/configuration";

export type MoneyFlow = "credit" | "debit";

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
