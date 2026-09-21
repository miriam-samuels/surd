import type { Currency, WalletType } from "@/types/enum";

export interface WalletAddress {
  address: string;
  network: string;
  router: string | null;
}

export interface Wallet {
  id: string;
  user_id: string;
  type: WalletType | string;
  name: string | null;
  balance: number;
  earnings: number;
  currency: Currency;
  address?: WalletAddress | null;
  created_at: string;
  updated_at: string;
}

export interface WalletFilter {
  wallet_id?: string;
  user_id?: string;
  type?: WalletType | string;
  currency?: Currency;
  page?: number;
  limit?: number;
}

export interface WalletInput {
  user_id?: string;
  type: WalletType | string;
  currency: Currency;
  name?: string;
}
