import { psqlPool } from "#util/db.js";
import { sendResponse } from "#util/sendResponse.js";
import type { Request, Response } from "express";

export async function addAuthor(req: Request, res: Response) {
  const { author } = req.body;
  if (!author) return sendResponse(res, false, 400, "bad input");

  try {
    const genreResult = await psqlPool.query(
      "SELECT author_id FROM authors WHERE name = $1",
      [author]
    );
    if (genreResult.rows?.[0] != undefined)
      return sendResponse(res, false, 400, "author already exist");

    await psqlPool.query("INSERT INTO authors (name) VALUES ($1)", [author]);
  } catch (err) {}
}
