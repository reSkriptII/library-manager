import { copyFile, rm } from "fs/promises";
import path from "path";
import { Request, Response } from "express";
import mime from "mime-types";
import { sendResponse } from "#util/sendResponse.js";
import { psqlPool } from "#util/db.js";

export async function addBook(req: Request, res: Response) {
  const { title, authors, genres } = req.body;
  if (!title || !authors || !genres) {
    return sendResponse(res, false, 400, "Bad input");
  }

  const db = await psqlPool.connect();
  try {
    await db.query("BEGIN");
    const bookInsertResult = await db.query(
      "INSERT INTO books (title) VALUES ($1) RETURNING book_id",
      [title]
    );
    const newBookId = bookInsertResult.rows[0].book_id;

    for (const author of authors.split(",")) {
      const authorResult = await db.query(
        "SELECT author_id FROM authors WHERE name = $1",
        [author]
      );
      const authorId = authorResult.rows[0]?.author_id;
      if (!authorId) {
        db.query("ROLLBACK");
        return sendResponse(res, false, 400, "bad request: author not found");
      }

      let a = await db.query(
        "INSERT INTO book_authors (book_id, author_id) VALUES ($1, $2)",
        [newBookId, authorId]
      );
    }

    for (const genre of genres.split(",")) {
      const genreResult = await db.query(
        "SELECT genre_id FROM genres WHERE genre_name = $1",
        [genre]
      );
      const genreId = genreResult.rows[0]?.genre_id;
      if (!genreId) {
        db.query("ROLLBACK");
        return sendResponse(res, false, 400, "bad request: genre not found");
      }

      await db.query(
        "INSERT INTO book_genres (book_id, genre_id) VALUES ($1, $2)",
        [newBookId, genreId]
      );
      await db.query("COMMIT");
    }
    if (req.file && req.file.mimetype.split("/")[0] === "image") {
      const destFileName = newBookId + "." + mime.extension(req.file.mimetype);
      const srcFilePath = path.join(process.cwd(), req.file.path);
      const destFilePath = path.join(process.cwd(), "coverimage", destFileName);

      await copyFile(srcFilePath, destFilePath);
    }

    sendResponse(res, true);
  } catch (err) {
    db.query("ROLLBACK");
    console.log(err);
  } finally {
    if (req.file) {
      rm(path.join(process.cwd(), req.file.path));
    }
    db.release();
  }
}
