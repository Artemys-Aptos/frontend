import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
}

const tabs: Tab[] = [
  { id: 'your-generations', label: 'Your Generations' },
  { id: 'follower-feed', label: 'Follower Feed' },
  { id: 'liked-feed', label: 'Liked Feed' },
];

const SocialHeader: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('your-generations');

  return (
    <div className="py-4">
      <h1 className="text-white text-lg mb-4 ml-60">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 font-bold">
          Personal
        </span>
        {' Feed'}
      </h1>
      <div className="flex gap-4 ml-60 w-full">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-indigo-500 via-pink-500 to-pink-500 shadow text-white font-bold'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {/* {tab.id === 'collections' && (
              <span className="ml-1 px-1.5 py-0.5 text-xs font-semibold text-white bg-purple-500 rounded-full">
                Beta
              </span>
            )} */}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SocialHeader;
