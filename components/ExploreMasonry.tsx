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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [publicPrompts, setPublicPrompts] = useState([]);
  const API_URL = process.env.NEXT_PUBLIC_RPC_LINK;
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  const { nfts } = useGetNft();

  useEffect(() => {
    fetchPublicPrompts();
  }, [nfts]);

  const skeletonItems = Array.from({ length: 10 }).map((_, index) => (
    <ImageSkeleton key={index} index={index} />
  ));

  const imageItems = publicPrompts?.map((nft, index) => (
    <ImageCard
      key={index}
      index={index}
      imageUrl={nft.ipfs_image_url}
      name={nft.post_name}
      prompt={nft.prompt}
    />
  ));

  const fetchPublicPrompts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/prompts/get-public-prompts/?page=1&page_size=20`
      );
      setPublicPrompts(response.data.prompts);
    } catch (error) {
      console.error('Error fetching public prompts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ml-[230px] mt-1">
      <ResponsiveMasonry
        columnsCountBreakPoints={{ 400: 2, 500: 3, 700: 4, 900: 5 }}
      >
        <Masonry columnsCount={5} gutter="8px">
          {isLoading ? skeletonItems : imageItems}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
};

export default ExploreMasonry;
