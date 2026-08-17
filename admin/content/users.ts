/**
 * Sample user records, shaped like the API response.
 *
 * Every list on the Users module reads from here, so swapping in a fetch means
 * changing this file and nothing in the components.
 */

export type UserStatus = "active" | "suspended" | "closed" | "pending";
export type PlanStatus = "active" | "matured" | "broken";
export type KycStatus = "verified" | "pending" | "rejected";
export type TransactionStatus = "processing" | "completed" | "failed";

export type UserBalance = {
  label: string;
  currency: "NGN" | "USD";
  amount: string;
};

export type UserTransaction = {
  id: string;
  reference: string;
  status: TransactionStatus;
  type: string;
  currency: "NGN" | "USD";
  amount: string;
  narration: string;
  from: string;
  to: string;
  timestamp: string;
};

export type TargetPlan = {
  id: string;
  status: PlanStatus;
  currency: "NGN" | "USD";
  amountSaved: string;
  targetAmount: string;
  roiEarned: string;
  withdrawal: string;
  started: string;
  maturity: string;
};

export type FixedDepositPlan = TargetPlan & {
  planName: string;
  period: string;
  breakFee: string;
};

export type KycDocument = {
  id: string;
  document: string;
  status: KycStatus;
  uploaded: string;
  reviewed: string;
  viewable: boolean;
};

export type LoginRecord = {
  id: string;
  date: string;
  time: string;
  ipAddress: string;
  device: string;
  location: string;
};

export type UserRecord = {
  id: string;
  reference: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  phone: string;
  address: string;
  gender: string;
  dateOfBirth: string;
  status: UserStatus;
  /** High-net-worth flag, driven by the platform HNI threshold. */
  isHni: boolean;
  bank: string;
  virtualAccountNumber: string;
  joined: string;
  lastLogin: string;
  kycDocuments: KycDocument[];
  stats: {
    activePlans: number;
    completedPlans: number;
    totalWithdrawals: string;
    totalRoiLiability: string;
  };
  balances: UserBalance[];
  transactions: UserTransaction[];
  targetPlans: TargetPlan[];
  fixedDeposits: FixedDepositPlan[];
  loginHistory: LoginRecord[];
};

const TRANSACTIONS: UserTransaction[] = [
  {
    id: "t-1",
    reference: "TXN-8842",
    status: "processing",
    type: "Deposit",
    currency: "NGN",
    amount: "₦85,000,000",
    narration: "Bank transfer deposit",
    from: "Card Payment",
    to: "Flexi Wallet",
    timestamp: "12 Mar, 2024. 7:00PM",
  },
  {
    id: "t-2",
    reference: "TXN-8843",
    status: "completed",
    type: "ROI Payout",
    currency: "USD",
    amount: "₦75,000,000",
    narration: "Monthly ROI - Diamond Vault",
    from: "Flexi Wallet",
    to: "Fixed Deposit",
    timestamp: "13 Mar, 2024. 8:00PM",
  },
  {
    id: "t-3",
    reference: "TXN-8844",
    status: "completed",
    type: "Savings",
    currency: "USD",
    amount: "₦100,000,000",
    narration: "Auto-save to Target Plan",
    from: "Fixed Deposit",
    to: "Linked Account",
    timestamp: "14 Mar, 2024. 9:00PM",
  },
  {
    id: "t-4",
    reference: "TXN-8845",
    status: "completed",
    type: "Withdrawal",
    currency: "NGN",
    amount: "₦90,000,000",
    narration: "Withdrawal to GTBank",
    from: "Bank Transfer",
    to: "Flexi Wallet",
    timestamp: "12 Mar, 2024. 7:00PM",
  },
  {
    id: "t-5",
    reference: "TXN-8846",
    status: "completed",
    type: "Deposit",
    currency: "NGN",
    amount: "₦65,000,000",
    narration: "Bank transfer deposit",
    from: "Flexi Wallet",
    to: "Fixed Deposit",
    timestamp: "15 Mar, 2024. 10:00PM",
  },
];

