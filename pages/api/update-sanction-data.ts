import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@vercel/postgres";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const client = createClient();

  try {
    const {
      offense_number,
      donation,
      donation_count,
      min_absences,
      max_absences,
    } = req.body;

    if (
      !offense_number ||
      !Array.isArray(donation) ||
      !Array.isArray(donation_count) ||
      typeof min_absences !== "number" ||
      typeof max_absences !== "number"
    ) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    await client.connect();

    const query = `
      UPDATE sanction_level
      SET donation = $1, donation_count = $2, min_absences = $3, max_absences = $4
      WHERE offense_number = $5
    `;
    const values = [donation, donation_count, min_absences, max_absences, offense_number];

    const result = await client.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Sanction not found" });
    }

    res.status(200).json({ message: "Sanction updated successfully" });
  } catch (error) {
    console.error("Error updating sanction data:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await client.end();
  }
}
