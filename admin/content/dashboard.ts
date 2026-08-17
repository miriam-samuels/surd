import type { BreakdownSlice, FundsPoint } from "@/components/dashboard/charts";

/**
 * Sample dashboard data.
 *
 * Everything here is stand-in content shaped like the real API response, so
 * swapping in a fetch means changing the source of these constants and nothing
 * in the components.
 */

export const FUNDS_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

/** Readings per month. The design plots a daily-ish line, not a monthly one. */
export const FUNDS_READINGS_PER_MONTH = 12;

/**
 * Deterministic jitter in ±1 — a random walk would change on every render, and
 * a smooth curve would not read as sampled data.
 */
function wobble(index: number) {
  const noise = Math.sin(index * 12.9898) * 43758.5453;
  return (noise - Math.floor(noise)) * 2 - 1;
}

export const SYSTEM_FUNDS: FundsPoint[] = Array.from(
  { length: FUNDS_MONTHS.length * FUNDS_READINGS_PER_MONTH },
  (_, index) => {
    /* Position along the whole series, in months. */
    const t = index / FUNDS_READINGS_PER_MONTH;

    return {
      month: FUNDS_MONTHS[Math.floor(t)],
      flexi: round(62 - t * 4 + Math.sin(t * 1.4) * 6 + wobble(index) * 2.5),
      savings: round(22 + t * 5 + Math.cos(t * 1.1) * 4 + wobble(index + 97) * 2),
      roi: round(66 + Math.sin(t) * 5 + wobble(index + 313) * 1.5),
    };
  },
);

function round(value: number) {
  return Math.round(value * 10) / 10;
}

export const FUNDS_BREAKDOWN: BreakdownSlice[] = [
  { name: "Flexi Wallet", value: 10082080.09, color: "#0066ff" },
  { name: "Fixed Deposit", value: 1082080.09, color: "#e58600" },
  { name: "Target Savings", value: 2082080.09, color: "#00ac36" },
];

export type PendingWithdrawal = {
  id: string;
  amount: string;
  user: string;
  date: string;
  time: string;
  kind: string;
};

export const PENDING_WITHDRAWALS: PendingWithdrawal[] = [
  {
    id: "w-1",
    amount: "₦50,000,000",
    user: "Benjamin Masebinu",
    date: "12, Mar 2026",
    time: "7:00PM",
    kind: "Withdrawal",
  },
  {
    id: "w-2",
    amount: "₦50,000,000",
    user: "Benjamin Masebinu",
    date: "12, Mar 2026",
    time: "7:00PM",
    kind: "Withdrawal",
  },
  {
    id: "w-3",
    amount: "₦50,000,000",
    user: "Benjamin Masebinu",
    date: "12, Mar 2026",
    time: "7:00PM",
    kind: "Withdrawal",
  },
];

export type TransactionStatus = "pending" | "completed" | "failed";

export type Transaction = {
  id: string;
  reference: string;
  user: string;
  status: TransactionStatus;
  amount: string;
  destination: string;
  timestamp: string;
};

export const RECENT_TRANSACTIONS: Transaction[] = [
  {
    id: "t-1",
    reference: "TXN-8842",
    user: "Benjamin Masebinu",
    status: "pending",
    amount: "₦85,000,000",
    destination: "Flexi Wallet",
    timestamp: "12 Mar, 2024. 7:00PM",
  },
  {
    id: "t-2",
    reference: "TXN-8843",
    user: "Benjamin Masebinu",
    status: "pending",
    amount: "₦75,000,000",
    destination: "Fixed Deposit",
    timestamp: "13 Mar, 2024. 8:00PM",
  },
  {
    id: "t-3",
    reference: "TXN-8844",
    user: "Liam Chen",
    status: "completed",
    amount: "₦100,000,000",
    destination: "Target Savings",
    timestamp: "14 Mar, 2024. 9:00PM",
  },
  {
    id: "t-4",
    reference: "TXN-8845",
    user: "Sophia Martinez",
    status: "completed",
    amount: "₦90,000,000",
    destination: "Flexi Wallet",
    timestamp: "12 Mar, 2024. 7:00PM",
  },
  {
    id: "t-5",
    reference: "TXN-8846",
    user: "Ava Patel",
    status: "completed",
    amount: "₦65,000,000",
    destination: "Flexi Wallet",
    timestamp: "15 Mar, 2024. 10:00PM",
  },
];
