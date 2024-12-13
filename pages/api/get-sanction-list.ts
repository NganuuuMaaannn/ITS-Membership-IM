import { createClient } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = createClient();
  await client.connect();

  try {
    const { rows } = await client.sql`
      SELECT 
        students.student_id, 
        students.id_number, 
        students.f_name,
        students.l_name,
        sanction_list.total_absences
      FROM 
        students
      INNER JOIN 
        sanction_list
      ON 
        students.id_number = sanction_list.id_number
      WHERE
        students.role = 'student';
    `;

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data from database' });
  } finally {
    await client.end();
  }
}
