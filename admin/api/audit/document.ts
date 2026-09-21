import { ERROR_FRAGMENT, PAGINATION_FIELDS } from "@/api/fragments";

export const ADMIN_AUDIT_LOGS_QUERY = `
query AdminAuditLogs($input: AdminAuditLogsFilterInput) {
  adminAuditLogs(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithAdminAuditLogs {
      message
      data {
        id
        admin_id
        admin_firstname
        admin_lastname
        admin_email
        admin_avatar
        module
        action
        resolver
        status
        ip_address
        device
        created_at
      }
      ${PAGINATION_FIELDS}
    }
  }
}
`;
