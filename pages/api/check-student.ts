import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@vercel/postgres';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const client = createClient();
    await client.connect();
    
    if (req.method == "POST"){
        try {
            const { studentID } = req.body;

            if (!studentID) {
                return res.status(400).json({ error: 'Missing student ID' });
            }

            const result = await client.query('SELECT id_number, role FROM students WHERE id_number = $1', [studentID]);

            if (result.rows.length === 0) {
                return res.status(404).json({ studentExists: false });
            }

            const student = result.rows[0];

            return res.status(200).json({ studentExists: true, role: student.role });
        } catch (error) {
            console.error("Error checking student:", error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    } else if (req.method == "GET") {
        try {
            const { studentID } = req.query;
    
            if (!studentID) {
                return res.status(400).json({ error: 'Missing student ID' });
            }
    
            const result = await client.query('SELECT id_number FROM sanction_list WHERE id_number = $1', [studentID]);
    
            if (result.rows.length === 0) {
                return res.status(404).json({ studentExists: false });
            }
    
            return res.status(200).json({ studentExists: true });
        } catch (error) {
            console.error("Error checking student:", error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    
}
