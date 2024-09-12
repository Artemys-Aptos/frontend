import { TxnBuilderTypes } from 'aptos';

export type CreatePromptCollectionArguments = {
  description: string;
  name: string;
  uri: string;
  maxSupply: number;
  preMintAmount: number;
  publicMintStartTime: Date;
  publicMintEndTime?: Date | null;
  publicMintLimitPerAddr: number;
  publicMintFeePerPrompt: number;
};

export const createPromptCollection = (
  args: CreatePromptCollectionArguments
) => {
  const {
    description,
    name,
    uri,
    maxSupply,
    preMintAmount,
    publicMintStartTime,
    publicMintEndTime,
    publicMintLimitPerAddr,
    publicMintFeePerPrompt,
  } = args;

  return {
    type: 'entry_function_payload',
    function: `${process.env.NEXT_PUBLIC_MODULE_ADDRESS}::prompt_marketplace::create_prompt_collection`,
    type_arguments: [],
    arguments: [
      description,
      name,
      uri,
      maxSupply,
      preMintAmount,
      Math.floor(publicMintStartTime.getTime() / 1000),
      publicMintEndTime ? Math.floor(publicMintEndTime.getTime() / 1000) : null,
      publicMintLimitPerAddr,
      Math.floor(publicMintFeePerPrompt * 100000000),
    ],
  };
};
