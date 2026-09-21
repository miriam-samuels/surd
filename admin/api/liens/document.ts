import { ERROR_FRAGMENT, LIEN_FIELDS, PAGINATION_FIELDS } from "@/api/fragments";

export const LIENS_QUERY = `
query Liens($input: LienFilterInput) {
  liens(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithLiens {
      message
      data {
        ${LIEN_FIELDS}
      }
      ${PAGINATION_FIELDS}
    }
  }
}
`;

export const LIEN_QUERY = `
query Lien($input: LienFilterInput!) {
  lien(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithLien {
      message
      data {
        ${LIEN_FIELDS}
      }
    }
  }
}
`;

export const PLACE_LIEN_MUTATION = `
mutation PlaceLien($input: LienInput!) {
  placeLien(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithLien {
      message
      data {
        ${LIEN_FIELDS}
      }
    }
  }
}
`;

export const REPLACE_LIEN_MUTATION = `
mutation ReplaceLien($input: LienUpdateInput!) {
  replaceLien(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithLien {
      message
      data {
        ${LIEN_FIELDS}
      }
    }
  }
}
`;
