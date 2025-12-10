import {
  clearJwtCookie,
  delActiveRefreshToken,
  setJwtCookie,
} from "../../util/authToken.js";
import { CONFIG } from "../../config/constant.js";
import * as services from "./auth.service.js";
import type * as Auth from "./auth.types.js";
import type { Controller } from "../../types/express.js";

const EMAIL_REGEXP =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/** authenticate and generate JWT
 *
 * set access_token and refresh_token as HTTPOnly cookies in response on success
 *
 * @param {string} req.body.email
 * @param {string} req.body.password
 */
export const login: Auth.LoginCntrler = async function (req, res, next) {
  const email = req.body?.email;
  const password = req.body?.password;

  if (EMAIL_REGEXP.test(email) === false) {
    return res.status(400).send({ message: "invalid email" });
  }
  if (password?.length < CONFIG.PASSWORD_MIN_LENGTH) {
    return res.status(400).send({ message: "invalid password" });
  }

  let result;
  try {
    result = await services.login(email, password);
  } catch (error) {
    return next(error);
  }

  if (!result.ok) {
    return res.status(result.status).send({ message: result.message });
  }
  setJwtCookie(res, result.accessToken, result.refreshToken);
  return res.status(204).send();
};

/** log out by clearing JWT in cookie */
export const logout: Controller = async function (req, res) {
  delActiveRefreshToken(req.cookies?.refresh_token);
  clearJwtCookie(res);

  return res.status(204).send();
};
