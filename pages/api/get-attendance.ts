import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@vercel/postgres';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { eventName } = req.body;

  if (!eventName) {
    return res.status(400).json({ error: 'Missing event name' });
  }

  const client = createClient();

  try {
    await client.connect();

    const joinQuery = `
      SELECT 
        s.id_number, 
        s.f_name, 
        s.l_name, 
        s.gender,
        e.morningIn, 
        e.morningOut, 
        e.afternoonIn, 
        e.afternoonOut
      FROM students s
      JOIN ${eventName} e ON s.id_number = e.id_number;
    `;

    const result = await client.query(joinQuery);
    const data = result.rows;

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching attendance data:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.end();
  }
}