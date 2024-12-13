import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@vercel/postgres";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id_number, currentPassword } = req.body;
  const client = createClient();

  if (!id_number || !currentPassword) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await client.connect();

    const userQuery = await client.query("SELECT password FROM students WHERE id_number = $1", [id_number]);

    if (userQuery.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const storedPassword = userQuery.rows[0].password;

    // Replace this with your password comparison logic (e.g., hash comparison)
    const passwordMatch = storedPassword === currentPassword;

    return res.status(200).json({ match: passwordMatch });
  } catch (error) {
    console.error("Error verifying password:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await client.end();
  }
}
