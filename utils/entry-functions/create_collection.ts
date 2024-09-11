import { InputTransactionData } from '@aptos-labs/wallet-adapter-react';
import {
  APT_DECIMALS,
  dateToSeconds,
  convertAmountFromHumanReadableToOnChain,
} from '@/utils/helpers';

export type CreatePromptCollectionArguments = {
  description: string;
  name: string;
  uri: string;
  maxSupply: number;
  preMintAmount?: number;
  publicMintStartTime: Date;
  publicMintEndTime?: Date;
  publicMintLimitPerAddr: number;
  publicMintFeePerPrompt: number;
};

export const createPromptCollection = (
  args: CreatePromptCollectionArguments
): InputTransactionData => {
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
    data: {
      function: `${process.env.NEXT_PUBLIC_MODULE_ADDRESS}::prompt_marketplace::create_prompt_collection`,
      typeArguments: [],
      functionArguments: [
        description,
        name,
        uri,
        maxSupply,
        preMintAmount !== undefined ? preMintAmount : null,
        dateToSeconds(publicMintStartTime),
        publicMintEndTime ? dateToSeconds(publicMintEndTime) : null,
        publicMintLimitPerAddr,
        convertAmountFromHumanReadableToOnChain(
          publicMintFeePerPrompt,
          APT_DECIMALS
        ),
      ],
    },
  };
};
