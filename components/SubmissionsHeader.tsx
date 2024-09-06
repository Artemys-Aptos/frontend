import React, { useState, useEffect } from 'react';
import { BsSearch } from 'react-icons/bs';
import SearchSubmission from './SearchSubmission';
import MakeSubmissionModal from './modals/MakeSubmissionModal';
import { calculateTimeLeft } from '@/utils/countdownTimer';
import { useImages } from '@/context/ImageContext';
import { ethers } from 'ethers';
import useIpfsData from '@/utils/useIpfsData';

interface SubmissionsHeaderProps {
  tokenId: string | number;
}

interface Challenge {
  id: string;
  ipfsUrl: string;
  duration: number;
  startTime: number;
  isActive: boolean;
  winner: string;
  numberOfSubmissions: number;
}

const SubmissionsHeader: React.FC<SubmissionsHeaderProps> = ({ tokenId }) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  console.log('Token ID:', tokenId);

  const ipfsData = useIpfsData(activeChallenges[0]?.ipfsUrl);

  console.log('IPFS data:', ipfsData);
  console.log('Active challenges:', activeChallenges[0]);

  //   console.log('Active challenges:', activeChallenges[0].ipfsUrl);

  return (
    <>
      <div className="submission-header-bg text-white text-start mb-6 py-10 h-[240px] ml-[250px] ">
        <h1 className="text-3xl py-1 pt-2 font-bold bg-transparent ml-10 ">
          Make a submission to {ipfsData?.name}
        </h1>
        <p className="pb-6 pt-4 italic bg-transparent text-start text-xl w-[60%] ml-10 ">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 font-bold pr-1">
            Challenge Description:
          </span>
          {ipfsData?.description}
          <br />
          <br />
          <span className="text-lg mt-6 font-bold">
            Time Left: 00d:01h:22m:56s
          </span>
        </p>
      </div>

      <div className="ml-[220px] mb-6 flex items-center text-white mr-[40px]">
        <SearchSubmission />
        <div>
          <button
            className="text-white  bg-gradient-to-r from-purple-700 via-purple-500 to-pink-500 mt-3 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-purple-300  rounded-lg text-sm font-bold w-[140px] sm:w-[250px] px-8 py-5 text-center dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-800"
            onClick={handleOpenModal}
          >
            Submit to Challenge
          </button>
        </div>
      </div>

      <MakeSubmissionModal
        openModal={openModal}
        handleOnClose={() => setOpenModal(false)}
      />
    </>
  );
};

export default SubmissionsHeader;
