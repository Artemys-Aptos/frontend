import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import useIpfsData from '@/utils/useIpfsData';
import { useImages } from '@/context/ImageContext';

const ActiveChallengesCard = ({
  id,
  ipfsUrl,
  duration,
  startTime,
  isActive,
  prize,
  numberOfSubmissions,
}) => {
  const [timeLeft, setTimeLeft] = useState('');
  const ipfsData = useIpfsData(ipfsUrl);
  const { SetSubmissionHeaderIpfsUri } = useImages();

  useEffect(() => {
    SetSubmissionHeaderIpfsUri(ipfsUrl);
    const calculateTimeLeft = () => {
      const startDate = new Date(startTime);
      const now = new Date();
      const durationInSeconds = parseInt(duration.split(' ')[0]);
      const endDate = new Date(startDate.getTime() + durationInSeconds * 1000);

      console.log('Start time:', startDate);
      console.log('Current time:', now);
      console.log('End time:', endDate);

      if (now >= endDate) {
        console.log('Challenge has ended');
        return 'Challenge Ended';
      }

      const difference = endDate - now;
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      console.log('Time left:', `${days}d ${hours}h ${minutes}m ${seconds}s`);
      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, duration]);

  const getImageUrl = (ipfsImageUrl) => {
    if (ipfsImageUrl && ipfsImageUrl.trim() !== '') {
      return ipfsImageUrl.replace(
        'ipfs://',
        'https://gateway.pinata.cloud/ipfs/'
      );
    }
    return '/placeholder.jpg';
  };

  return (
    <div className="w-[328px] h-[444px] cursor-pointer text-gray-300">
      <div className="shadow p-5 rounded-lg border-t-4 border-b-4 border-r-[1px] border-l-[1px] border-purple-900 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 rex">
        <img
          src={getImageUrl(ipfsData.image)}
          alt={ipfsData.name || 'Challenge'}
          className="w-[450px] h-[200px] object-cover rex"
        />

        <span className="absolute text-sm top-0 right-0 font-bold border border-purple-700 p-2 rounded-[7px] bg-black">
          Prize: <span className="text-gray-300">{prize} APT </span>
        </span>

        <p className="mt-4 text-2xl text-secondary-white text-center font-medium bg-transparent">
          {ipfsData.name}
        </p>
        <p className="mt-4 font-bold text-sm text-secondary-white text-center border-purple-400 border-2 mx-2 p-1 rounded-xl">
          {timeLeft} left to submit
        </p>

        <div>
          <p className="mt-4 font-bold text-secondary-white text-center">
            {numberOfSubmissions} submissions
          </p>
        </div>

        <Link href="/submissions/[id]" as={`/submissions/${id}`}>
          <div className="mt-4 px-[50px]">
            <button className="border-gray-400 border-2 hover:opacity-80 px-3 py-2 rounded-lg w-full text-white">
              View Submissions
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ActiveChallengesCard;
