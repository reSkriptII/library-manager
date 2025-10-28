import { psqlPool } from "#util/db.js";
import { sendResponse } from "#util/sendResponse.js";
import type { Request, Response } from "express";

export async function sendBorrowedBook(req: Request, res: Response) {
  const userId = req.user?.id as number;
  try {
    const bookResult = await psqlPool.query(
      `SELECT books.book_id as id, books.title, 
        borrow_records.borrow_time, borrow_records.due_date
        FROM borrow_records
        JOIN books ON books.book_id = borrow_records.book_id
        WHERE borrow_records.user_id = $1`,
      [userId]
    );
    return sendResponse(res, true, bookResult.rows);
  } catch (err) {
    console.log(err);
  }
}
