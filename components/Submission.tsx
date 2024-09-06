// @ts-nocheck
import React, { useEffect, useState } from 'react';
import SubmissionsHeader from './SubmissionsHeader';
import SubmissionCard from './cards/SubmissionCard';
import { useRouter } from 'next/router';
import SubmissionCardSkeleton from './skeleton/SubmissionCardSkeleton';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

declare global {
  interface Window {
    ethereum: any;
  }
}

interface Submission {
  ipfsHash: string;
  submitter: string;
  voteCount: string;
}

const Submission = () => {
  const router = useRouter();
  const { id } = router.query;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [returnedSubmissions, setReturnedSubmissions] = useState<Submission[]>(
    []
  );
  const [txHash, setTxHash] = useState<string>('');

  useEffect(() => {
    if (id) {
      fetchSubmissions();
    }
  }, [id]);

  return (
    <div className="w-full pb-20 h-[150vh]">
      {typeof id === 'string' && <SubmissionsHeader tokenId={id} />}
      <div className="ml-[250px]">
        {isLoading && (
          <React.Fragment>
            <SubmissionCardSkeleton />
            <SubmissionCardSkeleton />
            <SubmissionCardSkeleton />
          </React.Fragment>
        )}
        {!isLoading &&
          returnedSubmissions.map((submission, index) => (
            <SubmissionCard
              key={index}
              ipfsHash={submission.ipfsHash}
              voteCount={submission.voteCount}
              onVote={() => voteForSubmission(index)}
              submitter={submission.submitter}
            />
          ))}
      </div>
    </div>
  );
};

export default Submission;
