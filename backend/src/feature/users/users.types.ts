import type { Middleware } from "#src/types/express.js";

export type UserData = {
  id: number;
  name: string;
  email: string;
  role: "member" | "librarian" | "admin";
};

export type GetMeCtrler = Middleware<{}, {}, unknown, UserData | null>;
export type GetUserCtrler = Middleware<
  { id: string },
  {},
  unknown,
  UserData | null
>;
export type DeleteUserCtrler = Middleware<{ id: string }>;
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
