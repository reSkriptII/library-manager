import bcrypt from "bcrypt";
import * as models from "./auth.models.js";
import {
  createAccessToken,
  createRefreshToken,
  setActiveRefreshToken,
} from "#src/util/authToken.js";

type Login =
  | { ok: true; accessToken: string; refreshToken: string }
  | { ok: false; status: number; message: string };
export async function login(email: string, password: string): Promise<Login> {
  const user = await models.getUserByEmail(email);
  if (!user) {
    return { ok: false, status: 404, message: "user not found" };
  }

  const isCorrectPassword = await bcrypt.compare(
    password,
    user.hashed_password
  );
  if (!isCorrectPassword) {
    return { ok: false, status: 401, message: "Password incorrect" };
  }

  const accessToken = createAccessToken(user.id);
  const refreshToken = createRefreshToken(user.id);
  await setActiveRefreshToken(user.id, refreshToken);
  return { ok: true, accessToken, refreshToken };
}

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
