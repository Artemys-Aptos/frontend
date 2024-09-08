import { LeaderboardUser } from '@/components/leaderboard/LeaderboardHome';

const getDicebearUrl = (seed: string) =>
  `https://api.dicebear.com/6.x/bottts/svg?seed=${encodeURIComponent(seed)}`;

const generateBlockchainAddress = () => {
  const chars = '0123456789abcdef';
  return (
    '0x' +
    Array(64)
      .fill(0)
      .map(() => chars[Math.floor(Math.random() * chars.length)])
      .join('')
  );
};

const generateDomainAddress = () => {
  const names = [
    'stinger',
    'crypto',
    'blockchain',
    'defi',
    'nft',
    'web3',
    'token',
    'coin',
  ];
  return `${names[Math.floor(Math.random() * names.length)]}.apt`;
};

const generateUsername = (index: number): string => {
  if (index % 3 === 0) {
    return generateDomainAddress();
  } else {
    const address = generateBlockchainAddress();
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }
};

const generateUsers = (count: number): LeaderboardUser[] => {
  return Array.from({ length: count }, (_, i) => {
    const username = generateUsername(i);
    return {
      id: i + 1,
      username,
      totalGame: Math.floor(Math.random() * 2000) + 100,
      volume: parseFloat((Math.random() * 1000).toFixed(2)),
      games24h: Math.floor(Math.random() * 200),
      avatarUrl: getDicebearUrl(username),
    };
  });
};

const sortUsersByVolume = (users: LeaderboardUser[]): LeaderboardUser[] => {
  return users.sort((a, b) => b.volume - a.volume);
};

const rawUsers24h = [
  {
    id: 1,
    username: 'stinger.apt',
    totalGame: 1956,
    volume: 408.0,
    games24h: 73,
    avatarUrl: getDicebearUrl('stinger.apt'),
  },
  {
    id: 2,
    username: '0x2ca0...b37f',
    totalGame: 195,
    volume: 234.0,
    games24h: 195,
    avatarUrl: getDicebearUrl(
      '0x2ca06af25d467a75ee04a28ad0e49e5065e6722a1b833ffbd39a04646a36b37f'
    ),
  },
  ...generateUsers(11),
];

const rawUsersAllTime = [
  {
    id: 1,
    username: 'stinger.apt',
    totalGame: 1956,
    volume: 4400.0,
    games24h: 73,
    avatarUrl: getDicebearUrl('stinger.apt'),
  },
  {
    id: 2,
    username: '0x3ab1...c45e',
    totalGame: 1113,
    volume: 2200.0,
    games24h: 18,
    avatarUrl: getDicebearUrl(
      '0x3ab16af25d467a75ee04a28ad0e49e5065e6722a1b833ffbd39a04646a36c45e'
    ),
  },
  ...generateUsers(11),
];

export const users24h = sortUsersByVolume(rawUsers24h);
export const usersAllTime = sortUsersByVolume(rawUsersAllTime);
