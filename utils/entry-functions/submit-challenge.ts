import { TxnBuilderTypes } from 'aptos';

export type SubmitChallengeArguments = {
  challengeId: number;
  ipfsUri: string;
};

export const submitChallenge = (args: SubmitChallengeArguments) => {
  const { challengeId, ipfsUri } = args;

  return {
    type: 'entry_function_payload',
    function: `${process.env.NEXT_PUBLIC_CHALLENGES_MODULE_ADDRESS}::challenge_contract::submit`,
    type_arguments: [],
    arguments: [challengeId, ipfsUri],
  };
};
