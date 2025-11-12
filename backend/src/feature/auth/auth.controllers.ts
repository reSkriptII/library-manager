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

export const logout: Controller = async function (req, res) {
  delActiveRefreshToken(req.cookies?.refresh_token);
  clearJwtCookie(res);

  return res.status(204).send();
};

export const registerUser: Auth.RegisterUserCtrler = async function (
  req,
  res,
  next
) {
  if (!req.body?.details) {
    return res.status(400).send({ message: "Invalid new user details" });
  }

  let bookDetails;
  try {
    bookDetails = JSON.parse(req.body?.details) as Auth.Register.newUserDetails;
  } catch {
    return res.status(400).send({ message: "Invalid new user details" });
  }

  const { name, email, password, role } = bookDetails;
  const isEmailValid = EMAIL_REGEXP.test(email);
  const isPasswordValid = password?.length >= CONFIG.PASSWORD_MIN_LENGTH;
  const isRoleValid = role === "member" || role === "librarian";
  if (
    typeof name !== "string" ||
    !isEmailValid ||
    !isPasswordValid ||
    !isRoleValid
  ) {
    let invalidFields: string[] = [];
    if (typeof name !== "string") invalidFields.push("name");
    if (!isEmailValid) invalidFields.push("email");
    if (!isPasswordValid) invalidFields.push("password");
    if (!isRoleValid) invalidFields.push("role");
    return res
      .status(400)
      .send({ message: "Invalid book details: " + invalidFields.join(",") });
  }

  let result;
  try {
    result = await services.registerUser({ name, email, password, role });
  } catch (error) {
    return next(error);
  }

  if (!result.ok) {
    return res.status(400).send({ message: result.message });
  }
  res.status(201).send({ id: result.id });
};
