import type { FaqStatus } from "@/types/enum";

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  sort_order: number;
  status: FaqStatus | string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface FaqInput {
  question: string;
  answer: string;
  category?: string;
  sort_order?: number;
  status?: FaqStatus | string;
}

export type UpdateFaqInput = Partial<FaqInput> & { id: string };
