import React from 'react';
import Head from 'next/head';
import Sidebar from '@/components/Sidebar';
import ProfileNavbar from '@/components/ProfileNavbar';
import LeaderboardHome from '@/components/leaderboard/LeaderboardHome';
import { users24h, usersAllTime } from '@/utils/dummyLeaderboard';

const Leaderboard = () => {
  return (
    <>
      <div className="bg-black h-full">
        <Head>
          <title>Leaderboard | Artemys AI</title>
          <meta name="description" content="Home page" />
        </Head>
        <div className="flex ">
          <Sidebar />
          <ProfileNavbar />
        </div>

        <div className='px-10'>
          <LeaderboardHome users24h={users24h} usersAllTime={usersAllTime} />
        </div>
      </div>
    </>
  );
};

export default Leaderboard;
