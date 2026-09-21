import { ERROR_FRAGMENT, WALLET_FIELDS } from "@/api/fragments";

export const ADMIN_WALLET_OVERVIEW_QUERY = `
query AdminWalletOverview($input: AdminDateRangeInput) {
  adminWalletOverview(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithAdminWalletOverview {
      message
      data {
        currency
        total_flexi_balance
        total_flexi_balance_change_pct_vs_last_month
        total_flexi_deposits
        total_flexi_deposits_change_pct_vs_yesterday
        total_flexi_withdrawals
        total_flexi_withdrawals_change_pct_vs_yesterday
        flexi_roi_liability
        flexi_roi_liability_change_today
        large_transaction_requests
      }
    }
  }
}
`;

export const ADMIN_WALLET_BALANCE_SERIES_QUERY = `
query AdminWalletBalanceSeries($input: AdminSeriesInput) {
  adminWalletBalanceSeries(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithAdminWalletBalanceSeries {
      message
      data {
        date
        flexi_balance
      }
    }
  }
}
`;

export const WALLETS_QUERY = `
query Wallets($input: WalletFilter!) {
  wallets(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithWallets {
      message
      data {
        ${WALLET_FIELDS}
      }
    }
  }
}
`;

export const ADD_WALLET_MUTATION = `
mutation AddWallet($input: WalletInput!) {
  addWallet(input: $input) {
    ${ERROR_FRAGMENT}
    ... on ResponseWithWallet {
      message
      data {
        ${WALLET_FIELDS}
        address {
          address
          network
          router
        }
      }
    }
  }
}
`;
