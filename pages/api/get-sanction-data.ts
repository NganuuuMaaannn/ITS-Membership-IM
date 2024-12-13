import { createClient } from "@vercel/postgres";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const client = createClient();
    await client.connect();

    try {
        const result = await client.sql`SELECT 
        offense_number,
        donation,
        donation_count,
        min_absences,
        max_absences
        FROM sanction_level`;
        res.status(200).json({ data: result.rows });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Error fetching users." });
    } finally {
        client.end();
    }
}
