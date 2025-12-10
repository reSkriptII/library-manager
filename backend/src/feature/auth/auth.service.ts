import bcrypt from "bcrypt";
import {
  createAccessToken,
  createRefreshToken,
  setActiveRefreshToken,
} from "../../util/authToken.js";
import * as models from "./auth.models.js";

type Login =
  | { ok: true; accessToken: string; refreshToken: string }
  | { ok: false; status: number; message: string };

/** log in using email and password.
 *
 * compare password using bcrypt
 *
 * return status 401 on password incorrect
 *
 * @returns an object with flag 'ok: boolean' and JWT tokens or http status and error message
 */
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
  // set refresh token in redis as activing
  await setActiveRefreshToken(user.id, refreshToken);
  return { ok: true, accessToken, refreshToken };
}
