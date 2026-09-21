export type Currency = "NGN" | "USD";

export const CURRENCY_COUNTRY: Record<Currency, string> = {
  NGN: "NG",
  USD: "US",
};

export type Editor = {
  name: string;
  email: string;
};

const EDITOR: Editor = { name: "Benjamin Masebinu", email: "ben@gmail.com" };

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
