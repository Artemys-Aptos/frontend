import { NextApiRequest, NextApiResponse } from 'next';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CHALLENGES_MODULE_ADDRESS;

const config = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(config);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const [challengeEvents, submissionEvents] = await Promise.all([
      aptos.getModuleEventsByEventType({
        eventType: `${CONTRACT_ADDRESS}::challenge_contract::ChallengeCreatedEvent`,
      }),
      aptos.getModuleEventsByEventType({
        eventType: `${CONTRACT_ADDRESS}::challenge_contract::SubmissionAddedEvent`,
      }),
    ]);

    const currentTime = Math.floor(Date.now() / 1000);

    const finalizedEvents = challengeEvents.filter((event) => {
      const { start_time, duration } = event.data;
      const endTime = parseInt(start_time) + parseInt(duration);
      return currentTime >= endTime;
    });

    const formattedEvents = finalizedEvents.map((event) => {
      const submissionCount = submissionEvents.filter(
        (subEvent) => subEvent.data.challenge_id === event.data.challenge_id
      ).length;

      return {
        challenge_id: event.data.challenge_id,
        creator: event.data.creator,
        prize: event.data.prize,
        start_time: new Date(
          parseInt(event.data.start_time) * 1000
        ).toLocaleString(),
        end_time: new Date(
          (parseInt(event.data.start_time) + parseInt(event.data.duration)) *
            1000
        ).toLocaleString(),
        ipfs_uri: event.data.ipfs_uri,
        numberOfSubmissions: submissionCount,
      };
    });

    res.status(200).json(formattedEvents);
  } catch (error) {
    console.error('Error fetching finalized challenges:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
