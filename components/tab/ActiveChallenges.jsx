import React, { useState, useEffect } from 'react';
import ActiveChallengesCard from '../cards/ActiveChallengesCard';
import ChallengesCardSkeleton from '../skeleton/ChallengesCardSkeleton';
import getChallengeImage from '@/utils/challengeImageGenerator';

const challengeImage = getChallengeImage();

const ActiveChallenges = () => {
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="flex justify-center items-center">
      <div className="text-white w-full grid grid-cols-3 md:grid-cols-3 gap-[60px] mx-[20px]">
        {/* {isLoading ? (
          <React.Fragment>
            <ChallengesCardSkeleton />
            <ChallengesCardSkeleton />
            <ChallengesCardSkeleton />
          </React.Fragment>
        ) : (
          activeChallenges.map((challenge) => (
            <ActiveChallengesCard
              key={challenge.id}
              id={challenge.id}
              ipfsUrl={challenge.ipfsUrl}
              duration={challenge.duration}
              startTime={challenge.startTime}
              isActive={challenge.isActive}
              numberOfSubmissions={challenge.numberOfSubmissions}
              challengeImage={challengeImage}
            />
          ))
        )} */}
      </div>
    </div>
  );
};

export default ActiveChallenges;
