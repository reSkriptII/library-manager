import { psqlPool } from "#util/db.js";
import { extractNum } from "#util/extractNum.js";
import { sendResponse } from "#util/sendResponse.js";
import type { Request, Response } from "express";

export async function sendBook(req: Request, res: Response) {
  const bookId = extractNum(req.params.id);
  if (bookId == null) {
    return sendResponse(res, false, 400, "invalid book ID");
  }
  try {
    const bookResult = await psqlPool.query(
      `SELECT books.title, books.availability,
        a.genres as genres, b.authors as authors
        FROM books
        JOIN 
          (SELECT books.book_id, array_agg(genre_name) as genres
            FROM books 
              LEFT JOIN book_genres bg ON books.book_id = bg.book_id
              JOIN genres ON bg.genre_id = genres.genre_id
              GROUP BY books.book_id
          ) a ON books.book_id = a.book_id
        JOIN 
          (SELECT books.book_id, array_agg(name) as authors
            FROM books
              LEFT JOIN book_authors ba ON books.book_id = ba.book_id
              JOIN authors ON ba.author_id = authors.author_id
              GROUP BY books.book_id
          ) b ON books.book_id = b.book_id
        WHERE books.book_id = $1
        ORDER BY availability`,
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
