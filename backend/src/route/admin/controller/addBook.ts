import { copyFile, rm } from "fs/promises";
import path from "path";
import { Request, Response } from "express";
import mime from "mime-types";
import { sendResponse } from "#util/sendResponse.js";
import { psqlPool } from "#util/db.js";

export async function addBook(req: Request, res: Response) {
  if (!req.body.bookData) {
    return sendResponse(res, false, 400, "Bad input");
  }
  const { title, authors, genres, series } = JSON.parse(req.body.bookData);
  console.log(JSON.parse(req.body.bookData));
  if (!title || !Array.isArray(authors) || !Array.isArray(genres)) {
    return sendResponse(res, false, 400, "Bad input");
  }

  const db = await psqlPool.connect();
  try {
    await db.query("BEGIN");
    let seriesId = null;
    if (series) {
      const seriesResult = await db.query(
        "SELECT series_id FROM book_series WHERE series_name = $1",
        [series]
      );
      seriesId = seriesResult.rows[0]?.series_id;
      if (seriesId == null) {
        await db.query("ROLLBACK");
        return sendResponse(res, false, 400, "bad request: series not found");
      }
    }

    const bookInsertResult = await db.query(
      "INSERT INTO books (title, series_id) VALUES ($1, $2) RETURNING book_id",
      [title, seriesId]
    );
    const newBookId = bookInsertResult.rows[0].book_id;

    for (const author of authors) {
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

    for (const genre of genres) {
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
