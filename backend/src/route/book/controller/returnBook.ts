import { psqlPool } from "#util/db.js";
import { extractNum } from "#util/extractNum.js";
import { sendResponse } from "#util/sendResponse.js";
import { Request, Response } from "express";

export async function returnBook(req: Request, res: Response) {
  const userId = extractNum(req.body.userId);
  const bookId = extractNum(req.body.bookId);

  if (!userId || !bookId) {
    return sendResponse(res, false, 400, "bad input");
  }

  const db = await psqlPool.connect();
  try {
    await db.query("BEGIN");

    const recordResult = await db.query(
      `SELECT borrow_id FROM borrow_records 
        WHERE book_id = $1 AND user_id = $2 AND returned = FALSE
        GROUP BY due_date, borrow_id
        LIMIT 1`,
      [bookId, userId]
    );
    const borrowId = recordResult.rows[0]?.borrow_id;
    if (borrowId == undefined) {
      sendResponse(res, false, 404, "Borrow data not found");
    }

    await db.query(
      `UPDATE borrow_records 
        SET returned = TRUE, return_time = NOW(), 
          late_return = ((due_date::TIMESTAMP - NOW() < '24 hours'::INTERVAL))
        WHERE borrow_id = $1`,
      [borrowId]
    );

    await db.query("COMMIT");
    return sendResponse(res, true);
  } catch (err) {
    db.query("ROLLBACK");
    console.log(err);
  } finally {
    db.release();
  }
}
