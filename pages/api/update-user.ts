import { createClient } from "@vercel/postgres";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "PUT") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const client = createClient();
    await client.connect();

    const { student_id, f_name, l_name, email, gender, role, password } = req.body;

    try {
        const result = await client.sql`
            UPDATE students 
            SET f_name = ${f_name}, l_name = ${l_name}, email = ${email}, gender = ${gender}, role = ${role}, password = ${password} 
            WHERE student_id = ${student_id}
        `;

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // Optionally fetch and return the updated list of users
        const updatedUsers = await client.sql`SELECT * FROM students;`;

        res.status(200).json({ message: "User updated successfully", users: updatedUsers.rows });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Error updating user." });
    } finally {
        client.end();
    }
}


