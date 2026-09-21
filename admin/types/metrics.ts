import type { BreakdownMode, Currency } from "@/types/enum";

/**
 * Every figure here is calculated once and referenced by Treasury and ROI, so
 * the modules can never disagree. Do not recompute any of it client-side.
 *
 * Each `_change_pct_*` is `null` until a comparable snapshot exists — that
 * means "no baseline", not zero, so it renders as a dash. The two
 * `_change_today` fields are absolute amounts and are always present.
 */
export interface AdminOverviewMetrics {
  currency: Currency;
  total_funds: number;
  total_funds_change_pct_vs_last_month: number | null;
  total_flexi_balance: number;
  total_flexi_balance_change_pct_vs_yesterday: number | null;
  total_savings_balance: number;
  total_savings_balance_change_pct_vs_last_month: number | null;
  total_roi_liability: number;
  total_roi_liability_change_today: number;
  pending_withdrawals: number;
  pending_withdrawals_count: number;
  daily_deposits: number;
  daily_deposits_change_pct_vs_yesterday: number | null;
  daily_withdrawals: number;
  daily_withdrawals_change_pct_vs_yesterday: number | null;
  net_capital_position: number;
  net_capital_position_status: string;

  /**
   * `0` means there is nothing to cover, not that cover is missing — read
   * `liquidity_status` for the verdict, never the bare number.
   */
  liquidity_ratio: number;
  liquidity_status: string;
  safe_deployable_capital: number;

  /** Every fixed deposit *plus* locked-mode target savings, still running. */
  locked_savings_principal: number;
  total_capital_outflow: number;
  capital_outflow_health_balance: number;
}

export interface AdminSystemFundsPoint {
  date: string;
  flexi_balance: number;
  savings_balance: number;
  roi_liability: number;
}

export interface AdminBreakdownItem {
  key: string;
  label: string;

  /** Sizes the slice. On `CURRENCY` this is converted into one base. */
  amount: number;

  /**
   * The real figure in the slice's own currency, for the label. Null on
   * `SAVINGS` and `SYSTEM`, where nothing is converted.
   */
  native_amount: number | null;
}

export interface AdminBreakdownGroup {
  mode: BreakdownMode;
  items: AdminBreakdownItem[];
}

/**
 * The `SYSTEM` slices the design draws, in the order it draws them.
 *
 * Six of the seven keys the group returns. The one left out is
 * `TOTAL_SAVINGS_BALANCE`, because Fixed and Target *are* that number split in
 * two — drawing the total beside its own parts would count the same naira
 * twice and make every percentage wrong. Splitting it, rather than dropping
 * Fixed and Target, is what the design asks for and the two are equivalent:
 * Fixed + Target = Savings exactly.
 *
 * The last two are a different kind of number and the donut cannot say so on
 * its own — `PENDING_WITHDRAWALS` is a claim against money already counted
 * inside Flexi and Savings, and `TOTAL_CAPITAL_OUTFLOW` is a cumulative total
 * of movements rather than a balance held anywhere. They are here because the
 * design shows them; the panel footnotes what they are so the percentages are
 * not read as pure composition.
 */
export const SYSTEM_DONUT_KEYS = [
  "TOTAL_FLEXI_BALANCE",
  "TOTAL_FIXED_BALANCE",
  "TOTAL_TARGET_BALANCE",
  "TOTAL_ROI_LIABILITY",
  "PENDING_WITHDRAWALS",
  "TOTAL_CAPITAL_OUTFLOW",
] as const;

/** Flexi only — system-wide figures live on the Overview dashboard. */
export interface AdminWalletOverview {
  currency: Currency;
  total_flexi_balance: number;
  total_flexi_balance_change_pct_vs_last_month: number | null;
  total_flexi_deposits: number;
  total_flexi_deposits_change_pct_vs_yesterday: number | null;
  total_flexi_withdrawals: number;
  total_flexi_withdrawals_change_pct_vs_yesterday: number | null;

  /** A subset of the ROI module's liability, referenced not recalculated. */
  flexi_roi_liability: number;
  flexi_roi_liability_change_today: number;

  /**
   * The depth of the approval queue, so it is point-in-time — the date range
   * does not move it, unlike every other figure on the page.
   */
  large_transaction_requests: number;
}

/**
 * `AdminWalletBalancePoint` still carries `savings_balance` and
 * `total_wallet_balance` for Overview's benefit; the Flexi module selects
 * `flexi_balance` alone.
 */
