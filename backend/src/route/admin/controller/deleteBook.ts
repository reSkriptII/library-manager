import { psqlPool } from "#util/db.js";
import { sendResponse } from "#util/sendResponse.js";
import type { Request, Response } from "express";

export async function deleteBook(req: Request, res: Response) {
  const { bookId } = req.body;
  if (bookId == undefined) sendResponse(res, false, 400, "bad input");
  try {
    const bookResult = await psqlPool.query(
      "SELECT book_id FROM books WHERE book_id = $1",
      [bookId]
    );
    if (!bookResult.rowCount) sendResponse(res, false, 400, "book not found");

    await psqlPool.query("DELETE FROM books WHERE book_id = $1", [bookId]);

    return sendResponse(res, true);
  } catch (err) {
    console.log(err);
    return sendResponse(res, false, 400, "sql error");
  }
}
