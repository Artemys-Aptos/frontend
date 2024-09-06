import React, { useState, useEffect } from 'react';
import CompletedChallengesCard from '../cards/CompletedChallengesCard';
import ChallengesCardSkeleton from '../skeleton/ChallengesCardSkeleton';
import getChallengeImage from '@/utils/challengeImageGenerator';

const challengeImage = getChallengeImage();

const CompletedChallenges = () => {
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="flex justify-center items-center">
      <div className="text-white w-full grid grid-cols-3 md:grid-cols-3 gap-[60px] mx-[20px]">
        {/* {isLoading ? (
          <>
            <ChallengesCardSkeleton />
            <ChallengesCardSkeleton />
            <ChallengesCardSkeleton />
          </>
        ) : (
          completedChallenges
            .filter(
              (challenge) =>
                !['0', '1', '2', '3', '4', '5'].includes(challenge.id)
            )
            .map((challenge) => (
              <CompletedChallengesCard
                key={challenge.id}
                id={challenge.id}
                ipfsUrl={challenge.ipfsUrl}
                duration={challenge.duration}
                startTime={challenge.startTime}
                isActive={challenge.isActive}
                winner={challenge.winner}
                numberOfSubmissions={challenge.numberOfSubmissions}
                challengeImage={challengeImage}
              />
            ))
        )} */}
      </div>
    </div>
  );
};

export default CompletedChallenges;
