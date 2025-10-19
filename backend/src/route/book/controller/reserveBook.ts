import { psqlPool } from "#util/db.js";
import { extractNum } from "#util/extractNum.js";
import { sendResponse } from "#util/sendResponse.js";
import { Request, Response } from "express";

export async function reserveBook(req: Request, res: Response) {
  const userId = req.user?.id;
  if (userId == undefined) {
    return sendResponse(res, false, 401, "unauthorized");
  }

  const bookId = extractNum(req.body.bookId);
  if (bookId == null) {
    return sendResponse(res, false, 400, "Bad input");
  }

  try {
    const bookResult = await psqlPool.query(
      "SELECT availability FROM books WHERE book_id = $1",
      [bookId]
    );

    const bookAvailable = bookResult.rows[0]?.availability;
    if (bookAvailable == undefined) {
      return sendResponse(res, false, 404, "book not found");
    }

    await psqlPool.query(
      "INSERT INTO reservations(user_id, book_id) VALUES ($1, $2)",
      [userId, bookId]
    );

    if (bookAvailable) {
      await psqlPool.query(
        "UPDATE books SET availability = FALSE WHERE book_id = $1",
        [bookId]
      );
    }

    return sendResponse(res, true);
  } catch (err) {
    console.log(err);
  }
}
