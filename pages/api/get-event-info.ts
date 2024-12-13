// /pages/api/get-event-info.ts
import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@vercel/postgres";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = createClient();

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await client.connect();

    // Fetch metadata of events (e.g., event names and event dates)
    const metadataQuery = "SELECT eventName, eventDate FROM event_table_metadata;";
    const metadataResult = await client.query(metadataQuery);

    // Get the event names from the query result
    const eventNames = metadataResult.rows.map((row) => ({
      eventName: row.eventname,
      eventDate: row.eventdate,
    }));

    res.status(200).json({ data: eventNames });
  } catch (error) {
    console.error("Error fetching event info:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await client.end();
  }
}