const TARGET_PLANS: TargetPlan[] = [
  {
    id: "SAV-4421",
    status: "active",
    currency: "NGN",
    amountSaved: "₦85,000,000",
    targetAmount: "₦85,000,000",
    roiEarned: "₦8,000",
    withdrawal: "Anytime",
    started: "12 Mar, 2024. 7:00PM",
    maturity: "12 Mar, 2024. 7:00PM",
  },
  {
    id: "SAV-4420",
    status: "active",
    currency: "USD",
    amountSaved: "₦75,000,000",
    targetAmount: "₦75,000,000",
    roiEarned: "₦8,000",
    withdrawal: "Until Maturity",
    started: "13 Mar, 2024. 8:00PM",
    maturity: "13 Mar, 2024. 8:00PM",
  },
  {
    id: "SAV-4419",
    status: "broken",
    currency: "USD",
    amountSaved: "₦100,000,000",
    targetAmount: "₦100,000,000",
    roiEarned: "₦8,000",
    withdrawal: "Until Maturity",
    started: "14 Mar, 2024. 9:00PM",
    maturity: "14 Mar, 2024. 9:00PM",
  },
  {
    id: "SAV-4418",
    status: "matured",
    currency: "NGN",
    amountSaved: "₦90,000,000",
    targetAmount: "₦90,000,000",
    roiEarned: "₦8,000",
    withdrawal: "Anytime",
    started: "12 Mar, 2024. 7:00PM",
    maturity: "12 Mar, 2024. 7:00PM",
  },
  {
    id: "SAV-4417",
    status: "active",
    currency: "NGN",
    amountSaved: "₦65,000,000",
    targetAmount: "₦65,000,000",
    roiEarned: "₦8,000",
    withdrawal: "Anytime",
    started: "15 Mar, 2024. 10:00PM",
    maturity: "15 Mar, 2024. 10:00PM",
  },
];

const PERIODS = ["30 days", "60 days", "30 days", "90 days", "30 days"];

const FIXED_DEPOSITS: FixedDepositPlan[] = TARGET_PLANS.map((plan, index) => ({
  ...plan,
  planName: "Birthday savings plan",
  period: PERIODS[index],
  breakFee: plan.status === "broken" ? "₦8,000" : "—",
}));

const KYC_DOCUMENTS: KycDocument[] = [
  {
    id: "kd-1",
    document: "BVN Verification",
    status: "verified",
    uploaded: "12 Mar, 2024. 7:00PM",
    reviewed: "12 Mar, 2024. 7:00PM",
    viewable: false,
  },
  {
    id: "kd-2",
    document: "NIN Verification",
    status: "verified",
    uploaded: "13 Mar, 2024. 8:00PM",
    reviewed: "13 Mar, 2024. 8:00PM",
    viewable: true,
  },
  {
    id: "kd-3",
    document: "Utility Bill",
    status: "verified",
    uploaded: "14 Mar, 2024. 9:00PM",
    reviewed: "14 Mar, 2024. 9:00PM",
    viewable: true,
  },
  {
    id: "kd-4",
    document: "Passport Photo",
    status: "verified",
    uploaded: "12 Mar, 2024. 7:00PM",
    reviewed: "12 Mar, 2024. 7:00PM",
    viewable: true,
  },
];

const LOGIN_HISTORY: LoginRecord[] = [
  {
    id: "l-1",
    date: "12 Mar, 2024.",
    time: "7:00PM",
    ipAddress: "102.89.xx.xx",
    device: "Iphone 15 Pro Max",
    location: "Lagos, Nigeria",
  },
  {
    id: "l-2",
    date: "13 Mar, 2024.",
    time: "8:00PM",
    ipAddress: "102.89.xx.xx",
    device: "MacBook M3 Air",
    location: "Nairobi, Kenya",
  },
  {
    id: "l-3",
    date: "12 Mar, 2024.",
    time: "7:00PM",
    ipAddress: "102.89.xx.xx",
    device: "Iphone 15 Pro Max",
    location: "Lagos, Nigeria",
  },
  {
    id: "l-4",
    date: "14 Mar, 2024.",
    time: "9:00PM",
    ipAddress: "102.89.xx.xx",
    device: "HP Envy 15",
    location: "Lagos, Nigeria",
  },
];

