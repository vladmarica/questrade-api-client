import fetch from 'node-fetch';
import { EventEmitter } from 'events';
import * as types from './api-types';

const AUTH_URL = 'https://login.questrade.com/oauth2/token';
const CODE_BAD_REQUEST = 400;

export class QuestradeApiError extends Error {
  code: number;

  body: string;

  constructor(message: string, code: number, body: string) {
    super(message);
    this.code = code;
    this.body = body;
  }
}

function dbg(msg: string) {
  console.log(`[DEBUG] ${msg}`);
}

function getCurrentTimeSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

class QuestradeClient {
  private refreshToken: string;

  private accessToken?: string;

  private expirationTime: number;

  private apiServer: string = 'https://api01.iq.questrade.com'; // default API server (may change over time)

  public readonly emitter: EventEmitter;

  constructor(refreshToken: string) {
    this.refreshToken = refreshToken;
    this.accessToken = undefined;
    this.expirationTime = getCurrentTimeSeconds() + 500;
    this.emitter = new EventEmitter();
  }

  /**
   * Internal method for sending a request to the Questrade API. Which API server is used depends
   * on the server URL that is returned by the most recent token refresh request.
   * @param endpoint The Questrade API endpoint to call, such as `/v1/accounts`
   * @param method The HTTP method to use, `GET` by default.
   */
  private async _doApiRequest(endpoint: string, method: string = 'GET'): Promise<any> {
    const url = `${this.apiServer.replace(/\/$/, '')}${endpoint}`;
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    if (!res.ok) {
      throw new QuestradeApiError(`Failed to ${method} ${url}`, res.status, await res.text());
    }

    return res.json();
  }

  /**
   * Internal method for refreshing the access token. Exchanges the current refresh token for a new
   * access token and refresh token. This method may update the used API server URL and access token
   * expiration time.
   *
   * Emits the 'refresh' event on success.
   *
   * @throws `QuestradeApiError` if any HTTP error occurs
   */
  private async _updateTokens(): Promise<void> {
    dbg('Attempting token refresh...');

    const res = await fetch(`${AUTH_URL}?grant_type=refresh_token&refresh_token=${this.refreshToken}`, {
      method: 'POST',
    });

    if (!res.ok) {
      if (res.status === CODE_BAD_REQUEST) {
        throw new QuestradeApiError('Invalid refresh token', res.status, '');
      } else {
        throw new QuestradeApiError('Failed to refresh tokens', res.status, await res.text());
      }
    }

    const body: types.QuestradeTokenRefreshResponse = await res.json();
    this.accessToken = body.access_token;
    this.refreshToken = body.refresh_token;
    this.apiServer = body.api_server;
    this.expirationTime = getCurrentTimeSeconds() + body.expires_in;

    dbg('Token refresh success: next expiration = ' + this.expirationTime);
    dbg('New refresh token is ' + this.refreshToken);

    this.emitter.emit('refresh');
  }

  private _tokensNeedUpdating(): boolean {
    if (!this.accessToken) {
      return true;
    }

    return getCurrentTimeSeconds() >= this.expirationTime - 20;
  }

  async getAccounts(): Promise<types.QuestradeAccountsResponse> {
    if (this._tokensNeedUpdating()) {
      await this._updateTokens();
    }

    return this._doApiRequest('/v1/accounts');
  }

  async getAccountBalances(accountNumber: string): Promise<types.QuestradeAccountBalancesResponse> {
    if (this._tokensNeedUpdating()) {
      await this._updateTokens();
    }

    return this._doApiRequest(`/v1/accounts/${accountNumber}/balances`);
  }

  getRefreshToken() {
    return this.refreshToken;
  }

  getAccessToken() {
    return this.accessToken;
  }
}

export default QuestradeClient;
