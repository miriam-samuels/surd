import { ERROR_FRAGMENT, SESSION_USER_FIELDS } from "@/api/fragments";

export const ADMIN_LOGIN_MUTATION = `
mutation AdminLogin($input: EmailVerificationInput!) {
  adminLogin(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithAdminLoginChallenge {
      message
      data {
        resend_after_seconds
        expires_at
      }
    }
  }
}
`;

export const ADMIN_VERIFY_LOGIN_MUTATION = `
mutation AdminVerifyLogin($input: AdminVerifyLoginInput!) {
  adminVerifyLogin(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithUser {
      message
      data {
        ${SESSION_USER_FIELDS}
      }
    }
  }
}
`;

export const PROFILE_QUERY = `
query Profile {
  profile {
    ${ERROR_FRAGMENT}
    ... on ResponseWithUser {
      message
      data {
        ${SESSION_USER_FIELDS}
      }
    }
  }
}
`;
