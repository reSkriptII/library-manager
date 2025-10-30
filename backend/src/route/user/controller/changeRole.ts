import { sendResponse } from "#util/sendResponse.js";
import type { Request, Response } from "express";
import { psqlPool } from "#util/db.js";

export async function changeRole(req: Request, res: Response) {
  const userId = req.params.id;
  const role = req.body.role;

  if (!userId || !["user", "librarian", "admin"].includes(role)) {
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

    await psqlPool.query("UPDATE users SET role = $1 WHERE user_id = $2", [
      role,
      userId,
    ]);

    return res.status(204).send();
  } catch (err) {
    console.log(err);
  }
}
