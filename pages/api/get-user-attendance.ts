import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@vercel/postgres";

type EventRecord = {
  id_number: string;
  morningin: boolean;
  morningout: boolean;
  afternoonin: boolean;
  afternoonout: boolean;
};

type EventData = {
  tableName: string;
  eventDate: string;
  data: EventRecord[];
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = createClient();

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await client.connect();

    const userId = req.query.id_number as string;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const metadataQuery = "SELECT eventName, eventDate FROM event_table_metadata;";
    const metadataResult = await client.query(metadataQuery);
    const eventTables = metadataResult.rows;

    const results: EventData[] = [];

    for (const event of eventTables) {
      const { eventname: tableName, eventdate: eventDate } = event;

      const eventQuery = `SELECT * FROM ${tableName} WHERE id_number = $1;`;
      const eventResult = await client.query(eventQuery, [userId]);

      results.push({
        tableName,
        eventDate,
        data: eventResult.rows.length > 0 ? eventResult.rows : [],
      });
    }

    return res.status(200).json({ data: results });
  } catch (error) {
    console.error("Error fetching user attendance:", error);
    return res.status(500).json({ error: "Internal server error" });
  } finally {
    await client.end();
  }
}
