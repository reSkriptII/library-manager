import { psqlPool } from "#util/db.js";
import { sendResponse } from "#util/sendResponse.js";
import type { Request, Response } from "express";

export async function sendBook(req: Request, res: Response) {
  const bookId = req.params.id;

  try {
    const bookResult = await psqlPool.query(
      `SELECT books.title, books.availability,
        array_agg(genres.genre_name) as genres,
        array_agg(authors.name) as authors
        FROM books
        LEFT JOIN book_authors ba ON books.book_id = ba.book_id
        LEFT JOIN authors ON ba.author_id = authors.author_id
        LEFT JOIN book_genres bg ON books.book_id = bg.book_id
        LEFT JOIN genres ON bg.genre_id = genres.genre_id
        WHERE books.book_id = $1
        GROUP BY books.title, availability`,
      [bookId]
    );
    const bookData = bookResult.rows[0];
    if (!bookData) {
      console.log(bookResult);
      return sendResponse(res, false, 404, "book not found");
    }

    return sendResponse(res, true, {
      id: bookId,
      title: bookData.title,
      authors: bookData.authors,
      genres: bookData.genres,
      available: bookData.availability,
    });
  } catch (err) {
    console.log(err);
  }
}
