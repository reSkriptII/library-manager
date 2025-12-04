import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import { redisClient } from "../util/db.js";
import { hashToken } from "../util/authToken.js";
import {
  clearJwtCookie,
  createAccessToken,
  createRefreshToken,
  setActiveRefreshToken,
  setJwtCookie,
} from "../util/authToken.js";
import type { NextFunction, Request, Response } from "express";

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { access_token, refresh_token } = req.cookies;

  if (access_token) {
    const verifyResult = verifyToken(access_token, "access");
    if (!verifyResult.ok) {
      return res.status(401).send({ message: "token malformed" });
    }

    req.user = { id: Number(verifyResult.payload.sub) };
    return next();
  } else if (refresh_token) {
    const hashedToken = hashToken(refresh_token);
    const isTokenInSession = await redisClient.exists(
      "auth:refresh:" + hashedToken
    );
    const verifyResult = verifyToken(refresh_token, "refresh");
    if (!verifyResult.ok) {
      if (verifyResult.error) return next(verifyResult.error);
      clearJwtCookie(res);
      return res.status(401).send({ message: "token malformed" });
    }
    if (!isTokenInSession) {
      return res.status(401).send({ message: "token expired/revoked" });
    }

    const userId = Number(verifyResult.payload.sub);

    req.user = { id: userId };
    const newAccessToken = createAccessToken(userId);
    const newRefreshToken = createRefreshToken(userId);

    await redisClient.del("auth:refresh:" + hashedToken);
    await setActiveRefreshToken(userId, newRefreshToken);
    setJwtCookie(res, newAccessToken, newRefreshToken);
    return next();
  }

  return res.status(401).send({ message: "authentication token not found" });
}

function verifyToken(
  accessToken: string,
  accessOrRefresh: "access" | "refresh"
):
  | { ok: true; payload: jwt.JwtPayload }
  | { ok: false; message: string; error?: unknown } {
  try {
    const payload = jwt.verify(
      accessToken,
      accessOrRefresh === "access"
        ? ENV().ACCESS_TOKEN_SECRET
        : ENV().REFRESH_TOKEN_SECRET
    );
    if (!Number.isInteger(payload.sub)) {
      return { ok: false, message: "unexpected payload data" };
    }
    return { ok: true, payload: payload as jwt.JwtPayload };
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return { ok: false, message: "token malformed" };
    }
    return { ok: false, message: "unknow error", error };
  }
}
