import fetch from 'node-fetch';

const REFRESH_TOKEN = '';
const REFRESH_URL = 'https://login.questrade.com/oauth2/token?grant_type=refresh_token&refresh_token=';


async function getAccounts(accessToken: string): Promise<any> {
  const response = await fetch('https://api05.iq.questrade.com/v1/accounts', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  return response.json();
}

async function getAccountBalance(accountNumber: string, accessToken: string): Promise<any> {
  const response = await fetch(`https://api05.iq.questrade.com/v1/accounts/${accountNumber}/balances`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  return response.json();
}

/*
(async () => {
    const response = await fetch(`${REFRESH_URL}${REFRESH_TOKEN}`, {
        method: 'POST'
    });

    console.log(`Status code: ${response.status}`);
    console.log(`Response: ` + JSON.stringify(await response.json(), null, 2));
})();
*/

(async () => {
  const accessToken = '';
  const accounts = await getAccounts(accessToken);

  console.log(
    JSON.stringify(accounts, null, 2));

  for (const account of accounts.accounts) {
    console.log(JSON.stringify(
      await getAccountBalance(account.number, accessToken), null, 2));
  }
})();
