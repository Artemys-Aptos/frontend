import React, { useEffect, useState } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import axios from 'axios';
import ImageCard from './cards/ImageCard';
import ImageSkeleton from './skeleton/ImageSkeleton';
import { useGetNft } from '@/hooks/useGetNft';

interface NFT {
  metadata_url: string;
  image_url?: string;
  name?: string;
  prompts?: string;
  identifier: string;
  attributes: Attribute[];
}

interface Token {
  metadata?: Metadata;
  id: string;
  image_url?: string;
}

interface Metadata {
  attributes?: Attribute[];
  name?: string;
}

interface Attribute {
  trait_type: string;
  value: string;
}

const ExploreMasonry = () => {
  const [listedNFTs, setListedNFTs] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const API_URL = process.env.NEXT_PUBLIC_RPC_LINK;

  const { nfts } = useGetNft();

  const fetchMetadata = async (url) => {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching metadata:', error);
      return null;
    }
  };

  const fetchNftsData = async () => {
    setIsLoading(true);
    const promises = nfts.map(async (nft) => {
      const metadata = await fetchMetadata(nft.tokenUri);
      if (metadata) {
        const typeAttribute = metadata.attributes?.find(
          (attr) => attr.trait_type === 'type'
        );
        if (typeAttribute && typeAttribute.value === 'public') {
          return {
            metadata_url: nft.tokenUri,
            image_url: metadata.image,
            name: metadata.name,
            prompts: metadata.attributes?.find(
              (attr) => attr.trait_type === 'prompts'
            )?.value,
            identifier: nft.id,
            attributes: metadata.attributes,
          };
        }
      }
      return null;
    });
    const results = (await Promise.all(promises)).filter((nft) => nft !== null);
    setListedNFTs(results);
    setIsLoading(false);
  };

  useEffect(() => {
    if (nfts.length) {
      fetchNftsData();
    }
  }, [nfts]);

  console.log(listedNFTs);

  const skeletonItems = Array.from({ length: 10 }).map((_, index) => (
    <ImageSkeleton key={index} index={index} />
  ));

  const imageItems = listedNFTs.map((nft, index) => (
    <ImageCard
      key={index}
      index={index}
      imageUrl={nft.image_url}
      name={nft.name}
      prompt={
        nft.attributes?.find((attr) => attr.trait_type === 'prompts')?.value
      }
    />
  ));

  return (
    <div className="ml-[230px] mt-1">
      <ResponsiveMasonry
        columnsCountBreakPoints={{ 400: 2, 500: 3, 700: 4, 900: 5 }}
      >
        <Masonry columnsCount={5} gutter="10px">
          {isLoading ? skeletonItems : imageItems}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
};

export default ExploreMasonry;
