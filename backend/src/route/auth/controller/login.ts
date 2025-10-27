import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { psqlPool, redisClient } from "#util/db.js";
import { sendResponse } from "#util/sendResponse.js";
import { hashToken } from "#util/hashToken.js";

const EMAIL_REGEXP =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export async function login(req: Request, res: Response) {
  if (req.body == undefined) {
    return sendResponse(res, false, 400, "bad input");
  }

  const { email, password } = req.body;
  if (EMAIL_REGEXP.test(email) === false) {
    return sendResponse(res, false, 400, "invalid email");
  }
  if (typeof password !== "string" || password?.length < 6) {
    return sendResponse(res, false, 400, "invalid password");
  }

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
    const isCorrectPassword = await bcrypt.compare(password, hashedPassword);

    if (!isCorrectPassword) {
      return sendResponse(res, false, 401, "password incorrect");
    }

    const accessToken = jwt.sign(
      { sub: userData.user_id },
      String(process.env.ACCESS_TOKEN_SECRET),
      { expiresIn: 10 * 60 * 1000 }
    );

    const REFRSH_TOKEN_EXP =
      Number(process.env.REFRESH_TOKEN_EXP) > 0
        ? Number(process.env.REFRESH_TOKEN_EXP)
        : 48 * 60 * 60 * 1000;
    const refreshToken = jwt.sign(
      { sub: userData.user_id },
      String(process.env.REFRESH_TOKEN_SECRET),
      { expiresIn: REFRSH_TOKEN_EXP }
    );

    await redisClient.set(
      "auth:refresh:" + hashToken(refreshToken),
      JSON.stringify(userData.user_id),
      { expiration: { type: "EX", value: REFRSH_TOKEN_EXP / 1000 } }
    );

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 10 * 60 * 1000),
    });
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + REFRSH_TOKEN_EXP),
    });
    return sendResponse(res, true);
  } catch (err) {
    console.log(err);
  }
}
