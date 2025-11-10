import type { Middleware } from "#src/types/express.js";

export namespace Login {
  export type ReqBody = {
    email: string;
    password: string;
  };
  export type Controller = Middleware<{}, {}, ReqBody>;
}
export type LoginCntrler = Login.Controller;

export namespace Register {
  export type newUserDetails = {
    name: string;
    email: string;
    password: string;
    role: string;
  };
}
export type RegisterUserCtrler = Middleware<{}, {}, { details: string }>;
