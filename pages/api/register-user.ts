import { createClient } from "@vercel/postgres";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { f_name, l_name, gender, id_number, email, password } = req.body;

    if (!f_name || !l_name || !gender || !id_number || !email || !password ) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const client = createClient();
    await client.connect();

    try {
        await client.sql`
            INSERT INTO students (f_name, l_name, gender, id_number, email, password) 
            VALUES (${f_name}, ${l_name}, ${gender}, ${id_number}, ${email}, ${password})
        `;
        res.status(201).json({ message: "User added successfully" });
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ message: "Error adding user." });
    } finally {
        client.end();
    }
}
