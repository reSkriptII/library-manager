import { Request, Response } from "express";
import { sendResponse } from "#util/sendResponse.js";
import { psqlPool } from "#util/db.js";

export async function borrowBook(req: Request, res: Response) {
  //TODO: check privilege

  const { bookId, userId } = req.body;
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
    const isBookAvailable = bookResult.rows[0];
    if (isBookAvailable == undefined) {
      return sendResponse(res, false, 400, "Bad input: book not found");
    }
    if (isBookAvailable === false) {
      return sendResponse(res, false, 400, "book not available");
    }

    const userResult = await db.query(
      "SELECT name FROM user WHERE user_id = $1",
      [bookId]
    );
    const isUserFound = bookResult.rows[0];
    if (isUserFound.length == undefined) {
      return sendResponse(res, false, 400, "Bad input: user not found");
    }

    const borrowResult = await db.query(
      "INSERT INTO borrow_records (user_id, book_id) VALUES ($1, $2) RETURNING borrow_id",
      [userId, bookId]
    );

    await db.query("UPDATE books SET availability = false WHERE book_id = $1", [
      bookId,
    ]);
    console.log(borrowResult);

    await db.query("COMMIT");
    sendResponse(res, true, { borrowId: borrowResult.rows[0] });
  } catch (err) {
    await db.query("ROLLBACK");
    console.log(err);
  } finally {
    db.release();
  }
}
