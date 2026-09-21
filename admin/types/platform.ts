import type { ConfigUnit, Currency } from "@/types/enum";

export interface PlatformConfig {
  tiers: string | null;
  free_transfer: number;
  free_transfer_cycle: string | null;
  minimum_account_balance: number;
  maximum_account_balance: number;
  maximum_total_withdrawals_per_day: number;
  maximum_amount_per_withdrawal: number;

  maximum_net_capital_outflow: number;
  created_at: string;
  updated_at: string;
}

/**
 * Every field is optional and omitted ones are left untouched, so the Edit
 * modal sends only the key it opened — sending the whole object back would
 * overwrite rows the admin never looked at.
 */
export type PlatformConfigInput = Partial<
  Omit<PlatformConfig, "created_at" | "updated_at">
> & {
  operating_buffer_pct?: number;
  large_transaction_threshold?: number;
  hni_threshold?: number;
  withdrawal_processing_hours?: number;
  bank_account_verification_days?: number;
  maximum_net_capital_outflow_usd?: number;
};

/**
 * One row of the Platform Configuration table. Returned in full every time —
 * no arguments, no pagination.
 */
export interface AdminPlatformConfigKey {
  key: PlatformConfigKey;

  /** Already the display string ("Operating Buffer"). */
  label: string;

  /** A plain number; format it with `unit`. The API rejects strings. */
  value: number;

  /** Intrinsic to the key, so it renders as a fixed suffix, never a picker. */
  unit: ConfigUnit;

  /** Backend copy explaining the key. Not editable — there is no field for it. */
  description: string;

  /** All empty until the key has first been edited. */
  updated_by_id: string;
  updated_by_firstname: string;
  updated_by_lastname: string;
  updated_by_email: string;
  updated_by_avatar: string;

  /** `null` when never edited. Derived from the audit trail by the save. */
  updated_at: string | null;
}

/**
 * Which field on `PlatformConfigInput` a row saves through.
 *
 * Two of these are `Int`, not `Float` — sending `24.0` for
 * `withdrawal_processing_hours` is a type error, so the modal rounds first.
 */
export const CONFIG_KEY_FIELDS = {
  OPERATING_BUFFER: { field: "operating_buffer_pct", integer: false },
  LARGE_TRANSACTION_THRESHOLD: { field: "large_transaction_threshold", integer: false },
  HNI_THRESHOLD: { field: "hni_threshold", integer: false },
  WITHDRAWAL_PROCESSING_TIME: { field: "withdrawal_processing_hours", integer: true },
  BANK_ACCOUNT_VERIFICATION_PERIOD: { field: "bank_account_verification_days", integer: true },
  MAXIMUM_NET_CAPITAL_OUTFLOW: { field: "maximum_net_capital_outflow", integer: false },
  MAXIMUM_NET_CAPITAL_OUTFLOW_USD: { field: "maximum_net_capital_outflow_usd", integer: false },
} as const;

export type PlatformConfigKey = keyof typeof CONFIG_KEY_FIELDS;

export interface AccountLimits {
  minimum_account_balance: number;
  maximum_account_balance: number;
  current_portfolio_balance: number;
  maximum_total_withdrawals_per_day: number;
  current_total_withdrawals_today: number;
  remaining_daily_withdrawal_limit: number;
  maximum_amount_per_withdrawal: number;
}

export type { Currency };
