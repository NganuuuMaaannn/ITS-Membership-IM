import { createClient } from "@vercel/postgres";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const client = createClient();
    await client.connect();

    try {
        const result = await client.sql`SELECT 
        student_id,
        id_number, 
        f_name,
        l_name,
        gender,
        email,
        password,
        role FROM students`;
        res.status(200).json({ users: result.rows });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Error fetching users." });
    } finally {
        client.end();
    }
}
