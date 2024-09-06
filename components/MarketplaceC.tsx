// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import PromptCard from './cards/PromptCard';
import MarketplaceTab from './tab/MarketplaceTab';
import MarketplaceHeader from './MarketplaceHeader';
import axios from 'axios';
import PromptCardSkeleton from './skeleton/PromptCardSkeleton';
import { useGetNft } from '@/hooks/useGetNft';

interface Attribute {
  trait_type: string;
  value: string;
}

interface NFT {
  metadata_url: string;
  image_url?: string;
  name?: string;
  prompts?: string;
  identifier: string;
  attributes: Attribute[];
}

const MarketplaceC = () => {
  const [listedNFTs, setListedNFTs] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { nfts } = useGetNft();

  console.log(nfts);

  const getAttributeValue = (
    attributes: Attribute[],
    traitType: string
  ): string => {
    const attribute = attributes.find((attr) => attr.trait_type === traitType);
    return attribute ? attribute.value : '';
  };

  const fetchIPFSMetadata = async (ipfsUri: string) => {
    try {
      const url = ipfsUri.replace(
        'ipfs://',
        'https://gateway.pinata.cloud/ipfs/'
      );
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching IPFS metadata:', error);
      return null;
    }
  };

  // const fetchNftsData = async () => {
  //   setIsLoading(true);
  //   const promises = nfts.map(async (nft) => {
  //     const metadata = await fetchIPFSMetadata(nft.tokenUri);
  //     if (metadata) {
  //       const typeAttribute = metadata.attributes?.find(
  //         (attr) => attr.trait_type === 'type'
  //       );
  //       if (typeAttribute && typeAttribute.value === 'premium') {
  //         return {
  //           metadata_url: nft.tokenUri,
  //           image_url: metadata.image,
  //           name: metadata.name,
  //           prompts: metadata.attributes?.find(
  //             (attr) => attr.trait_type === 'prompts'
  //           )?.value,
  //           identifier: nft.id,
  //           attributes: metadata.attributes,
  //         };
  //       }
  //     }
  //     return null;
  //   });
  //   const results = (await Promise.all(promises)).filter((nft) => nft !== null);
  //   setListedNFTs(results);
  //   setIsLoading(false);
  // };

  return (
    <>
      <MarketplaceHeader />
      <div className="ml-[10px] flex items-center justify-between mr-[40px]">
        <MarketplaceTab />
        <div className="text-gray-400 flex items-center">
          <p className="py-2 px-6 font-bold rounded-md text-sm bg-white/10">
            Chain:
          </p>
          &nbsp; &nbsp; &nbsp;
          <p className="font-bold flex items-center py-1 px-3 rounded-xl border border-gray-300 cursor-pointer">
            <img
              src="/shardeum.png"
              alt=""
              className="w-[34px] h-[35px] p-1  rounded-2xl"
            />
            Shardeum
          </p>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-3 mt-4 ml-[35px] mr-[6px] pl-[200px]">
        {isLoading
          ? Array.from({ length: 10 }).map((_, index) => (
              <PromptCardSkeleton key={index} />
            ))
          : listedNFTs.map((nft, index) => (
              <PromptCard
                key={index}
                tokenId={nft.identifier}
                img={nft.image_url}
                name={nft.name}
                prompt={nft.prompts}
                chainAddress={nft.metadata_url}
                creator={getAttributeValue(nft.attributes, 'creator')}
              />
            ))}
      </div>
    </>
  );
};

export default React.memo(MarketplaceC);
