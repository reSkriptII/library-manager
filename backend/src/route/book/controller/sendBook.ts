import { psqlPool } from "#util/db.js";
import { sendResponse } from "#util/sendResponse.js";
import type { Request, Response } from "express";

export async function sendBook(req: Request, res: Response) {
  const bookId = req.params.id;

  try {
    const result = await psqlPool.query(
      `SELECT title, availability 
        FROM books
        WHERE book_id = $1`,
      [bookId]
    );

    const bookData = result.rows[0];
    if (!bookData) {
      return sendResponse(res, false, 404, "book not found");
    }

    return sendResponse(res, true, {
      id: bookId,
      title: bookData.title,
      available: bookData.availability,
    });
  } catch (err) {
    console.log(err);
  }
}
