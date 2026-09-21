"use client";

import { createQuery } from "@/api/factory";
import {
  ADMIN_SAVINGS_BALANCE_SERIES_QUERY,
  ADMIN_SAVINGS_BY_TYPE_QUERY,
  ADMIN_SAVINGS_MATURITY_TIMELINE_QUERY,
  ADMIN_SAVINGS_OVERVIEW_QUERY,
  SAVING_QUERY,
  SAVINGS_QUERY,
} from "@/api/savings/document";
import type { AdminDateRangeInput, AdminSeriesInput } from "@/types/filters";
import type {
  AdminBreakdownItem,
  AdminMaturityPoint,
  AdminSavingsBalancePoint,
  AdminSavingsOverview,
} from "@/types/metrics";
import type { Saving, SavingFilterInput } from "@/types/savings";

/**
 * `data` is a list — one row per currency, nothing converted. Passing
 * `currency` narrows it to a single row rather than changing the shape, so the
 * caller still has to pick the row out of the array.
 */
export const useAdminSavingsOverview = createQuery<
  AdminSavingsOverview[],
  AdminDateRangeInput
>({
  resolver: "adminSavingsOverview",
  document: ADMIN_SAVINGS_OVERVIEW_QUERY,
  scope: "savings",
});

/**
 * Flat, unlike `adminFundsBreakdown`: `ResponseWithAdminBreakdown` returns the
 * items themselves rather than a list of mode-keyed groups, so there is no
 * group to unwrap here.
 */
export const useAdminSavingsByType = createQuery<
  AdminBreakdownItem[],
  AdminDateRangeInput
>({
  resolver: "adminSavingsByType",
  document: ADMIN_SAVINGS_BY_TYPE_QUERY,
  scope: "savings",
  staleTime: 60_000,
});

export const useAdminSavingsBalanceSeries = createQuery<AdminSavingsBalancePoint[], AdminSeriesInput>({
  resolver: "adminSavingsBalanceSeries",
  document: ADMIN_SAVINGS_BALANCE_SERIES_QUERY,
  scope: "savings",
  staleTime: 60_000,
});

export const useAdminSavingsMaturityTimeline = createQuery<AdminMaturityPoint[], AdminSeriesInput>({
  resolver: "adminSavingsMaturityTimeline",
  document: ADMIN_SAVINGS_MATURITY_TIMELINE_QUERY,
  scope: "savings",
  staleTime: 60_000,
});

export const useSavings = createQuery<Saving[], SavingFilterInput>({
  resolver: "savings",
  document: SAVINGS_QUERY,
  scope: "savings",
  paginated: true,
});

export const useSaving = createQuery<Saving, SavingFilterInput>({
  resolver: "saving",
  document: SAVING_QUERY,
  scope: "savings",
  key: (input) => ["detail", input?.savings_id ?? input?.id],
  enabled: (input) => Boolean(input?.savings_id || input?.id),
});
