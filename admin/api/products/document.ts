import {
  ERROR_FRAGMENT,
  PAGINATION_FIELDS,
  PRODUCT_FIELDS,
  TARGET_PLAN_TEMPLATE_FIELDS,
} from "@/api/fragments";

export const PRODUCTS_QUERY = `
query Products {
  products {
    ${ERROR_FRAGMENT}
    ... on ResponseWithProducts {
      message
      data {
        ${PRODUCT_FIELDS}
      }
    }
  }
}
`;

export const PRODUCT_QUERY = `
query Product($input: ProductFilterInput!) {
  product(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithProduct {
      message
      data {
        ${PRODUCT_FIELDS}
      }
    }
  }
}
`;

export const CREATE_PRODUCT_MUTATION = `
mutation CreateProduct($input: ProductInput!) {
  create(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithProduct {
      message
      data {
        ${PRODUCT_FIELDS}
      }
    }
  }
}
`;

export const UPDATE_PRODUCT_MUTATION = `
mutation UpdateProduct($input: ProductUpdateInput!) {
  update(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithProduct {
      message
      data {
        ${PRODUCT_FIELDS}
      }
    }
  }
}
`;

export const DELETE_PRODUCT_MUTATION = `
mutation DeleteProduct($input: ProductUpdateInput!) {
  delete(input: $input) {
    ${ERROR_FRAGMENT}
    ... on Response {
      message
    }
  }
}
`;

export const TARGET_PLAN_TEMPLATES_QUERY = `
query TargetPlanTemplates($input: TargetPlanTemplateFilterInput) {
  targetPlanTemplates(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithTargetPlanTemplates {
      message
      data {
        ${TARGET_PLAN_TEMPLATE_FIELDS}
      }
      ${PAGINATION_FIELDS}
    }
  }
}
`;

export const TARGET_PLAN_TEMPLATE_QUERY = `
query TargetPlanTemplate($input: ID!) {
  targetPlanTemplate(template_id: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithTargetPlanTemplate {
      message
      data {
        ${TARGET_PLAN_TEMPLATE_FIELDS}
      }
    }
  }
}
`;

export const CREATE_TARGET_PLAN_TEMPLATE_MUTATION = `
mutation CreateTargetPlanTemplate($input: TargetPlanTemplateInput!) {
  createTargetPlanTemplate(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithTargetPlanTemplate {
      message
      data {
        ${TARGET_PLAN_TEMPLATE_FIELDS}
      }
    }
  }
}
`;

export const UPDATE_TARGET_PLAN_TEMPLATE_MUTATION = `
mutation UpdateTargetPlanTemplate($input: UpdateTargetPlanTemplateInput!) {
  updateTargetPlanTemplate(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithTargetPlanTemplate {
      message
      data {
        ${TARGET_PLAN_TEMPLATE_FIELDS}
      }
    }
  }
}
`;

export const DELETE_TARGET_PLAN_TEMPLATE_MUTATION = `
mutation DeleteTargetPlanTemplate($input: ID!) {
  deleteTargetPlanTemplate(template_id: $input) {
    ${ERROR_FRAGMENT}
    ... on Response {
      message
    }
  }
}
`;
