import type { Middleware } from "../../types/express.js";

export namespace Login {
  export type ReqBody = {
    email: string;
    password: string;
  };
  export type Controller = Middleware<{}, {}, ReqBody>;
}
export type LoginCntrler = Login.Controller;
