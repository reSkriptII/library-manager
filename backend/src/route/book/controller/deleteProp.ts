import { psqlPool } from "#util/db.js";
import { sendResponse } from "#util/sendResponse.js";
import type { Request, Response } from "express";

export async function deleteProp(req: Request, res: Response) {
  const { id, prop, value } = req.params;
  if (!id || !prop || !value) {
    return sendResponse(res, false, 400, "bad input");
  }
  try {
    if (prop == "genre") {
      const genreIdResult = await psqlPool.query(
        `SELECT genres.genre_id FROM book_genres 
        JOIN genres ON book_genres.genre_id = genres.genre_id 
        WHERE book_id = $1 AND genre_name = $2`,
        [id, value]
      );
      const genreId = genreIdResult.rows[0]?.genre_id;
      if (genreId == undefined) {
        return sendResponse(res, false, 404, "relation not found");
      }

      await psqlPool.query(
        `DELETE FROM book_genres WHERE book_id = $1 AND genre_id = $2`,
        [id, genreId]
      );

      return res.status(203).send();
    } else if (prop === "author") {
      const authorIdResult = await psqlPool.query(
        `SELECT authors.author_id FROM book_authors 
        JOIN authors ON book_authors.author_id = authors.author_id 
        WHERE book_id = $1 AND authors.name = $2`,
        [id, value]
      );
      const authorId = authorIdResult.rows[0]?.author_id;
      if (authorId == undefined) {
        return sendResponse(res, false, 404, "relation not found");
      }

      await psqlPool.query(
        `DELETE FROM book_authors WHERE book_id = $1 AND author_id = $2`,
        [id, authorId]
      );
      return res.status(203).send();
    }
  } catch (err) {
    console.log(err);
  }
}
