import React, { useState } from 'react';
import PromptFreeDetails from '../modals/PromptFreeDetails';
import { FaHeart } from 'react-icons/fa6';
import { HiOutlineHeart } from 'react-icons/hi';

const truncatePrompt = (prompt, maxLength = 200) => {
  if (prompt && prompt.length > maxLength) {
    return prompt.substring(0, maxLength) + '...';
  }
  return prompt;
};

const ImageCard = ({ index, imageUrl, name, prompt }) => {
  const [openModal, setOpenModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  let height;
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
            <FaHeart className="w-5 h-5 text-red-500" />
          ) : (
            <HiOutlineHeart className="w-5 h-5 text-white" />
          )}
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
