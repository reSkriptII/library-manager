import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "./sendResponse.js";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const { access_token, refresh_token } = req.cookies;
  if (access_token) {
    try {
      const payload = jwt.verify(
        access_token,
        String(process.env.ACCESS_TOKEN_SECRET)
      );
      req.user = { id: payload.sub };
      return next();
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        return sendResponse(res, false, 401, "token malformed");
      }
      throw err;
    }
  } else if (refresh_token) {
    console.log("refauth");
    try {
      const payload = jwt.verify(
        refresh_token,
        String(process.env.REFRESH_TOKEN_SECRET)
      );
      const userId = payload.sub;

      req.user = { id: userId };
      const newAccessToken = jwt.sign(
        { sub: userId },
        String(process.env.ACCESS_TOKEN_SECRET),
        { expiresIn: 10 * 60 * 1000 }
      );

      res.cookie("access_token", newAccessToken, {
        expires: new Date(Date.now() + 10 * 60 * 1000),
      });
      return next();
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        return sendResponse(res, false, 401, "token malformed");
      }
      console.log(err);
      return next(err);
    }
  }

  return sendResponse(res, false, 401, "authentication token not found");
}
