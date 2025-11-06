import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { psqlPool } from "#src/util/db.js";
import { sendResponse } from "#src/util/sendResponse.js";

export async function registerUser(req: Request, res: Response) {
  const { name, email, password } = req.body;

  try {
    const result = await psqlPool.query(
      `SELECT email FROM users
      WHERE name = $1 OR email = $2`,
      [name, email]
    );

    if (result.rowCount == 0) {
      return sendResponse(res, false, 400, "email already used");
    }
  } catch (err) {
    console.log(err);
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await psqlPool.query(
      `INSERT INTO users (name, email, hashed_password) 
      VALUES ($1,$2,$3)`,
      [name, email, hashedPassword]
    );

    return sendResponse(res, true);
  } catch (err) {
    console.log(err);
  }
}
