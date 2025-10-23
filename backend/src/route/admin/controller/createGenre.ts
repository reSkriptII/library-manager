import { psqlPool } from "#util/db.js";
import { sendResponse } from "#util/sendResponse.js";
import type { Request, Response } from "express";

export async function addGenre(req: Request, res: Response) {
  const { genre } = req.body;
  if (!genre) return sendResponse(res, false, 400, "bad input");

  try {
    const genreResult = await psqlPool.query(
      "SELECT genre_id FROM genres WHERE genre_name = $1",
      [genre]
    );
    if (genreResult.rows?.[0] != undefined)
      return sendResponse(res, false, 400, "genre already exist");

    await psqlPool.query("INSERT INTO genres (genre_name) VALUES ($1)", [
      genre,
    ]);
    return sendResponse(res, true);
  } catch (err) {}
}
