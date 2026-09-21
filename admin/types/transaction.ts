import type {
  CancellationReason,
  Currency,
  RoiActivityType,
  SavingsTemplate,
  SortDirection,
  TransactionCategory,
  TransactionDirection,
  TransactionStatus,
  TransactionType,
} from "@/types/enum";
import type { Rate } from "@/types/rate";
import type { User } from "@/types/user";

export interface TransactionHistoryEntry {
  act: string;
  by: string;
  at: string;
}

export interface TransactionInvoice {
  key: string | null;
  name: string | null;
  number: string | null;
  amount: number | null;
  fees: number | null;
  bank: string | null;
  metadata: string | null;
}

/** Derived server-side so every screen renders the same labels. */
export interface TransactionFlow {
  source: string;
  destination: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  savings_id: string | null;
  wallet_id: string | null;

  /** Storage enum — do not render it. Tables show `category`. */
  type: TransactionType | string;

  /** The six-bucket display taxonomy. This is what tables show. */
  category: TransactionCategory;
  reference: string;
  currency: Currency;
  source_currency: Currency | null;
  gateway: string | null;
  method: string | null;
  status: TransactionStatus;
  completed_at: string | null;
  failed_at: string | null;
  cancelled_at: string | null;

  checksum: string | null;
  payment_link: string | null;
  initial_config: string | null;
  final_config: string | null;
  metadata: string | null;
  savings_amount: number | null;
  source_amount: number | null;
  /** Excludes fees by definition. */
  amount: number;
  fees: number;

  /** `amount + fees` — what the customer was actually charged. */
  total: number;

  /**
   * How much interest a break recovered. `0` on almost every row, and it is
   * what tells you a `WITHDRAWAL` row matched the `ROI_CLAWBACK` filter.
   */
  roi_clawback_amount: number;

  /** The plan's product type. Null on wallet-only rows. */
  savings_template: SavingsTemplate | null;

  /** `CREDITED` / `WITHDRAWN` / `CLAWED_BACK`. Null outside ROI activity. */
  roi_activity_type: RoiActivityType | null;
  pre_balance: number | null;
  post_balance: number | null;
  remark: string | null;
  direction: TransactionDirection | null;
  settlement_reason: string | null;
  settlement_due_at: string | null;
  settlement_policy_version: string | null;
  parent_transaction_id: string | null;
  cycle_reference: string | null;

  flow?: TransactionFlow | null;
  history?: TransactionHistoryEntry[] | null;
  invoice?: TransactionInvoice | null;
  rate?: Rate | null;
  user?: Pick<
    User,
    "id" | "firstname" | "lastname" | "email" | "avatar" | "status"
  > | null;
  created_at: string;
  updated_at: string;
}

export interface TransactionFilterInput {
  transaction_id?: string;
  reference?: string;
  user_id?: string;
  savings_id?: string;
  wallet_id?: string;
  status?: TransactionStatus;

  /**
   * Mutually exclusive with `type` / `types` — sending both is a 400, not a
   * silent merge.
   */
  category?: TransactionCategory;
  type?: TransactionType | string;
  types?: (TransactionType | string)[];
  statuses?: TransactionStatus[];
  direction?: TransactionDirection;
  currency?: Currency;

  /** Reference, currency, type, remark and customer name/email are fuzzy;
   *  `id` is matched exactly, for the same UUID/hex reason as the user list. */
  search?: string;
  min_amount?: number;
  max_amount?: number;
  method?: string;

  /** Shortcuts the ROI and Treasury modules scope their tables with. These
   *  must stay set alongside any other filter, or the query widens to the
   *  whole ledger. */
  roi_activity?: boolean;
  roi_withdrawal?: boolean;
  capital_transaction?: boolean;
  sort?: SortDirection;
  sort_by?: string;

  /**
   * The withdrawal approval queue: requests at or above the large-transaction
   * threshold, held for review. Deposits never enter it.
   */
  pending_approval?: boolean;
  start_date?: string;
  end_date?: string;
  page?: number;
  limit?: number;
  paginate?: boolean;
}

export interface AdminSettleTransactionInput {
  transaction_id: string;

  /** `COMPLETED` approves, `CANCELLED` rejects. */
  status: TransactionStatus;

  /** Required when cancelling, ignored when completing. */
  reason?: CancellationReason;

  /** The free-text comment beside the reason. */
  note?: string;
}
