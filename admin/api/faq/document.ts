import { ERROR_FRAGMENT, FAQ_FIELDS, PAGINATION_FIELDS } from "@/api/fragments";

export const FAQS_QUERY = `
query Faqs($input: FAQFilterInput) {
  faqs(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithFAQs {
      message
      data {
        ${FAQ_FIELDS}
      }
      ${PAGINATION_FIELDS}
    }
  }
}
`;

export const FAQ_QUERY = `
query Faq($input: ID!) {
  faq(faq_id: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithFAQ {
      message
      data {
        ${FAQ_FIELDS}
      }
    }
  }
}
`;

export const CREATE_FAQ_MUTATION = `
mutation CreateFAQ($input: FAQInput!) {
  createFAQ(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithFAQ {
      message
      data {
        ${FAQ_FIELDS}
      }
    }
  }
}
`;

export const UPDATE_FAQ_MUTATION = `
mutation UpdateFAQ($input: UpdateFAQInput!) {
  updateFAQ(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithFAQ {
      message
      data {
        ${FAQ_FIELDS}
      }
    }
  }
}
`;

export const DELETE_FAQ_MUTATION = `
mutation DeleteFAQ($input: ID!) {
  deleteFAQ(faq_id: $input) {
    ${ERROR_FRAGMENT}
    ... on Response {
      message
    }
  }
}
`;
