import { Request, Response } from "express";
import { psqlPool } from "#util/db.js";
import { sendResponse } from "#util/sendResponse.js";

export async function me(req: Request, res: Response) {
  const userId = req.user.id;

  try {
    const result = await psqlPool.query(
      `SELECT name, email, role
      FROM users
      WHERE user_id = $1`,
      [userId]
    );

    const userData = result.rows[0];
    if (userData == undefined) {
      return sendResponse(res, false, 401, "user not found");
    }

    return sendResponse(res, true, {
      id: userId,
      name: userData.name,
      email: userData.email,
      role: userData.role,
    });
  } catch (err) {
    console.log(err);
  }
}
