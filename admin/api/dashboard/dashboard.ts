"use client";

import { createQuery } from "@/api/factory";
import {
  ADMIN_FUNDS_BREAKDOWN_QUERY,
  ADMIN_OVERVIEW_METRICS_QUERY,
  ADMIN_SYSTEM_FUNDS_QUERY,
} from "@/api/dashboard/document";
import type {
  AdminBreakdownInput,
  AdminCurrencyInput,
  AdminSeriesInput,
} from "@/types/filters";
import type {
  AdminBreakdownGroup,
  AdminOverviewMetrics,
  AdminSystemFundsPoint,
} from "@/types/metrics";

/**
 * `data` is a list — one row per currency, nothing converted. Passing
 * `currency` narrows it to a single row rather than changing the shape, so the
 * caller still has to pick the row out of the array.
 */
export const useAdminOverviewMetrics = createQuery<
  AdminOverviewMetrics[],
  AdminCurrencyInput
>({
  resolver: "adminOverviewMetrics",
  document: ADMIN_OVERVIEW_METRICS_QUERY,
  scope: "metrics",
  staleTime: 30_000,
});

export const useAdminSystemFunds = createQuery<
  AdminSystemFundsPoint[],
  AdminSeriesInput
>({
  resolver: "adminSystemFunds",
  document: ADMIN_SYSTEM_FUNDS_QUERY,
  scope: "metrics",
  staleTime: 60_000,
});

/**
 * `data` is a list of groups — one per `mode`, and omitting `mode` returns all
 * three — so passing a mode narrows the list rather than unwrapping it. Match
 * the group on `mode`; do not read `[0]`.
 */
export const useAdminFundsBreakdown = createQuery<
  AdminBreakdownGroup[],
  AdminBreakdownInput
>({
  resolver: "adminFundsBreakdown",
  document: ADMIN_FUNDS_BREAKDOWN_QUERY,
  scope: "metrics",
  staleTime: 60_000,
});
