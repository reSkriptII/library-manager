import { psqlPool } from "#util/db.js";
import { sendResponse } from "#util/sendResponse.js";
import type { Request, Response } from "express";

export async function renameUser(req: Request, res: Response) {
  const userId = req.params.id;
  const name = req.body?.name;
  if (!userId || !name) {
    return sendResponse(res, false, 400, "bad input");
  }

  try {
    const userResult = await psqlPool.query(
      "SELECT user_id FROM users WHERE user_id = $1",
      [userId]
    );
    if (!userResult.rowCount) {
      return sendResponse(res, false, 404, "user not found");
    }

    await psqlPool.query("UPDATE users SET name = $1 WHERE user_id = $2", [
      name,
      userId,
    ]);

    return res.status(204).send();
  } catch (err) {
    console.log(err);
  }
}
