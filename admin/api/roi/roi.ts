"use client";

import { createQuery } from "@/api/factory";
import {
  ADMIN_ROI_BY_PRODUCT_QUERY,
  ADMIN_ROI_FLOW_SERIES_QUERY,
  ADMIN_ROI_OVERVIEW_QUERY,
} from "@/api/roi/document";
import type { AdminDateRangeInput, AdminSeriesInput } from "@/types/filters";
import type {
  AdminBreakdownItem,
  AdminRoiFlowPoint,
  AdminRoiOverview,
} from "@/types/metrics";

/**
 * `data` is a list — one row per currency, nothing converted. Passing
 * `currency` narrows it to a single row rather than changing the shape, so the
 * caller still has to pick the row out of the array.
 */
export const useAdminRoiOverview = createQuery<
  AdminRoiOverview[],
  AdminDateRangeInput
>({
  resolver: "adminROIOverview",
  document: ADMIN_ROI_OVERVIEW_QUERY,
  scope: "roi",
});

export const useAdminRoiByProduct = createQuery<AdminBreakdownItem[], AdminDateRangeInput>({
  resolver: "adminROIByProduct",
  document: ADMIN_ROI_BY_PRODUCT_QUERY,
  scope: "roi",
  staleTime: 60_000,
});

export const useAdminRoiFlowSeries = createQuery<AdminRoiFlowPoint[], AdminSeriesInput>({
  resolver: "adminROIFlowSeries",
  document: ADMIN_ROI_FLOW_SERIES_QUERY,
  scope: "roi",
  staleTime: 60_000,
});
