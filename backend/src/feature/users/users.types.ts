import type { Middleware } from "#src/types/express.js";
import { LoanData, UserData } from "#src/types/app.js";

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
