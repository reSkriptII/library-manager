import { Request, Response } from "express";

type reqBody = {
  userId: number;
  password: string;
};

export function login(req: Request<any, any, reqBody>, res: Response) {}
