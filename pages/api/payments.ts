import { createClient } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = createClient();

  try {
    await client.connect(); // Open the connection first

    // Handle GET request to fetch data
    if (req.method === "GET") {
      const result = await client.sql`
        SELECT 
            students.student_id, 
            students.id_number, 
            students.f_name,
            students.l_name,
            payments.recpt_number,
            payments.recpt_date,
            payments.status
        FROM 
            students
        LEFT JOIN
            payments
        ON 
            students.id_number = payments.id_number;
      `;
      return res.status(200).json({ data: result.rows }); // Send response after successful query
    }

    // Handle POST request to create or update payment record
    else if (req.method === "POST") {
      const { id_number, status, recpt_date } = req.body;

      if (!id_number || !status) {
        return res.status(400).json({ error: "Missing required fields" });
      }

        const insertQuery = `
          INSERT INTO payments (id_number, status, recpt_date)
          VALUES ($1, $2, $3)
          RETURNING *;
        `;
        
        const { rows: insertedPayment } = await client.query(insertQuery, [
          id_number,
          status,
          recpt_date
        ]);

        return res.status(201).json({
          message: "Payment record created successfully",
          payment: insertedPayment[0],
        });
    }

    else if (req.method === "DELETE") {
      const { id_number } = req.body;

      if (!id_number) {
        return res.status(400).json({ error: "Missing required id_number" });
      }

      const selectQuery = `
        SELECT * FROM payments WHERE id_number = $1;
      `;
      const { rows: existingPayments } = await client.query(selectQuery, [id_number]);

      if (existingPayments.length === 0) {
        return res.status(404).json({ error: "Payment record not found" });
      }

      // Delete the payment record
      const deleteQuery = `
        DELETE FROM payments WHERE id_number = $1 RETURNING *;
      `;
      const { rows: deletedPayment } = await client.query(deleteQuery, [id_number]);

      return res.status(200).json({
        message: "Payment record deleted successfully",
        payment: deletedPayment[0],
      });
    }

    // Handle unsupported methods (anything other than GET, POST, DELETE)
    return res.status(405).json({ error: "Method Not Allowed" });

  } catch (error) {
    // Catch any errors during the database interaction and send a response
    console.error("ERROR:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    // Always ensure the database client is closed after the request
    await client.end();
  }
}
