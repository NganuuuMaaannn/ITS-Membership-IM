import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@vercel/postgres";

interface Updates {
  id_number: string;
  total_absences: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = createClient();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await client.connect();

    const studentResult = await client.query("SELECT id_number FROM students;");
    const students = studentResult.rows.map((row) => row.id_number);

    const metadataResult = await client.query("SELECT eventname FROM event_table_metadata;");
    const eventTables = metadataResult.rows.map((row) => row.eventname);

    const updates: Updates[] = [];

    for (const studentId of students) {
      let totalAbsences = 0;

      for (const table of eventTables) {
        const eventQuery = `
          SELECT morningin, morningout, afternoonin, afternoonout 
          FROM ${table} 
          WHERE id_number = $1;
        `;
        const eventResult = await client.query(eventQuery, [studentId]);

        if (eventResult.rows.length === 0) {
          totalAbsences += 4;
        } else {
          eventResult.rows.forEach((row) => {
            totalAbsences +=
              (!row.morningin ? 1 : 0) +
              (!row.morningout ? 1 : 0) +
              (!row.afternoonin ? 1 : 0) +
              (!row.afternoonout ? 1 : 0);
          });
        }
      }

      updates.push({ id_number: studentId, total_absences: totalAbsences });
    }

    for (const { id_number, total_absences } of updates) {
      if (total_absences > 0) {
        await client.query(
          `
            INSERT INTO sanction_list (id_number, total_absences)
            VALUES ($1, $2)
            ON CONFLICT (id_number)
            DO UPDATE SET total_absences = EXCLUDED.total_absences;
          `,
          [id_number, total_absences]
        );
      } else {
        await client.query(
          `
            DELETE FROM sanction_list
            WHERE id_number = $1;
          `,
          [id_number]
        );
      }
    }

    res.status(200).json({ message: "Sanction list updated successfully." });
  } catch (error) {
    console.error("Error updating sanction list:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    await client.end();
  }
}
