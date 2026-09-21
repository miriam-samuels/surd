import { ERROR_FRAGMENT, RATE_EDITOR_FIELDS, RATE_FIELDS } from "@/api/fragments";

export const RATES_QUERY = `
query Rates($input: RateFilter!) {
  rates(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithRates {
      message
      data {
        ${RATE_FIELDS}
        ${RATE_EDITOR_FIELDS}
      }
    }
  }
}
`;

export const SAVE_RATE_MUTATION = `
mutation Rate($input: RateInput!) {
  rate(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithRate {
      message
      data {
        ${RATE_FIELDS}
        ${RATE_EDITOR_FIELDS}
      }
    }
  }
}
`;
