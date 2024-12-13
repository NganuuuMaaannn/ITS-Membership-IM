import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@vercel/postgres";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { id_number } = req.body;

    if (!id_number) {
      return res.status(400).json({ error: "ID number is required" });
    }

    const client = createClient();
    await client.connect();

    try {
      await client.query(
        "DELETE FROM sanction_list WHERE id_number = $1",
        [id_number]
      );
      
     res.status(200).json({ message: "Sanction deleted successfully" });
    } catch (error) {
      console.error("Error deleting sanction:", error);
      res.status(500).json({ error: "Internal server error" });
    } finally {
      await client.end();
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
