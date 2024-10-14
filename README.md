## Artemys AI

Next.js API Routes.
- [Finalize Challenges API](https://github.com/Artemys-Aptos/frontend/blob/main/pages/api/admin/batch-finalize-challenges.ts) - periodically called by the automation service to finalize expired challenges
- [Sponsored Transaction](https://github.com/Artemys-Aptos/frontend/blob/main/pages/api/sponsor-transaction.ts) - enables gasless transactions
- [Challenges](https://github.com/Artemys-Aptos/frontend/tree/main/pages/api/challenges) - Used to retrieve and process indexed data from the challenges contract
- [Get User Prompts](https://github.com/Artemys-Aptos/frontend/blob/main/pages/api/my-creations/getUserPrompts.ts) / [Read user wallet](https://github.com/Artemys-Aptos/frontend/blob/main/utils/aptos/checkTokenAccess.ts) - enables tokengating
