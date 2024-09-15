import React, { useState } from 'react';
import PromptFreeDetails from '../modals/PromptFreeDetails';
import { FaHeart } from 'react-icons/fa6';
import { HiOutlineHeart } from 'react-icons/hi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

const truncatePrompt = (prompt: string, maxLength = 200) => {
  if (prompt && prompt.length > maxLength) {
    return prompt.substring(0, maxLength) + '...';
  }
  return prompt;
};

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

const likePrompt = async ({
  promptId,
  promptType,
  userAccount,
}: {
  promptId: number;
  promptType: string;
  userAccount: string;
}) => {
  const response = await fetch(`${baseUrl}/socialfeed/like-prompt/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt_id: promptId,
      prompt_type: promptType,
      user_account: userAccount,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to like/unlike prompt');
  }

  return response.json();
};

interface ImageCardProps {
  index: number;
  imageUrl: string;
  name: string;
  prompt: string;
  promptId: number;
  promptType: string;
  account: string;
  initialLikeStatus?: boolean;
  likesCount: number;
}

const ImageCard: React.FC<ImageCardProps> = ({
  index,
  imageUrl,
  name,
  prompt,
  promptId,
  promptType,
  account,
  initialLikeStatus = false,
  likesCount: initialLikesCount,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [isLiked, setIsLiked] = useState(initialLikeStatus);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const queryClient = useQueryClient();
  const { account: userAccount } = useWallet();

  const likeMutation = useMutation(likePrompt, {
    onMutate: async () => {
      const newLikedState = !isLiked;
      setIsLiked(newLikedState);
      setLikesCount((prev) => (newLikedState ? prev + 1 : prev - 1));

      await queryClient.cancelQueries(['prompt', promptId]);

      return { previousLiked: isLiked, previousCount: likesCount };
    },
    onError: (error, variables, context) => {
      if (context) {
        setIsLiked(context.previousLiked);
        setLikesCount(context.previousCount);
      }
    },
    onSuccess: (data) => {
      setLikesCount(data.likes_count);
      setIsLiked(data.is_liked);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['prompt', promptId]);
    },
  });

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    likeMutation.mutate({ promptId, promptType, userAccount: account });
  };

  let height: string;
  switch (index % 4) {
    case 0:
      height = 'h-[400px]';
      break;
    case 1:
      height = 'h-[250px]';
      break;
    case 2:
      height = 'h-[420px]';
      break;
    case 3:
      height = 'h-[390px]';
      break;
    default:
      height = 'h-[600px]';
  }

  const truncatedPrompt = truncatePrompt(prompt);

  return (
    <>
      <div
        className={`relative ${height} bg-cover bg-center m-1 rounded-lg group overflow-hidden cursor-pointer`}
        style={{
          backgroundImage: `url(${imageUrl})`,
        }}
        onClick={handleOpenModal}
      >
        <div className="overlay absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="absolute bottom-2 left-2 rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-gray-300 text-sm">{truncatedPrompt}</span>
        </div>

        <div
          className="like-button absolute top-2 right-2 rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer pointer-events-auto"
          onClick={handleLikeClick}
        >
          {isLiked ? (
            <FaHeart
              className={`w-8 h-8 text-red-500 ${
                likeMutation.isLoading ? 'opacity-50' : ''
              }`}
            />
          ) : (
            <HiOutlineHeart
              className={`w-8 h-8 text-white ${
                likeMutation.isLoading ? 'opacity-50' : ''
              }`}
            />
          )}
          <span className="ml-1 text-white">{likesCount}</span>
        </div>
      </div>

      <PromptFreeDetails
        openMintModal={openModal}
        handleOnClose={() => setOpenModal(false)}
        image={imageUrl}
        name={name}
        prompt={prompt}
      />
    </>
  );
};

export default ImageCard;
