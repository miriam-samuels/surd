"use client";

import { createMutation, createQuery } from "@/api/factory";
import {
  ADMIN_KYC_OVERVIEW_QUERY,
  ADMIN_KYC_QUERY,
  ADMIN_KYCS_QUERY,
  ADMIN_UPDATE_KYC_STATUS_MUTATION,
} from "@/api/kyc/document";
import type {
  AdminKycFilterInput,
  AdminKycOverviewInput,
  AdminKycUserInput,
} from "@/types/filters";
import type {
  AdminKycOverview,
  AdminUpdateKycStatusInput,
  KycWithUser,
} from "@/types/kyc";

export const useAdminKycs = createQuery<KycWithUser[], AdminKycFilterInput>({
  resolver: "adminKYCs",
  document: ADMIN_KYCS_QUERY,
  scope: "kyc",
  paginated: true,
});

export const useAdminKycOverview = createQuery<
  AdminKycOverview,
  AdminKycOverviewInput
>({
  resolver: "adminKYCOverview",
  document: ADMIN_KYC_OVERVIEW_QUERY,
  scope: "kyc",
});

export const useAdminKyc = createQuery<KycWithUser, AdminKycUserInput>({
  resolver: "adminKYC",
  document: ADMIN_KYC_QUERY,
  scope: "kyc",
  key: (input) => ["detail", input?.user_id ?? input?.kyc_id],
  enabled: (input) => Boolean(input?.user_id || input?.kyc_id),
  staleTime: 0,
});

/*
 * Returns `Respond` — a message, no record. Only a *pending* review can be
 * updated: acting on one already decided is a 400, which is the guard against
 * two reviewers deciding the same record. The factory surfaces that message,
 * and invalidating `kyc` refetches the row someone else has just handled.
 */
export const useAdminUpdateKycStatus = createMutation<
  never,
  AdminUpdateKycStatusInput
>({
  resolver: "adminUpdateKYCStatus",
  document: ADMIN_UPDATE_KYC_STATUS_MUTATION,
  success: "KYC decision recorded.",
  invalidates: ["kyc", "users", "audit"],
});
