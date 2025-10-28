import { Request, Response } from "express";
import { sendResponse } from "#util/sendResponse.js";
import { psqlPool } from "#util/db.js";
import { extractNum } from "#util/extractNum.js";

export async function borrowBook(req: Request, res: Response) {
  //TODO: check privilege
  const bookId = extractNum(req.body?.bookId);
  const userId = extractNum(req.body?.userId);

  if (!bookId || !userId) {
    return sendResponse(res, false, 400, "Bad input");
  }

  const db = await psqlPool.connect();
  try {
    await db.query("BEGIN");

    const bookResult = await db.query(
      "SELECT availability FROM books WHERE book_id = $1",
      [bookId]
    );
    const isBookAvailable = bookResult.rows[0]?.availability;
    if (isBookAvailable == undefined) {
      return sendResponse(res, false, 400, "Bad input: book not found");
    }
    if (isBookAvailable === false) {
      return sendResponse(res, false, 400, "book is not available");
    }

    const userResult = await db.query(
      "SELECT name FROM users WHERE user_id = $1",
      [userId]
    );
    const isUserFound = userResult.rowCount;
    if (!isUserFound) {
      return sendResponse(res, false, 400, "Bad input: user not found");
    }

    const borrowResult = await db.query(
      "INSERT INTO borrow_records (user_id, book_id) VALUES ($1, $2) RETURNING borrow_id",
      [userId, bookId]
    );

    await db.query("UPDATE books SET availability = false WHERE book_id = $1", [
      bookId,
    ]);

    await db.query("COMMIT");
    sendResponse(res, true, { borrowId: borrowResult.rows[0].borrow_id });
  } catch (err) {
    await db.query("ROLLBACK");
    console.log(err);
  } finally {
    db.release();
  }
}
