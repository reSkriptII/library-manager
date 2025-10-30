import { psqlPool } from "#util/db.js";
import { sendResponse } from "#util/sendResponse.js";
import type { Request, Response } from "express";

export async function deleteUser(req: Request, res: Response) {
  const userId = req.params.id;
  if (!userId) {
    return sendResponse(res, false, 400, "no user to delete");
  }

  try {
    const userResult = await psqlPool.query(
      "SELECT user_id FROM users WHERE user_id = $1",
      [userId]
    );

    if (!userResult.rowCount) {
      return sendResponse(res, false, 404, "user not found");
    }

    await psqlPool.query("DELETE FROM users WHERE user_id = $1", [userId]);
    return res.status(204).send();
  } catch (err) {
    console.log(err);
  }
}
