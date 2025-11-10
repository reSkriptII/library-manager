import bcrypt from "bcrypt";
import { psqlPool } from "#src/util/db.js";
import * as models from "./auth.models.js";

type RegisterDetails = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};
export async function registerUser({
  name,
  email,
  password,
  role,
}: RegisterDetails) {
  if (await models.isUserUsed({ name, email })) {
    return { ok: false, message: "Email or name has been used" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const id = await models.createUser({ name, email, hashedPassword, role });
  return { ok: true, id };
}
