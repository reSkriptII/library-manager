import { redisClient } from "#src/util/db.js";
import { hashToken } from "#src/util/hashToken.js";
import { Request, Response } from "express";

export async function logout(req: Request, res: Response) {
  const { refresh_token } = req.cookies;
  res.clearCookie("access_token", { httpOnly: true });
  res.clearCookie("refresh_token", { httpOnly: true });
  if (refresh_token == undefined) {
    return res.status(204).send();
  }

  try {
    const hashedToken = hashToken(refresh_token);
    const isTokenInSession = await redisClient.exists(
      "auth:refresh:" + hashedToken
    );
    if (isTokenInSession > 0) {
      await redisClient.del("auth:refresh:" + hashedToken);
    }
  } catch (err) {
    console.log(err);
  } finally {
    res.status(204).send();
  }
}
