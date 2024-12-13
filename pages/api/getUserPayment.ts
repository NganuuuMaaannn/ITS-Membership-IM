import { createClient } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';

// Define the handler for the GET request
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = createClient();
  await client.connect();

  if (req.method === "GET") {
    // Get id_number from query parameters
    const { id_number } = req.query;

    try {
      const result = await client.query(`
        SELECT * FROM payments WHERE id_number = $1
      `, [id_number])

      const user = result.rows[0]
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json({user});
    } catch (error) {
      console.error("Error fetching payment data:", error);
      res.status(500).json({ error: 'Failed to fetch payment data from the database' });
    } finally {
      await client.end(); // Ensure the connection is closed
    }
  } else {
    // If the request method is not GET, return a 405 Method Not Allowed response
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
