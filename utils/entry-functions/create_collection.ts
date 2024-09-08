import { InputTransactionData } from '@aptos-labs/wallet-adapter-react';
import {
  APT_DECIMALS,
  dateToSeconds,
  convertAmountFromHumanReadableToOnChain,
} from '../helpers';

export type CreateCollectionArguments = {
  collectionDescription: string;
  collectionName: string;
  projectUri: string;
  maxSupply: number;
  royaltyPercentage?: number;
  preMintAmount?: number;
  publicMintStartDate: Date;
  publicMintEndDate?: Date;
  publicMintLimitPerAccount: number;
  publicMintFeePerNFT: number;
};

export const createCollection = (
  args: CreateCollectionArguments
): InputTransactionData => {
  const {
    collectionDescription,
    collectionName,
    projectUri,
    maxSupply,
    royaltyPercentage,
    preMintAmount,
    publicMintStartDate,
    publicMintEndDate,
    publicMintLimitPerAccount,
    publicMintFeePerNFT,
  } = args;

  return {
    data: {
      function: `${process.env.NEXT_PUBLIC_MODULE_ADDRESS}::launchpad::create_collection`,
      typeArguments: [],
      functionArguments: [
        collectionDescription,
        collectionName,
        projectUri,
        maxSupply,
        royaltyPercentage,
        preMintAmount,
        dateToSeconds(publicMintStartDate),
        publicMintEndDate ? dateToSeconds(publicMintEndDate) : null,
        publicMintLimitPerAccount,
        convertAmountFromHumanReadableToOnChain(
          publicMintFeePerNFT,
          APT_DECIMALS
        ),
      ],
    },
  };
};
