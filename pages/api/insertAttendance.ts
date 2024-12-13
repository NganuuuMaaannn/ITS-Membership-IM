import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@vercel/postgres';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { eventName, studentID, attendanceType, timestamp } = req.body;

  // Validate input fields
  if (!eventName || !studentID || !attendanceType || !timestamp) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const client = createClient();

  try {
    await client.connect();

    const checkAttendanceQuery = `
      SELECT ${attendanceType} 
      FROM ${eventName} 
      WHERE id_number = $1;`;
    
    const checkValues = [studentID];
    const checkResult = await client.query(checkAttendanceQuery, checkValues);

    if (checkResult.rowCount != 0 && checkResult.rows[0][attendanceType] !== null) {
      return res.status(409).json({ success: false, message: `Attendance already recorded for ${attendanceType} for this student.` });
    }

    const upsertQuery = `
      INSERT INTO ${eventName} (id_number, ${attendanceType})
      VALUES ($1, $2)
      ON CONFLICT (id_number)
      DO UPDATE SET ${attendanceType} = EXCLUDED.${attendanceType}
      WHERE ${eventName}.${attendanceType} IS NULL;`;

    const values = [studentID, timestamp];
    const result = await client.query(upsertQuery, values);

    if (result.rowCount === 0) {
      return res.status(409).json({ success: false, message: 'Attendance already recorded for this type.' });
    }

    return res.status(201).json({ success: true });
  } catch (error) {
    console.error("Error inserting/updating attendance:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.end();
  }
}
