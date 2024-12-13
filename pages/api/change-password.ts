import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@vercel/postgres";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id_number, currentPassword, newPassword } = req.body;
  const client = createClient();

  if (!id_number || !currentPassword || !newPassword) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await client.connect();

    const userQuery = await client.query("SELECT password FROM students WHERE id_number = $1", [id_number]);

    if (userQuery.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    await client.query("UPDATE students SET password = $1 WHERE id_number = $2", [newPassword, id_number]);

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error handling password change:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await client.end();
  }
}