export interface AdminWalletBalancePoint {
  date: string;
  flexi_balance: number;
}

/**
 * The cards answer different questions and **are not meant to reconcile**.
 *
 * `total_transaction_volume` counts every posting except `CONVERT` — ROI
 * payouts, tax, internal credits — so it is larger than deposits plus
 * withdrawals. That gap is real; don't build a check expecting it to close.
 * `net_flow` is the deposits-minus-withdrawals figure.
 */
export interface AdminTransactionOverview {
  currency: Currency;
  total_transaction_volume: number;
  total_deposits: number;
  total_deposits_change_pct_vs_previous_period: number | null;
  total_withdrawals: number;
  total_withdrawals_change_pct_vs_previous_period: number | null;

  /** Negative when the platform paid out more than it took in. */
  net_flow: number;
  average_daily_transaction_volume: number;

  /** Always today in Africa/Lagos — the period selector does not move it. */
  today_transaction_volume: number;
}

/**
 * Every balance here is **principal only** (`amount_saved - amount_withdrawn`).
 * Interest is owned by the ROI module as a liability; counting it here too
 * would make one naira appear as savings on this page and as ROI on the next.
 *
 * So Savings and ROI figures are not meant to add up to a user's holdings.
 */
export interface AdminSavingsOverview {
  currency: Currency;
  total_savings_balance: number;
  total_savings_balance_change_pct_vs_yesterday: number | null;
  total_fixed_deposit_balance: number;
  total_fixed_deposit_balance_change_pct_vs_last_month: number | null;
  total_target_savings_balance: number;
  total_target_savings_balance_change_pct_vs_last_month: number | null;

  /** Fixed deposits plus locked-mode target savings. Flexible plans excluded. */
  total_locked_savings: number;
  total_locked_savings_change_pct_vs_last_month: number | null;

  /**
   * `total_savings_balance ÷ active_savings_plans_count`, guarded server-side
   * so it is `0` rather than NaN with no active plans.
   *
   * This **replaced** "Average Daily Savings", which paired a daily flow figure
   * with a month-over-month comparison — two incompatible ideas in one number.
   */
  average_plan_size: number;
  average_plan_size_change_pct_vs_yesterday: number | null;
  active_savings_plans_count: number;
  upcoming_maturities_30d_amount: number;
  upcoming_maturities_30d_count: number;
}

export interface AdminSavingsBalancePoint {
  date: string;
  total_savings_balance: number;
}

export interface AdminMaturityPoint {
  date: string;
  amount: number;
  count: number;
}

export interface AdminRoiOverview {
  currency: Currency;

  /** The canonical number every other module references. */
  total_roi_liability: number;
  total_roi_liability_change_today: number;

  /** Null until a start-of-day snapshot exists — a dash, not zero. */
  roi_generated_today: number | null;
  roi_generated_today_change_pct_vs_yesterday: number | null;
  roi_withdrawn_today: number;
  roi_withdrawn_today_change_pct_vs_yesterday: number | null;

  /**
   * Scoped to the selected period — **not a "today" figure**, and all-time when
   * no range is given. Wiring it to today read `0` on a database holding real
   * clawbacks.
   */
  roi_clawed_back: number;
  roi_clawed_back_change_pct_vs_previous_period: number | null;
}

export interface AdminRoiFlowPoint {
  date: string;
  roi_generated: number;
  roi_withdrawn: number;
}

export interface AdminTreasuryOverview {
  currency: Currency;

  /** Calculated once by the dashboard module and referenced here. */
  safe_deployable_capital: number;

  /** All-time. Not scoped by any date filter. */
  total_capital_outflow: number;
  total_capital_refund: number;

  /** Outflow − refund: what is currently deployed out. */
  net_capital_position: number;

  /** Absolute, from the start-of-day Lagos snapshot. Not a percentage. */
  net_capital_position_change_today: number;

  /** Null when there are no obligations — dividing by zero is not "healthy". */
  liquidity_ratio: number | null;
  liquidity_status: string;

  /** Null when there are no system funds to express the position against. */
  treasury_exposure_pct: number | null;
  treasury_exposure_status: string;

  /** The ratio's inputs, if you want to show them. */
  obligations: number;
  liquid_assets: number;
}

/**
 * Both plotted series are percentages of total system funds, which is what lets
 * them share one 0–100% axis.
 */
export interface AdminTreasuryPoint {
  date: string;
  safe_deployable_capital_pct: number;
  obligations_pct: number;
  liquidity_ratio: number | null;
}
