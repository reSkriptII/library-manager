import { copyFile, rm } from "fs/promises";
import path from "path";
import { Request, Response } from "express";
import mime from "mime-types";
import { sendResponse } from "#util/sendResponse.js";
import { psqlPool } from "#util/db.js";

export async function addBook(req: Request, res: Response) {
  const { title, author, genres } = req.body;
  if (!title || !author || !genres) {
    return sendResponse(res, false, 400, "Bad input");
  }

  try {
    const result = await psqlPool.query(
      `INSERT INTO books (title) VALUES ($1) RETURNING book_id`,
      [title]
    );
    const newBookId = result.rows[0].book_id;

    if (req.file && req.file.mimetype.split("/")[0] === "image") {
      const destFileName = newBookId + "." + mime.extension(req.file.mimetype);
      const srcFilePath = path.join(process.cwd(), req.file.path);
      const destFilePath = path.join(process.cwd(), "coverimage", destFileName);

      await copyFile(srcFilePath, destFilePath);
      await rm(srcFilePath);
    }

    sendResponse(res, true);
  } catch (err) {
    console.log(err);
  }
}
