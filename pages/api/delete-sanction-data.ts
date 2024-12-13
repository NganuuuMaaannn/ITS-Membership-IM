import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@vercel/postgres";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const client = createClient();
  await client.connect();

  try {
    const { offense_number } = req.body;

    if (!offense_number) {
      return res.status(400).json({ error: "Offense number is required" });
    }

    await client.query(`DELETE FROM sanction_level WHERE offense_number = $1`, [offense_number]);

    return res.status(200).json({ message: `Offense ${offense_number} deleted successfully!` });
  } catch (error) {
    console.error("Error deleting sanction:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    client.end();
  }
}
