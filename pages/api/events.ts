import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@vercel/postgres";

const isValidTableName = (name: string): boolean => {
  return /^[a-zA-Z0-9_]+$/.test(name);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = createClient();
  await client.connect();
  
  if (req.method == "GET") { //para makuha ang mga events
    try {
      const result = await client.sql`
        SELECT eventName AS title, eventDate AS date
        FROM event_table_metadata;
      `;
  
      const events = result.rows;
      res.status(200).json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Internal server error" });
    } finally {
      await client.end();
    }
  } else if (req.method == "POST"){ //para mag create ug events
    const { eventName, eventDate } = req.body;

    if (!isValidTableName(eventName)) {
        return res.status(400).json({ message: "Invalid table name. Use '_' instead of spaces."});
    }
    
    try {

      await client.query(
        `SELECT create_event($1, $2);`,
        [eventName, eventDate]
      );
          {/*
            CREATE OR REPLACE FUNCTION create_event(event_name TEXT, event_date DATE)
            RETURNS TEXT AS
            $$
            DECLARE
                create_table_query TEXT;
                lower_event_name TEXT;
            BEGIN
                -- Convert the table name to lowercase for table creation
                lower_event_name := lower(event_name);

                -- Validate the table name
                IF lower_event_name ~ '[^a-z0-9_]' THEN
                    RAISE EXCEPTION 'Invalid table name. Use only lowercase alphanumeric characters and underscores.';
                END IF;

                -- Dynamically construct the CREATE TABLE query
                create_table_query := 'CREATE TABLE ' || quote_ident(lower_event_name) || ' (
                    id_number INT UNIQUE REFERENCES students(id_number) ON DELETE CASCADE,
                    morningIn VARCHAR(20),
                    morningOut VARCHAR(20),
                    afternoonIn VARCHAR(20),
                    afternoonOut VARCHAR(20)
                );';

                -- Execute the CREATE TABLE query
                EXECUTE create_table_query;

                -- Insert metadata into event_table_metadata using the original event_name
                INSERT INTO event_table_metadata (eventName, eventDate)
                VALUES (event_name, event_date);

                -- Return success message
                RETURN 'Table ' || lower_event_name || ' created successfully, and metadata stored with original event name.';
            EXCEPTION
                WHEN others THEN
                    -- Catch errors and return them as text
                    RAISE EXCEPTION 'Error creating table or inserting metadata: %', SQLERRM;
            END;
            $$ LANGUAGE plpgsql;
        */}

        return res.status(201).json({ message: `Table ${eventName} created successfully.` });
    } catch (error) {
        console.error("Error creating table:", error);
        return res.status(500).json({ message: "Internal server error." });
    } finally {
        await client.end();
    }
  } else if (req.method == "PUT"){ //para mag update ug events
    const { eventName, newName, newEventDate } = req.body;

  if (!isValidTableName(eventName)) {
    return res.status(400).json({ message: "Invalid table name. Use '_' instead of spaces."});
  }

  if (!eventName || !newName || !newEventDate) {
    return res.status(400).json({
      message: 'Missing eventName, newName, or newEventDate',
      success: false,
    });
  }

    try {

      await client.query('BEGIN');

      const updateQuery = `
        UPDATE event_table_metadata
        SET eventName = $1, eventDate = $2
        WHERE eventName = $3
        RETURNING *;
      `;
      const updateResult = await client.query(updateQuery, [newName, newEventDate, eventName]);

      if (updateResult.rowCount === 0) {
        throw new Error(`Event with name '${eventName}' not found`);
      }

      const alterTableQuery = `
        ALTER TABLE ${eventName} RENAME TO ${newName};
      `;
      await client.query(alterTableQuery);

      await client.query('COMMIT');

      console.log(
          res.status(200).json({
        message: `Event '${eventName}' updated to '${newName}' with new eventDate and corresponding table renamed.`,
        success: true,
      })
      );
    } catch (error) {
      await client.query('ROLLBACK');

      console.log(
      res.status(500).json({
        message: `Error updating event: ${(error as Error).message}`,
        success: false,
      })
      );
    } finally {
      await client.end();
    }
  } else if(req.method == "DELETE"){ //para mag delete ug events
    const { eventName } = req.body;

    if (!eventName) {
      return res.status(400).json({ message: 'Event name is required' });
    }
    try {

      await client.query('SELECT drop_event_table($1);', [eventName]);

      {/*
        CREATE OR REPLACE FUNCTION drop_event_table(event_name text)
        RETURNS void AS
        $$
        BEGIN
            -- Drop the table if it exists
            EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(event_name);
            
            -- Delete the metadata from event_table_metadata
            DELETE FROM event_table_metadata WHERE eventname = event_name;
            
            -- Optionally, you can raise a notice for debugging purposes
            RAISE NOTICE 'Table % and its metadata have been deleted.', event_name;
        END;
        $$ LANGUAGE plpgsql;
    */}

      res.status(200).json({ message: `Table "${eventName}" dropped successfully.` });
    } catch (error) {
      console.error("Error dropping table:", error);
      res.status(500).json({ message: 'Failed to drop table: ' + error});
    } finally {
      await client.end();
    }
  }

}
