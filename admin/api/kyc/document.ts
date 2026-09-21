import { ERROR_FRAGMENT, KYC_DETAIL_FIELDS, KYC_FIELDS, PAGINATION_FIELDS } from "@/api/fragments";

export const ADMIN_KYCS_QUERY = `
query AdminKYCs($input: AdminKYCFilterInput) {
  adminKYCs(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithKYCs {
      message
      data {
        ${KYC_FIELDS}
        user {
          id
          firstname
          lastname
          email
          avatar
          status
        }
      }
      ${PAGINATION_FIELDS}
    }
  }
}
`;

export const ADMIN_KYC_QUERY = `
query AdminKYC($input: AdminKYCUserInput!) {
  adminKYC(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithKYC {
      message
      data {
        ${KYC_DETAIL_FIELDS}
      }
    }
  }
}
`;

export const ADMIN_KYC_OVERVIEW_QUERY = `
query AdminKYCOverview($input: AdminKYCOverviewInput) {
  adminKYCOverview(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithAdminKYCOverview {
      message
      data {
        pending_reviews
        closed_accounts
        stuck_reviews
        rejected_reviews
        suspended_accounts
        frozen_accounts
      }
    }
  }
}
`;

export const ADMIN_UPDATE_KYC_STATUS_MUTATION = `
mutation AdminUpdateKYCStatus($input: AdminUpdateKYCStatusInput!) {
  adminUpdateKYCStatus(input: $input) {
    ${ERROR_FRAGMENT}
    ... on Respond {
      message
    }
  }
}
`;
