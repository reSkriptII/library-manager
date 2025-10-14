import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { psqlPool } from "#util/db.js";
import { sendResponse } from "#util/sendResponse.js";

type reqBody = {
  name: string;
  email: string;
  password: string;
};

export async function registerUser(
  req: Request<any, any, reqBody>,
  res: Response
) {
  const { name, email, password } = req.body;

  try {
    const result = await psqlPool.query(
      `SELECT name, email FROM users
      WHERE name = $1 OR email = $2`,
      [name, email]
    );

    if (result.rows.length) {
      const message =
        result.rows[0].name === name
          ? "name already used"
          : "email already used";
      return sendResponse(res, false, 400, message);
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
