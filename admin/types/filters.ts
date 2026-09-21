import type {
  BreakdownMode,
  Currency,
  Granularity,
  KycStatus,
  SortDirection,
  UserStatus,
} from "@/types/enum";

/**
 * `start_date` is inclusive, `end_date` exclusive — for a single day send the
 * day's midnight and the next day's.
 */
export interface DateRange {
  start_date?: string;
  end_date?: string;
}

export interface PageRequest {
  page?: number;
  limit?: number;
  sort?: SortDirection;
}

export interface AdminCurrencyInput {
  currency?: Currency;
}

export interface AdminDateRangeInput extends DateRange {
  currency?: Currency;
}

export interface AdminSeriesInput extends DateRange {
  currency?: Currency;

  /** Defaults to `DAY` server-side. Buckets never run past the current one. */
  granularity?: Granularity;
}

export interface AdminBreakdownInput extends DateRange {
  /** Omit to get all three groups back in one call. */
  mode?: BreakdownMode;

  /**
   * On `CURRENCY` this is the unit to compare in, not a filter — every
   * currency comes back regardless. Defaults to NGN.
   */
  currency?: Currency;
}

export interface AdminUsersFilterInput extends PageRequest {
  /**
   * Name and email are fuzzy; **id is matched exactly**. Ids are UUIDs and hex
   * includes `a`–`f`, so a substring match on one letter returned 40 of 48
   * accounts and read as broken.
   */
  search?: string;
  status?: UserStatus;

  /** The KYC Level menu. */
  tier?: string;

  /** The unit the balance bounds are compared in. Defaults to NGN. */
  balance_currency?: Currency;

  /**
   * Half-open (`>= min`, `< max`), so adjacent buckets never double-count.
   * Everything the account holds is converted into `balance_currency` first.
   */
  min_balance?: number;
  max_balance?: number;

  joined_after?: string;

  /** Exclusive. */
  joined_before?: string;
  include_internal?: boolean;
  paginate?: boolean;
}

export type AdminUsersOverviewInput = DateRange;

export interface AdminKycFilterInput extends PageRequest {
  search?: string;
  status?: KycStatus;
  user_id?: string;
  email?: string;

  /** What the "All Pending KYC Reviews" table wants. */
  pending_review_only?: boolean;

  /** Pending **and** older than `sla_hours`. Implies `pending_review_only`. */
  stuck_only?: boolean;

  /**
   * Age threshold for "stuck", in hours. Defaults to 48. Send the same value
   * here and on the overview or the card will not match the rows.
   */
  sla_hours?: number;
  include_internal?: boolean;
  paginate?: boolean;
}

export interface AdminKycOverviewInput {
  sla_hours?: number;
  include_internal?: boolean;
}

export interface AdminKycUserInput {
  user_id?: string;
  kyc_id?: string;
}

export interface AdminUserSessionsInput extends PageRequest {
  user_id: string;
  active_only?: boolean;
}

export interface AdminUserInput {
  user_id?: string;
  id?: string;
  email?: string;
}

export interface FaqFilterInput extends PageRequest {
  search?: string;
  category?: string;
  status?: string;
}

export interface TargetPlanTemplateFilterInput extends PageRequest {
  search?: string;
  status?: string;
  currency?: Currency;
}