const BALANCES: UserBalance[] = [
  { label: "Flexi Wallet", currency: "NGN", amount: "₦12,480,000.00" },
  { label: "Flexi Wallet", currency: "USD", amount: "$18,220.00" },
  { label: "Target Savings", currency: "NGN", amount: "₦85,000,000.00" },
  { label: "Fixed Deposit", currency: "USD", amount: "$120,400.00" },
];

function buildUser(
  index: number,
  overrides: Partial<UserRecord> = {},
): UserRecord {
  const names = [
    ["Aisha", "Bello"],
    ["Patrick", "Adanini"],
    ["Liam", "Chen"],
    ["Sophia", "Martinez"],
    ["Ava", "Patel"],
    ["Benjamin", "Masebinu"],
  ];
  const [firstName, lastName] = names[index % names.length];

  return {
    id: `USR-88${40 + index}`,
    reference: "TXN-8842",
    firstName,
    lastName,
    displayName: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}@mail.com`,
    phone: "555-1234",
    address: "123 Elm St, Springfield",
    gender: index % 2 === 0 ? "Female" : "Male",
    dateOfBirth: "04 - 08 - 1990",
    status: "active",
    isHni: index % 3 === 0,
    bank: "Sterling Bank",
    virtualAccountNumber: "9032761840",
    joined: "12-02-2021",
    lastLogin: "12-02-2021, 23:09",
    kycDocuments: KYC_DOCUMENTS,
    stats: {
      activePlans: 2,
      completedPlans: 4,
      totalWithdrawals: "₦14k",
      totalRoiLiability: "₦270",
    },
    balances: BALANCES,
    transactions: TRANSACTIONS,
    targetPlans: TARGET_PLANS,
    fixedDeposits: FIXED_DEPOSITS,
    loginHistory: LOGIN_HISTORY,
    ...overrides,
  };
}

export const USERS: UserRecord[] = [
  buildUser(0),
  buildUser(1, { status: "suspended", isHni: false }),
  buildUser(2),
  buildUser(3, { status: "pending" }),
  buildUser(4),
  buildUser(5, { status: "closed" }),
];

export function findUser(id: string) {
  return USERS.find((user) => user.id === id);
}

/** Pending KYC reviews across all users — the `/kyc` queue. */
export type KycReview = {
  id: string;
  userId: string;
  name: string;
  email: string;
  document: string;
  submitted: string;
  status: KycStatus;
};

export const KYC_REVIEWS: KycReview[] = [
  {
    id: "kr-1",
    userId: "USR-8842",
    name: "Benjamin Masebinu",
    email: "ben@gmail.com",
    document: "NIN",
    submitted: "12 Mar, 2024. 7:00PM",
    status: "pending",
  },
  {
    id: "kr-2",
    userId: "USR-8842",
    name: "Benjamin Masebinu",
    email: "ben@gmail.com",
    document: "Passport",
    submitted: "13 Mar, 2024. 8:00PM",
    status: "pending",
  },
  {
    id: "kr-3",
    userId: "USR-8842",
    name: "Benjamin Masebinu",
    email: "ben@gmail.com",
    document: "Driver's License",
    submitted: "14 Mar, 2024. 9:00PM",
    status: "pending",
  },
  {
    id: "kr-4",
    userId: "USR-8842",
    name: "Benjamin Masebinu",
    email: "ben@gmail.com",
    document: "NIN",
    submitted: "12 Mar, 2024. 7:00PM",
    status: "pending",
  },
  {
    id: "kr-5",
    userId: "USR-8842",
    name: "Benjamin Masebinu",
    email: "ben@gmail.com",
    document: "NIN",
    submitted: "15 Mar, 2024. 10:00PM",
    status: "pending",
  },
];

export const KYC_SUMMARY = {
  pendingReviews: 3,
  closedAccounts: 12,
  stuckReviews: 2,
} as const;
