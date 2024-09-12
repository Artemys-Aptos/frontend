import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.post(
        `${baseUrl}/prompts/add-public-prompts/`,
        req.body
      );

      res.status(200).json(response.data);
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Error adding public prompt', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
