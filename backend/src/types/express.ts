import { Request, Response, NextFunction } from "express";

interface ErrorResponse {
  status?: string | number;
  message?: string;
}
interface ParsedQs {
  [key: string]: undefined | string | ParsedQs | (string | ParsedQs)[];
}
interface ParamsDictionary {
  [key: string]: string;
}
export type Middleware<
  Param = ParamsDictionary,
  Query = ParsedQs,
  ReqBody = unknown,
  ResBody = unknown,
> = (
  req: Request<Param, ResBody | ErrorResponse, ReqBody, Query>,
  res: Response<ResBody | ErrorResponse>,
  next: NextFunction
) => Promise<unknown> | unknown;

export type Controller = Middleware;
