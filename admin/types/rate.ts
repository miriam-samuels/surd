import type { Currency } from "@/types/enum";
import type { User } from "@/types/user";

export interface Rate {
  id: string;

  base: Currency | string;

  exchange: Currency | string;
  symbol: string | null;

  val: number;
  markup: number;

  quote: number;
  fee: number;
  fee_type: string | null;
  updated_by: string | null;

  /**
   * Fetched only when selected — nothing about the admin is stored on the rate
   * row, so a rename or new avatar shows on historical rows automatically.
   * Null when never edited or the admin was removed.
   */
  user?: Pick<User, "id" | "firstname" | "lastname" | "email" | "avatar"> | null;
  created_at: string;

  /** There is no `effective_date`; this **is** the effective date. */
  updated_at: string;
}

export interface RateFilter {
  base?: string;
  exchange?: string;
  symbol?: string;
}

/**
 * An **upsert**, not an update — there is no `rate_id`; the mutation keys on
 * `(base, exchange)`. So the pair must come from the row being edited, never a
 * picker the admin can change: altering From/To creates or overwrites a
 * *different* pair and silently leaves the original alone.
 *
 * Omitted optional fields are written as `null`, so send `markup` back to
 * preserve it. `updated_by` is stamped server-side and cannot be set here.
 */
export interface RateInput {
  base: string;
  exchange: string;

  /** Note: `value` on input, `val` on output. */
  value: number;
  markup?: number;
  symbol?: string;
  quote?: number;
  fee?: number;
  fee_type?: string;
}
