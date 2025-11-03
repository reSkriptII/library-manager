import { Request, Response, NextFunction } from "express";

interface ParsedQs {
  [key: string]: undefined | string | ParsedQs | (string | ParsedQs)[];
}
interface ParamsDictionary {
  [key: string]: string;
}
export type Middleware<
  Param = ParamsDictionary,
  Query = ParsedQs,
  ReqBody = any,
  ResBody = any,
> = (
  req: Request<Param, ResBody, ReqBody, Query>,
  res: Response<ResBody>,
  next?: NextFunction
) => Promise<unknown> | unknown;
