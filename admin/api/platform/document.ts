import { ERROR_FRAGMENT, PLATFORM_CONFIG_FIELDS } from "@/api/fragments";

export const PLATFORM_CONFIG_QUERY = `
query PlatformConfig {
  platformConfig {
    ${ERROR_FRAGMENT}
    ... on ResponseWithPlatformConfig {
      message
      data {
        ${PLATFORM_CONFIG_FIELDS}
      }
    }
  }
}
`;

export const ADMIN_PLATFORM_CONFIG_KEYS_QUERY = `
query AdminPlatformConfigKeys {
  adminPlatformConfigKeys {
    ${ERROR_FRAGMENT}
    ... on ResponseWithAdminPlatformConfigKeys {
      message
      data {
        key
        label
        value
        unit
        description
        updated_by_id
        updated_by_firstname
        updated_by_lastname
        updated_by_email
        updated_by_avatar
        updated_at
      }
    }
  }
}
`;

export const MODIFY_PLATFORM_CONFIG_MUTATION = `
mutation ModifyPlatformConfig($input: PlatformConfigInput!) {
  modifyPlatformConfig(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithPlatformConfig {
      message
      data {
        ${PLATFORM_CONFIG_FIELDS}
      }
    }
  }
}
`;

