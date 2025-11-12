import type { Middleware } from "../../types/express.js";
import type { LoanData, UserData } from "../../types/app.js";

export type { LoanData, UserData };

export type GetMeCtrler = Middleware<{}, {}, unknown, UserData | null>;
export type GetUserCtrler = Middleware<
  { id: string },
  {},
  unknown,
  UserData | null
>;

export type SetUserNameCtrler = Middleware<
  { id: string },
  {},
  { name: string }
>;
export type SetUserRoleCtrler = Middleware<
  { id: string },
  {},
  { role: string }
>;
export type DeleteUserCtrler = Middleware<{ id: string }>;

export type GetMyLoanCtrler = Middleware<{}, {}, unknown, LoanData[]>;
