import { psqlPool } from "#util/db.js";
import { sendResponse } from "#util/sendResponse.js";
import type { Request, Response } from "express";

export async function sendAuthors(req: Request, res: Response) {
  const { search } = req.query;
  try {
    const result = await psqlPool.query(
      "SELECT genre_name FROM genres" +
        (search ? " WHERE genre_id ILIKE '%' || $1 || '%'" : ""),
      search ? [search] : undefined
    );
    return sendResponse(res, true, result.rows);
  } catch (err) {
    console.log(err);
  }
}
