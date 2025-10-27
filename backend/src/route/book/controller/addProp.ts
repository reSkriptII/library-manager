import type { Request, Response } from "express";
import { sendResponse } from "#util/sendResponse.js";
import { psqlPool } from "#util/db.js";

export async function addProp(req: Request, res: Response) {
  console.log(req.params);
  const { id, prop, value } = req.params;
  if (!id || !prop || !value) {
    return sendResponse(res, false, 400, "bad input");
  }
  try {
    if (prop == "genre") {
      const genreIdResult = await psqlPool.query(
        "SELECT genre_id FROM genres WHERE genre_name = $1",
        [value]
      );
      const genreId = genreIdResult.rows[0]?.genre_id;
      if (genreId == undefined) {
        return sendResponse(res, false, 404, "genre not found");
      }
      await psqlPool.query(
        "INSERT INTO book_genres (book_id, genre_id) VALUES ($1, $2)",
        [id, genreId]
      );
      return res.status(203).send();
    } else if (prop == "author") {
      const auhorIdResult = await psqlPool.query(
        "SELECT author_id FROM authors WHERE name = $1",
        [value]
      );
      const athorId = auhorIdResult.rows[0]?.author_id;
      if (athorId == undefined) {
        return sendResponse(res, false, 404, "author not found");
      }
      await psqlPool.query(
        "INSERT INTO book_authors (book_id, author_id) VALUES ($1, $2)",
        [id, athorId]
      );
      return res.status(203).send();
    }
  } catch (err) {
    console.log(err);
  }
}
