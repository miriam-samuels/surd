import type {
  Currency,
  ProductStatus,
  SavingsFrequency,
  SavingsTemplate,
} from "@/types/enum";

export interface Product {
  id: string;
  author_id: string;
  name: string;
  template: SavingsTemplate | string;
  description: string | null;
  code: string;
  headline: string | null;
  status: ProductStatus;
  account_creation_type: string | null;
  account_number: string | null;
  currency: Currency;
  product_name: string | null;
  is_configurable: boolean;

  interest_rate: number;
  interest_calculation_method: string | null;
  interest_type: string | null;
  interest_payment_frequency: string | null;
  interest_payment_timing: string | null;
  locked_interest_rate: number | null;
  flexible_interest_rate: number | null;

  tenure_interest_rates: string | null;

  minimum_amount_per_contribution: number | null;
  minimum_initial_deposit: number | null;
  minimum_balance_required: number | null;
  maximum_single_deposit_per_day: number | null;

  enable_withdrawal: boolean;
  enable_break: boolean;
  withdrawal_modes: string | null;
  minimum_withdrawal_limit: number | null;
  monthly_withdrawal_limit: number | null;
  withdrawal_cooldown_hours: number | null;
  withdrawal_fee: number | null;
  minimum_days_before_penalty_free_withdrawal: number | null;
  early_withdrawal_penalty: number | null;
  penalty_model: string | null;
  penalty_free_at_maturity_only: boolean;
  early_exit_interest_policy: string | null;
  break_waiting_period_hours: number | null;
  allow_partial_early_withdrawal: boolean;

  enable_auto_save: boolean;
  auto_save_frequency: SavingsFrequency | string | null;
  auto_renew: boolean;
  minimum_duration_days: number | null;
  maximum_duration_days: number | null;
  maturity_auto_settle_to_flex: boolean;
  lifecycle_policy_enabled: boolean;

  account_opening_fee: number | null;
  tax_rate: number | null;

  created_at: string;
  updated_at: string;
}

export interface TargetPlanTemplate {
  id: string;
  user_id: string | null;
  title: string;
  image: string | null;
  description: string | null;
  target_amount: number;
  duration: number;
  frequency: SavingsFrequency | string;
  currency: Currency;
  auto_save: boolean;
  auto_save_frequency: SavingsFrequency | string | null;
  status: ProductStatus | string;
  created_at: string;
  updated_at: string;
}

export interface ProductFilterInput {
  product_id?: string;
  id?: string;
  code?: string;
  template?: SavingsTemplate | string;
  status?: ProductStatus;
  currency?: Currency;
}

export type ProductInput = Partial<
  Omit<Product, "id" | "author_id" | "created_at" | "updated_at">
> & {
  name: string;
  code: string;
  template: SavingsTemplate | string;
  currency: Currency;
};

export type ProductUpdateInput = Partial<ProductInput> & { id: string };

export type TargetPlanTemplateInput = Partial<
  Omit<TargetPlanTemplate, "id" | "created_at" | "updated_at">
> & {
  title: string;
  target_amount: number;
  duration: number;
  currency: Currency;
};

export type UpdateTargetPlanTemplateInput = Partial<TargetPlanTemplateInput> & {
  id: string;
};
