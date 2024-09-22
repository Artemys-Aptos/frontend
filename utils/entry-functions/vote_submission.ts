import { TxnBuilderTypes } from 'aptos';

export type VoteSubmissionArguments = {
  challengeId: number;
  submissionId: number;
};

export const voteSubmission = (args: VoteSubmissionArguments) => {
  const { challengeId, submissionId } = args;

  return {
    type: 'entry_function_payload',
    function: `${process.env.NEXT_PUBLIC_CHALLENGES_MODULE_ADDRESS}::challenge_contract::vote`,
    type_arguments: [],
    arguments: [challengeId, submissionId],
  };
};
