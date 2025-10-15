import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { psqlPool } from "#util/db.js";
import { sendResponse } from "#util/sendResponse.js";

type reqBody = {
  email: string;
  password: string;
};

export async function login(req: Request<any, any, reqBody>, res: Response) {
  const { email, password } = req.body;

  try {
    const queryResult = await psqlPool.query(
      `SELECT user_id, name, email, hashed_password
      FROM users
      WHERE email = $1`,
      [email]
    );
    const userData = queryResult.rows[0];
    if (userData == undefined) {
      return sendResponse(res, false, 401, "user not found");
    }

    const hashedPassword = userData.hashed_password;
    const isCorrectPassword = bcrypt.compare(password, hashedPassword);

    if (!isCorrectPassword) {
      return sendResponse(res, false, 401, "password incorrect");
    }

    const now = Date.now();
    const accessToken = jwt.sign(
      { sub: userData.user_id },
      String(process.env.ACCESS_TOKEN_SECRET),
      { expiresIn: 10 * 60 * 1000 }
    );
    const refreshToken = jwt.sign(
      { sub: userData.user_id },
      String(process.env.ACCESS_TOKEN_SECRET),
      { expiresIn: 48 * 60 * 60 * 1000 }
    );

    // TODO: add refresh token in database

    res.cookie("access_token", accessToken, { httpOnly: true });
    res.cookie("refresh_token", refreshToken, { httpOnly: true });
    return sendResponse(res, true);
  } catch (err) {
    console.log(err);
  }
}
