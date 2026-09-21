import { ERROR_FRAGMENT, TRANSACTION_DETAIL_FIELDS } from "@/api/fragments";

export const ADMIN_TREASURY_OVERVIEW_QUERY = `
query AdminTreasuryOverview($input: AdminCurrencyInput) {
  adminTreasuryOverview(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithAdminTreasuryOverview {
      message
      data {
        currency
        safe_deployable_capital
        total_capital_outflow
        total_capital_refund
        net_capital_position
        net_capital_position_change_today
        liquidity_ratio
        liquidity_status
        treasury_exposure_pct
        treasury_exposure_status
        obligations
        liquid_assets
      }
    }
  }
}
`;

export const ADMIN_TREASURY_SERIES_QUERY = `
query AdminTreasurySeries($input: AdminSeriesInput) {
  adminTreasurySeries(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithAdminTreasurySeries {
      message
      data {
        date
        safe_deployable_capital_pct
        obligations_pct
        liquidity_ratio
      }
    }
  }
}
`;

const CHALLENGE_SELECTION = `
  ${ERROR_FRAGMENT}
  ... on ResponseWithCapitalTransactionChallenge {
    message
    data {
      challenge_id
      expires_at
      type
      currency
      amount
      method
    }
  }
`;

const SETTLED_TRANSACTION_SELECTION = `
  ${ERROR_FRAGMENT}
  ... on ResponseWithTransaction {
    message
    data {
      ${TRANSACTION_DETAIL_FIELDS}
    }
  }
`;

export const ADMIN_INITIATE_CAPITAL_OUTFLOW_MUTATION = `
mutation AdminInitiateCapitalOutflow($input: AdminInitiateCapitalOutflowInput!) {
  adminInitiateCapitalOutflow(input: $input) {
    ${CHALLENGE_SELECTION}
  }
}
`;

export const ADMIN_CONFIRM_CAPITAL_OUTFLOW_MUTATION = `
mutation AdminConfirmCapitalOutflow($input: AdminConfirmCapitalTransactionInput!) {
  adminConfirmCapitalOutflow(input: $input) {
    ${SETTLED_TRANSACTION_SELECTION}
  }
}
`;

export const ADMIN_INITIATE_CAPITAL_REFUND_MUTATION = `
mutation AdminInitiateCapitalRefund($input: AdminInitiateCapitalRefundInput!) {
  adminInitiateCapitalRefund(input: $input) {
    ${CHALLENGE_SELECTION}
  }
}
`;

export const ADMIN_CONFIRM_CAPITAL_REFUND_MUTATION = `
mutation AdminConfirmCapitalRefund($input: AdminConfirmCapitalTransactionInput!) {
  adminConfirmCapitalRefund(input: $input) {
    ${SETTLED_TRANSACTION_SELECTION}
  }
}
`;
