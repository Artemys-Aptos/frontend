// @ts-nocheck
import { useState, useEffect } from 'react';
import { calculateTimeLeft } from '@/utils/countdownTimer';
import useIpfsData from '@/utils/useIpfsData';
import Link from 'next/link';
import getChallengeImage from '@/utils/challengeImageGenerator';
import { formatAddress } from '@/utils/formatAddress';

const address = '0x123';

const CompletedChallengesCard = ({
  id,
  ipfsUrl,
  duration,
  startTime,
  isActive,
  winner,
  // prize,
  numberOfSubmissions,
  challengeImage,
}) => {
  const [timeLeft, setTimeLeft] = useState('');
  const ipfsData = useIpfsData(ipfsUrl);

  console.log('ID', id);

  const winnerAddress = formatAddress(winner);

  useEffect(() => {
    const updateTimer = () => {
      const time = calculateTimeLeft(startTime, duration);
      if (time) {
        const timeString = `${time.days}d ${time.hours}h ${time.minutes}m ${time.seconds}s`;
        setTimeLeft(timeString);
      } else {
        setTimeLeft('Challenge Ended');
      }
    };

    const timerId = setInterval(updateTimer, 1000);

    return () => clearInterval(timerId);
  }, [startTime, duration]);

  const getImageUrl = (ipfsImageUrl) => {
    if (ipfsImageUrl && ipfsImageUrl.trim() !== '') {
      return ipfsImageUrl.replace('ipfs://', 'https://nftstorage.link/ipfs/');
    }

    return '/placeholder.jpg';
  };

  return (
    <div className=" w-[328px] cursor-pointer text-gray-300">
      <div className=" shadow p-5 rounded-lg border-t-4 border-b-4 border-r-[1px] border-l-[1px] border-purple-900   bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 rex">
        <img
          // src={challengeImage}
          src={getImageUrl(ipfsData.image)}
          alt={ipfsData.name || 'Challenge'}
          className="w-[450px] h-[200px] object-cover rex"
        />

        <p className="mt-4 text-2xl text-secondary-white text-center font-medium bg-transparent">
          {ipfsData.name}
        </p>
        <p className="mt-4 font-bold text-secondary-white text-center text-sm border-purple-400 border-2 mx-2 p-1 rounded-xl">
          Challenge Ended
        </p>
        {/* <div className="mt-4 bg-black/70 border border-gray-500 rounded-xl p-2 absolute top-0 right-4">
          Prize: &nbsp;{' '}
          <span className="text-secondary-white font-bold">{prize} AVAX</span>
        </div> */}

        <div>
          <p className="mt-4 font-bold text-secondary-white text-center ">
            {numberOfSubmissions} submissions
          </p>
        </div>

        <div className="mt-4 px-[50px]">
          <button className="border-gray-400 border-2 hover:opacity-80 px-3 py-2 rounded-lg w-full text-white cursor-default">
            Winner: {winnerAddress ? winnerAddress : 'No submissions'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletedChallengesCard;
