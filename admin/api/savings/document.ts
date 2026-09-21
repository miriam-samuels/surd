import {
  ERROR_FRAGMENT,
  PAGINATION_FIELDS,
  PRODUCT_FIELDS,
  SAVING_FIELDS,
} from "@/api/fragments";

export const ADMIN_SAVINGS_OVERVIEW_QUERY = `
query AdminSavingsOverview($input: AdminDateRangeInput) {
  adminSavingsOverview(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithAdminSavingsOverview {
      message
      data {
        currency
        total_savings_balance
        total_savings_balance_change_pct_vs_yesterday
        total_fixed_deposit_balance
        total_fixed_deposit_balance_change_pct_vs_last_month
        total_target_savings_balance
        total_target_savings_balance_change_pct_vs_last_month
        total_locked_savings
        total_locked_savings_change_pct_vs_last_month
        average_plan_size
        average_plan_size_change_pct_vs_yesterday
        active_savings_plans_count
        upcoming_maturities_30d_amount
        upcoming_maturities_30d_count
      }
    }
  }
}
`;

export const ADMIN_SAVINGS_BY_TYPE_QUERY = `
query AdminSavingsByType($input: AdminDateRangeInput) {
  adminSavingsByType(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithAdminBreakdown {
      message
      data {
        key
        label
        amount
      }
    }
  }
}
`;

export const ADMIN_SAVINGS_BALANCE_SERIES_QUERY = `
query AdminSavingsBalanceSeries($input: AdminSeriesInput) {
  adminSavingsBalanceSeries(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithAdminSavingsBalanceSeries {
      message
      data {
        date
        total_savings_balance
      }
    }
  }
}
`;

export const ADMIN_SAVINGS_MATURITY_TIMELINE_QUERY = `
query AdminSavingsMaturityTimeline($input: AdminSeriesInput) {
  adminSavingsMaturityTimeline(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithAdminMaturityTimeline {
      message
      data {
        date
        amount
        count
      }
    }
  }
}
`;

export const SAVINGS_QUERY = `
query Savings($input: SavingFilterInput) {
  savings(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithSavings {
      message
      data {
        ${SAVING_FIELDS}
        user {
          id
          firstname
          lastname
          email
          avatar
        }
      }
      ${PAGINATION_FIELDS}
    }
  }
}
`;

export const SAVING_QUERY = `
query Saving($input: SavingFilterInput!) {
  saving(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithSaving {
      message
      data {
        ${SAVING_FIELDS}
        product {
          ${PRODUCT_FIELDS}
        }
      }
    }
  }
}
`;
