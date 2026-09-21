import type {
  Currency,
  SavingStatus,
  SavingsFrequency,
  SavingsTemplate,
} from "@/types/enum";
import type { Product } from "@/types/product";
import type { User } from "@/types/user";

export interface Saving {
  id: string;
  user_id: string;
  product_id: string;
  template: SavingsTemplate | string;
  label: string | null;
  image: string | null;
  interest_rate: number;
  savings_amount: number;
  target_amount: number | null;
  frequency: SavingsFrequency | string | null;
  withdrawal_mode: string | null;
  source_of_funds: string | null;
  auto_save: boolean;
  auto_save_frequency: SavingsFrequency | string | null;
  next_auto_save_at: string | null;
  auto_renew: boolean;
  duration: number;
  status: SavingStatus;

  /** Gross ever deposited — never decreases. Not what "Amount Saved" means. */
  amount_saved: number;
  amount_withdrawn: number;

  /**
   * `amount_saved - amount_withdrawn`: the live principal, and what the
   * "Amount Saved" column must render. Using `amount_saved` makes a
   * partially-withdrawn plan overstate its holding and stops the column
   * reconciling against the Total Savings Balance card.
   */
  balance: number;
  interest: number;
  interest_accrued: number;
  interest_forfeited: number;
  penalty_count: number;
  currency: Currency;
  account_number: string | null;

  settlement_policy_version: string | null;
  policy_snapshot: string | null;

  cycle_reference: string | null;
  is_renewal: boolean;
  renewed_from_savings_id: string | null;
  renewal_root_savings_id: string | null;
  renewal_sequence: number | null;

  upfront_interest_gross: number | null;
  upfront_interest_tax: number | null;
  upfront_interest_net: number | null;
  upfront_interest_paid_at: string | null;

  break_requested_at: string | null;
  break_settlement_at: string | null;
  matured_at: string | null;
  settled_at: string | null;
  started_at: string | null;
  ending_at: string | null;
  last_withdrawal_at: string | null;
  last_penalty_at: string | null;
  interested_computed_till: string | null;

  product?: Product | null;

  /**
   * FIXME(api): declared `User!` but resolved lazily, so a deleted customer
   * nulls the **entire row** rather than just this field. Until the schema
   * drops the `!`, tables that select it show gaps.
   */
  user?: Pick<User, "id" | "firstname" | "lastname" | "email" | "avatar"> | null;
  created_at: string;
  updated_at: string;
}

export interface SavingFilterInput {
  savings_id?: string;
  id?: string;
  user_id?: string;
  product_id?: string;
  template?: SavingsTemplate | string;
  templates?: (SavingsTemplate | string)[];
  status?: SavingStatus;
  statuses?: SavingStatus[];
  currency?: Currency;

  /** Matches the plan label. */
  search?: string;

  /** The maturity window the Upcoming Maturities drill-down uses. */
  ending_after?: string;
  ending_before?: string;
  page?: number;
  limit?: number;
  paginate?: boolean;
}
