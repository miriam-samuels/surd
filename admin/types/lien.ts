export interface Lien {
  id: string;
  savings_id: string;
  product_id: string | null;

  author_id: string;
  amount: number;
  reason: string | null;
  active: boolean;
  ending_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LienFilterInput {
  lien_id?: string;
  savings_id?: string;
  user_id?: string;
  active?: boolean;
}

export interface LienInput {
  savings_id: string;
  amount: number;
  reason: string;
  ending_at?: string;
}

export interface LienUpdateInput extends Partial<LienInput> {
  lien_id: string;
  active?: boolean;
}
