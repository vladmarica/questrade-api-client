export interface QuestradeTokenRefreshResponse {
  /** Access token for making authenticated calls. */
  access_token: string;

  /** Refresh token that can be exchanged for a new access token when the current one expires. */
  refresh_token: string;

  /** URL of the API server that the client application should contact */
  api_server: string;

  /** Duration in seconds that the access token is valid for. */
  expires_in: number;
}

/** Response type for the `/v1/accounts` endpoint */
export interface QuestradeAccountsResponse {
  /** The unique identifier for the owner of the accounts. */
  userId: number;

  /** Array of accounts. */
  accounts: QuestradeAccountInfo[];
}

/** Response type for the `/v1/account/:id/balances` endpoint */
export interface QuestradeAccountBalancesResponse {
  perCurrencyBalances: QuestradeBalance[];
  combinedBalances: QuestradeBalance[];
}

export interface QuestradeAccountInfo {
  /** Account type, such as `Margin`, `Cash`, `TFSA`, or `RRSP`. */
  type: string;

  /** Unique 8-digit account identifier. */
  number: string;

  /** Account status, such as `Active` or `Closed`. */
  status: string;

  /** Whether this account is the primary one for the holder. */
  isPrimary: boolean;

  /** Whether this account gets billed for various expenses such as inactivity fees. */
  isBilling: boolean;

  /** The type of client that this account belongs to, such as `Individual` or `Corporation`. */
  clientAccountType: string;
}

export interface QuestradeBalance {
  /** The currency this balance is in, either `'CAD'` or `'USD'`. */
  currency: string;

  /** The spare cash (non-invested) in the account. */
  cash: number;

  /** The summed market value of all positions. */
  marketValue: number;

  /** The sum of market value and cash in the account. */
  totalEquity: number;

  /** Whether the balance data is real-time or not. */
  isRealTime: boolean;
}
