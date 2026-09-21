import type {
  CapitalTransactionType,
  ChallengeMethod,
  Currency,
} from "@/types/enum";

/** Capped at 256 characters, counted in characters not bytes — a `₦` costs one. */
export const CAPITAL_DESCRIPTION_LIMIT = 256;

export interface CapitalTransactionChallenge {
  challenge_id: string;

  /** Lives a few minutes and is single-use; confirming twice is a 400. */
  expires_at: string;
  type: CapitalTransactionType | string;
  currency: Currency;
  amount: number;

  /**
   * Which second factor was issued. Do **not** hardcode the authenticator
   * wording — today every admin resolves to `EMAIL`, because the admin UI has
   * no authenticator-setup screen yet. A TOTP will not satisfy an `EMAIL`
   * challenge or vice versa.
   */
  method: ChallengeMethod;
}

export interface AdminInitiateCapitalOutflowInput {
  amount: number;

  /**
   * Required. NGN and USD are separate books with separate ceilings, so a
   * movement without a currency has no pool to draw from.
   */
  currency: Currency;

  /** FIXME(api): an enum server-side; the note only names `EXTERNAL_INVESTMENT`. */
  reason: string;
  description?: string;
}

export interface AdminInitiateCapitalRefundInput {
  amount: number;
  currency: Currency;
  description?: string;
}

export interface AdminConfirmCapitalTransactionInput {
  challenge_id: string;
  code: string;
}
