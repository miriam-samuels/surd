import type { AuditModule, AuditStatus } from "@/types/enum";
import type { DateRange, PageRequest } from "@/types/filters";

export interface AdminAuditLog {
  id: string;
  admin_id: string;

  /**
   * All four are `String!` and come back `""` when the user row was deleted —
   * fall back to initials rather than rendering an empty chip.
   */
  admin_firstname: string;
  admin_lastname: string;
  admin_email: string;
  admin_avatar: string;

  module: AuditModule;
  action: string;

  /** The precise operation. Support detail, not a column. */
  resolver: string;
  status: AuditStatus;

  /** Returned in full; masking is the client's job. `""` on older rows. */
  ip_address: string;

  /** Raw user agent. `""` on rows written before client capture existed. */
  device: string;
  created_at: string;
}

export interface AdminAuditLogsFilterInput extends PageRequest, DateRange {
  search?: string;

  /** OR'd together. Omit for every module. */
  modules?: AuditModule[];

  /** OR'd together. Omit for every admin. */
  admin_ids?: string[];
  paginate?: boolean;
}
