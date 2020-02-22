# questrade-api-client <a href="https://www.npmjs.com/package/humio-winston"><img src="https://img.shields.io/npm/v/questrade-api-client.svg" alt="" />

A simple Node.js client for interacting with the [Questrade REST API](https://www.questrade.com/api).
## Installation
```
npm install --save questrade-api-client
```

## Usage
You must pass in a Questrade API refresh token to the `QuestradeClient` constructor.

This example prints out the user's account numbers and types.

```javascript
import QuestradeClient from 'questrade-api-client';

(async () => {
    const client = new QuestradeClient('<REFRESH_TOKEN>');
    const response = client.getAccounts();
    for (const account of response.accounts) {
        console.log(`Account ${account.number}: ${account.type}`);
    }
})();
```
Example output:
```
Account 412321: RRSP
Account 424700: TFSA
```

## Supported Functions
Currently, only a part of the Questrade REST API is supported by this client.

| Function | API Method |
| --- | --- |
| getAccounts() | [/v1/accounts](https://www.questrade.com/api/documentation/rest-operations/account-calls/accounts) |
| getAccountBalances(*id*) | [/v1/accounts/:id/balances](https://www.questrade.com/api/documentation/rest-operations/account-calls/accounts-id-balances) |

Check the official API docs to see exactly what fields are returned by each function.