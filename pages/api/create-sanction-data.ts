import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@vercel/postgres";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
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

    console.log(req.body)
    await client.connect();

    const query = `
      INSERT INTO sanction_level (offense_number, donation, donation_count, min_absences, max_absences)
      VALUES ($1, $2, $3, $4, $5)
    `;
    const values = [offense_number, donation, donation_count, min_absences, max_absences];

    const result = await client.query(query, values);
    if (result.rowCount === 0) {
      return res.status(500).json({ error: "Failed to add new sanction" });
    }

    res.status(201).json({ message: "Sanction added successfully" });
  } catch (error) {
    console.error("Error adding sanction data:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await client.end();
  }
}
