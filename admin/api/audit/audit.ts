"use client";

import { createQuery } from "@/api/factory";
import { ADMIN_AUDIT_LOGS_QUERY } from "@/api/audit/document";
import type { AdminAuditLog, AdminAuditLogsFilterInput } from "@/types/audit";

/*
 * Opening this page writes a `CONFIGURATION` row of its own, so expect your
 * own page loads in the list. A short stale time keeps that from turning every
 * focus change into another entry.
 */
export const useAdminAuditLogs = createQuery<
  AdminAuditLog[],
  AdminAuditLogsFilterInput
>({
  resolver: "adminAuditLogs",
  document: ADMIN_AUDIT_LOGS_QUERY,
  scope: "audit",
  paginated: true,
  staleTime: 60_000,
});
