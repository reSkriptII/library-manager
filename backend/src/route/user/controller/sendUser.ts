import { psqlPool } from "#util/db.js";
import { sendResponse } from "#util/sendResponse.js";
import type { Request, Response } from "express";

export async function sendUser(req: Request, res: Response) {
  try {
    const usersResult = await psqlPool.query(
      "SELECT user_id, name, email, role FROM users ORDER BY user_id "
    );

    return sendResponse(res, true, usersResult.rows);
  } catch (err) {
    console.log(err);
  }
}
