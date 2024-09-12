import React from 'react';
import { FaRegUser } from 'react-icons/fa';

export interface LeaderboardUser {
  id: number;
  username: string;
  totalGame: number;
  volume: number;
  games24h: number;
  avatarUrl: string;
}

export interface LeaderboardProps {
  users24h: LeaderboardUser[];
  usersAllTime: LeaderboardUser[];
}

const UserRow: React.FC<{ user: LeaderboardUser; index: number }> = ({
  user,
  index,
}) => (
  <div className="flex items-center py-2 border-b border-gray-700 text-[14px]">
    <span className="w-8 text-gray-400">{index + 1}.</span>
    <div className="flex items-center flex-1">
      <img
        src={user.avatarUrl}
        alt={user.username}
        className="w-8 h-8 rounded-full mr-2"
      />
      <span className="text-white">{user.username}</span>
    </div>
    <span className="w-20 text-right text-gray-400">{user.totalGame}</span>
    <span className="w-32 text-right text-blue-400">🔥</span>
    {/* <span className="w-20 text-right text-gray-400">{user.games24h}</span> */}
  </div>
);

const LeaderboardSection: React.FC<{
  title: string;
  users: LeaderboardUser[];
}> = ({ title, users }) => (
  <div className="border border-slate-700 rounded-lg p-4 flex-1">
    <h2 className="text-lg font-bold text-white mb-4">{title}</h2>
    <div className="space-y-2">
      {users.map((user, index) => (
        <UserRow key={user.id} user={user} index={index} />
      ))}
    </div>
  </div>
);

const LeaderboardHome: React.FC<LeaderboardProps> = ({
  users24h,
  usersAllTime,
}) => (
  <div className=" p-3 rounded-xl min-w-[1000px] ml-[200px] mt-[4px]">
    <h1 className="text-2xl font-bold text-white mb-3"> Leaderboard</h1>
    <div className="flex space-x-6">
      <LeaderboardSection title="TOP USERS BY 24H VOLUME" users={users24h} />
      <LeaderboardSection title="TOP USERS BY STREAKS" users={usersAllTime} />
    </div>
  </div>
);

export default LeaderboardHome;
