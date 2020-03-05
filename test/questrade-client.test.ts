import nock from 'nock';
import QuestradeClient, { QuestradeApiError } from '../src/questrade-client';

const AUTH_URL = 'https://login.questrade.com';
const API_SERVER_URL = 'https://api01.iq.questrade.com';

const INVALID_ACCESS_TOKEN = 'invalid_access_token';
const VALID_ACCESS_TOKEN = 'valid_access_token';
const VALID_REFRESH_TOKEN1 = 'valid_refresh_token1';
const VALID_REFRESH_TOKEN2 = 'valid_refresh_token2';

it('with invalid refresh token', async () => {
  const client = new QuestradeClient(INVALID_ACCESS_TOKEN);

  expect.assertions(4);

  expect(client.getAccessToken()).toBeUndefined();
  expect(client.getRefreshToken()).toBe(INVALID_ACCESS_TOKEN);

  return client.getAccounts().catch((err) => {
    expect(err).toBeInstanceOf(QuestradeApiError);
    expect(err.message).toContain('Invalid refresh token');
  });
});

it('refresh tokens and query', async () => {
  const scope = nock(AUTH_URL)
    .post(`/oauth2/token?grant_type=refresh_token&refresh_token=${VALID_REFRESH_TOKEN1}`)
    .reply(200, {
      access_token: VALID_ACCESS_TOKEN,
      refresh_token: VALID_REFRESH_TOKEN2,
      api_server: API_SERVER_URL,
      expires_in: 500,
    });

  const scope2 = nock(API_SERVER_URL)
    .get('/v1/accounts')
    .reply(200, {});

  const client = new QuestradeClient(VALID_REFRESH_TOKEN1);
  await client.getAccounts();

  expect(client.getRefreshToken()).toBe(VALID_REFRESH_TOKEN2);
  expect(client.getAccessToken()).toBe(VALID_ACCESS_TOKEN);
  expect(scope.isDone()).toBe(true);
  expect(scope2.isDone()).toBe(true);
});
