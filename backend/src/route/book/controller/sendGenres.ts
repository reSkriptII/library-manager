import { psqlPool } from "#util/db.js";
import { sendResponse } from "#util/sendResponse.js";
import type { Request, Response } from "express";

export async function sendGenres(req: Request, res: Response) {
  try {
    const result = await psqlPool.query("SELECT name FROM authors");
    return sendResponse(res, true, result.rows);
  } catch (err) {
    console.log(err);
  }
}
