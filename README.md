<div align="">
    <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="typescript" />
    <img src="https://img.shields.io/badge/-Next_JS-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=000000" alt="nextdotjs" />
</div>

## Artemys AI

Next.js API Routes.
- [Finalize Challenges API](https://github.com/Artemys-Aptos/frontend/blob/main/pages/api/admin/batch-finalize-challenges.ts) - periodically called by the automation service to finalize expired challenges
- [Sponsored Transaction](https://github.com/Artemys-Aptos/frontend/blob/main/pages/api/sponsor-transaction.ts) - enables gasless transactions
- [Challenges](https://github.com/Artemys-Aptos/frontend/tree/main/pages/api/challenges) - Used to retrieve and process indexed data from the challenges contract
- [Get User Prompts](https://github.com/Artemys-Aptos/frontend/blob/main/pages/api/my-creations/getUserPrompts.ts) / [Read user wallet](https://github.com/Artemys-Aptos/frontend/blob/main/utils/aptos/checkTokenAccess.ts) - enables tokengating

**Environmental Variables**
```NEXT_PUBLIC_PROJECT_ID=
NEXT_PUBLIC_SD_API_KEY=
NEXT_PUBLIC_OPENAI_API_KEY=
NEXT_PUBLIC_APP_NETWORK=
NEXT_PUBLIC_MODULE_ADDRESS=
NEXT_PUBLIC_CREATOR_ADDRESS=
NEXT_PUBLIC_IS_DEV=""
NEXT_PUBLIC_PINATA_API_KEY=
NEXT_PUBLIC_PINATA_SECRET_API_KEY=
NEXT_PUBLIC_API_URL=
FEE_PAYER_PRIVATE_KEY=
NEXT_PUBLIC_FEE_PAYER_ADDRESS=
NEXT_PUBLIC_APTOS_NODE_URL=
NEXT_PUBLIC_CHALLENGES_MODULE_ADDRESS=
FINALIZE_API_KEY=
NEXT_PUBLIC_IS_DEPLOYED=
```
