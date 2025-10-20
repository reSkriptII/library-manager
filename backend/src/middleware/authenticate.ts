import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../util/sendResponse.js";
import { redisClient } from "../util/db.js";
import { hashToken } from "../util/hashToken.js";

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { access_token, refresh_token } = req.cookies;
  if (access_token) {
    try {
      const payload = jwt.verify(
        access_token,
        String(process.env.ACCESS_TOKEN_SECRET)
      );
      if (typeof payload.sub !== "number")
        throw new jwt.JsonWebTokenError("unexpected payload data");

      req.user = { id: payload.sub as unknown as number };
      return next();
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        return sendResponse(res, false, 401, "token malformed");
      }

      throw err;
    }
  } else if (refresh_token) {
    try {
      const hashedToken = hashToken(refresh_token);
      const isTokenInSession = await redisClient.exists(
        "auth:refresh:" + hashedToken
      );
      if (isTokenInSession == 0) {
        throw new jwt.JsonWebTokenError("refresh token not in session");
      }

      const payload = jwt.verify(
        refresh_token,
        String(process.env.REFRESH_TOKEN_SECRET)
      );
      if (typeof payload.sub !== "number")
        throw new jwt.JsonWebTokenError("unexpected payload data");
      const userId = payload.sub as unknown as number;

      const REFRSH_TOKEN_EXP =
        Number(process.env.REFRESH_TOKEN_EXP) < 0
          ? Number(process.env.REFRESH_TOKEN_EXP)
          : 48 * 60 * 60 * 1000;
      req.user = { id: userId };
      const newAccessToken = jwt.sign(
        { sub: userId },
        String(process.env.ACCESS_TOKEN_SECRET),
        { expiresIn: 10 * 60 * 1000 }
      );
      const newRefreshToken = jwt.sign(
        { sub: userId },
        String(process.env.REFRESH_TOKEN_SECRET),
        { expiresIn: REFRSH_TOKEN_EXP }
      );

      await redisClient.del("auth:refresh:" + refresh_token);
      await redisClient.set(
        "auth:refresh:" + refresh_token,
        JSON.stringify(userId),
        { expiration: { type: "EX", value: REFRSH_TOKEN_EXP / 1000 } }
      );

      res.cookie("access_token", newAccessToken, {
        expires: new Date(Date.now() + 10 * 60 * 1000),
      });
      res.cookie("refresh_token", newRefreshToken, {
        expires: new Date(Date.now() + REFRSH_TOKEN_EXP),
      });
      return next();
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        return sendResponse(res, false, 401, "token malformed");
      }
      return next(err);
    }
  }

  return sendResponse(res, false, 401, "authentication token not found");
}
