import React, { useState, useEffect } from 'react';
import ActiveChallengesCard from '../cards/ActiveChallengesCard';
import ChallengesCardSkeleton from '../skeleton/ChallengesCardSkeleton';
import getChallengeImage from '@/utils/challengeImageGenerator';

const challengeImage = getChallengeImage();

const ActiveChallenges = () => {
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActiveChallenges = async () => {
      try {
        const response = await fetch('/api/challenges/completed');
        if (!response.ok) {
          throw new Error('Failed to fetch active challenges');
        }
        const data = await response.json();
        console.log('Active Challenges:', data);
        setActiveChallenges(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching active challenges:', error);
        setIsLoading(false);
      }
    };

    fetchActiveChallenges();
  }, []);

  return (
    <div className="flex justify-center items-center">
      <div className="text-white w-full grid grid-cols-3 md:grid-cols-3 gap-[60px] mx-[20px]">
        {isLoading ? (
          <React.Fragment>
            <ChallengesCardSkeleton />
            <ChallengesCardSkeleton />
            <ChallengesCardSkeleton />
          </React.Fragment>
        ) : (
          activeChallenges.map((challenge) => (
            <ActiveChallengesCard
              key={challenge.challenge_id}
              id={challenge.challenge_id}
              ipfsUrl={challenge.ipfs_uri}
              duration={challenge.duration}
              startTime={challenge.start_time}
              isActive={true}
              numberOfSubmissions={challenge.numberOfSubmissions}
              challengeImage={challengeImage}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ActiveChallenges;
