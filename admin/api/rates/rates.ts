"use client";

import { createMutation, createQuery } from "@/api/factory";
import { RATES_QUERY, SAVE_RATE_MUTATION } from "@/api/rates/document";
import type { Rate, RateFilter, RateInput } from "@/types/rate";

export const useRates = createQuery<Rate[], RateFilter>({
  resolver: "rates",
  document: RATES_QUERY,
  scope: "rates",
});

export const useSaveRate = createMutation<Rate, RateInput>({
  resolver: "rate",
  document: SAVE_RATE_MUTATION,
  success: "Rate saved.",
  invalidates: ["rates", "transactions", "metrics"],
});
