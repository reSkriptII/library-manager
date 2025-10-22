import { psqlPool } from "#util/db.js";
import { sendResponse } from "#util/sendResponse.js";
import type { Request, Response } from "express";

export async function sendGenres(req: Request, res: Response) {
  const { search } = req.query;
  try {
    const result = await psqlPool.query(
      "SELECT genre_name FROM genres" +
        (search ? " WHERE genre_id ILIKE '%' || $1 || '%'" : ""),
      search ? [search] : undefined
    );
    console.log(result.rows.map((row) => row.name));
    return sendResponse(
      res,
      true,
      result.rows.map((row) => row.genre_name)
    );
  } catch (err) {
    console.log(err);
  }
}
