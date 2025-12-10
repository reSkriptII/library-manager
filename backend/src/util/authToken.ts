import crypto from "crypto";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import { CONFIG } from "../config/constant.js";
import { redisClient } from "./db.js";
import type { Response } from "express";

export function createAccessToken(userId: number) {
  const accessToken = jwt.sign({ sub: userId }, ENV().ACCESS_TOKEN_SECRET, {
    expiresIn: CONFIG.ACCESS_TOKEN_EXP_SECOND * 1000,
  });
  return accessToken;
}

export function createRefreshToken(userId: number) {
  const refreshToken = jwt.sign({ sub: userId }, ENV().REFRESH_TOKEN_SECRET, {
    expiresIn: CONFIG.REFRESH_TOKEN_EXP_SECOND * 1000,
  });
  return refreshToken;
}

// set JWT refresh token as active in redis database
export function setActiveRefreshToken(userId: number, refreshToken: string) {
  return redisClient.set("auth:refresh:" + hashToken(refreshToken), userId, {
    expiration: { type: "EX", value: CONFIG.REFRESH_TOKEN_EXP_SECOND },
  });
}

// delete JWT refresh token from redis database to disallow next usage
export async function delActiveRefreshToken(refreshToken?: string) {
  if (refreshToken == undefined) return;

  const hashedToken = hashToken(refreshToken);
  const isTokenInSession = await redisClient.exists(
    "auth:refresh:" + hashedToken
  );
  if (isTokenInSession > 0) {
    await redisClient.del("auth:refresh:" + hashedToken);
  }
}

// set access_token and refresh_token to request origin
export function setJwtCookie(
  res: Response,
  accessToken: string,
  refreshToken: string
) {
  res.cookie("access_token", accessToken, {
    httpOnly: true,
    expires: new Date(Date.now() + CONFIG.ACCESS_TOKEN_EXP_SECOND * 1000),
    sameSite: "none",
    secure: true,
  });
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + CONFIG.REFRESH_TOKEN_EXP_SECOND * 1000),
    sameSite: "none",
    secure: true,
  });
}

// remove access_token and refresh_token from request origin
export function clearJwtCookie(res: Response) {
  res.clearCookie("access_token", { httpOnly: true });
  res.clearCookie("refresh_token", { httpOnly: true });
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
