import { createReadStream } from "fs";
import { CONFIG } from "../../config/constant.js";
import { cleanFile } from "../../util/request.js";
import * as models from "./users.models.js";
import * as services from "./users.services.js";
import * as Users from "./users.types.js";
import type { Controller } from "../../types/express.js";

/** send user data for current, logged in user
 *
 * rely on req.user.id. call authenticate middleware first
 */
export const getMe: Users.GetMeCtrler = async function (req, res, next) {
  try {
    const user = await models.getUserById(req.user.id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    return res.status(200).send(user);
  } catch (error) {
    return next(error);
  }
};

/** send an array of all users */
export const getUsers: Controller = async function (req, res, next) {
  try {
    const users = await models.getUsers();
    return res.status(200).send(users);
  } catch (error) {
    return next(error);
  }
};

/** send an user data with specific id
 *
 * @param {string} req.param.id - user id. internally convert to integer
 */
export const getUserById: Users.GetUserCtrler = async function (
  req,
  res,
  next
) {
  const userId = Number(req.params.id);
  if (!Number.isInteger(userId)) {
    return res.status(400).send({ message: "Invalid user ID" });
  }

  let user;
  try {
    user = await models.getUserById(userId);
  } catch (error) {
    return next(error);
  }

  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }
  return res.status(200).send(user);
};

/** send user avatar image for current, logged in user
 *
 * rely on req.user.id. call authenticate middleware first
 */
export const getMyAvatar: Controller = async function (req, res, next) {
  let bookCoverImgData;
  try {
    bookCoverImgData = await services.getAvatarData(req.user.id);
  } catch (error) {
    return next(error);
  }
  if (bookCoverImgData == null) {
    return res.status(404).send({ message: "Image not found" });
  }

  res.setHeader("Content-Type", bookCoverImgData?.mimeType);
  createReadStream(bookCoverImgData.path).pipe(res);
  return;
};

/** send user avatar image for user at /:id
 *
 * @param {string} req.param.id - user id. internally convert to integer
 */
export const getAvatar: Controller = async function (req, res, next) {
  const userId = Number(req.params.id);
  if (!Number.isInteger(userId)) {
    return res.status(400).send({ message: "Invalid user ID" });
  }

  let bookCoverImgData;
  try {
    bookCoverImgData = await services.getAvatarData(userId);
  } catch (error) {
    return next(error);
  }

  if (bookCoverImgData == null) {
    return res.status(404).send({ message: "Image not found" });
  }

  res.setHeader("Content-Type", bookCoverImgData?.mimeType);
  createReadStream(bookCoverImgData.path).pipe(res);
};

/** replace user avatar image for current, logged in user
 *
 * rely on req.user.id. call authenticate middleware first.
 *
 * delete avatar image if no file founded
 *
 * @param {Express.Multer.File} req.file - an avatar image file parsed by multer
 */
export const updateAvatar: Controller = async function (req, res, next) {
  try {
    if (req.file && !req.file.mimetype.startsWith("image/")) {
      return res.status(400).send({ message: "Invalid file type" });
    }

    await services.updateAvatar(req.user.id, req.file);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  } finally {
    if (req.file) cleanFile(req.file);
  }
};

const EMAIL_REGEXP =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * @param {string} req.body.name
 * @param {string} req.body.email
 * @param {string} req.body.password
 */
export const registerUser: Users.RegisterUserCtrler = async function (
  req,
  res,
  next
) {
  try {
    const { name, email, password } = req.body;

    const isNameInvalid = typeof name !== "string";
    const isEmailInvalid = !EMAIL_REGEXP.test(email);
    const isPasswordInvalid =
      typeof password !== "string" ||
      password.length < CONFIG.PASSWORD_MIN_LENGTH;

    if (isNameInvalid || isEmailInvalid || isPasswordInvalid) {
      // generate error field details for error message
      const errorField = [];
      if (isNameInvalid) errorField.push("name");
      if (isEmailInvalid) errorField.push("email");
      if (isPasswordInvalid) errorField.push("password");
      return res
        .status(400)
        .send({ message: "Invalid field: " + errorField.join(",") });
    }

    // --- execute registeration ---

    const registration = await services.registerUser(name, email, password);
    if (!registration.ok) {
      return res.status(400).send({ message: registration.message });
    }

    return res.status(201).send({ id: registration.id });
  } catch (error) {
    next(error);
  }
};

/** set user name for user at /:id
 *
 * @param {string} req.param.id - user id. internally convert to integer
 */
export const setUserName: Users.SetUserNameCtrler = async function (
  req,
  res,
  next
) {
  const userId = Number(req.params.id);
  const name = req.body.name;

  if (!Number.isInteger(userId)) {
    return res.status(400).send({ message: "Invalid user ID" });
  }
  if (typeof name !== "string") {
    return res.status(400).send({ message: "Invalid name" });
  }

  try {
    await services.setUserName(userId, name);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

/** set user role for user at /:id
 *
 * @param {string} req.param.id - user id. internally convert to integer
 */
export const setUserRole: Users.SetUserRoleCtrler = async function (
  req,
  res,
  next
) {
  const userId = Number(req.params.id);
  const role = req.body.role;
  if (!Number.isInteger(userId)) {
    return res.status(400).send({ message: "Invalid user ID" });
  }
  if (role !== "member" && role !== "librarian" && role !== "admin") {
    return res.status(400).send({ message: "Invalid role" });
  }

  try {
    await services.setUserRole(userId, role);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

/** delete user at /:id
 *
 * @param {string} req.param.id - user id. internally convert to integer
 */
export const deleteUser: Users.DeleteUserCtrler = async function (
  req,
  res,
  next
) {
  const userId = Number(req.params.id);

  if (!Number.isInteger(userId)) {
    return res.status(400).send({ message: "Invalid user ID" });
  }

  try {
    await services.deleteUser(userId);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

/** send all loans for current, logged in user
 *
 * rely on req.user.id. call authenticate middleware first
 */
export const getMyLoan: Users.GetMyLoanCtrler = async function (
  req,
  res,
  next
) {
  try {
    const userId = req.user.id;
    const loans = await services.getMyLoan(userId);
    return res.status(200).send(loans);
  } catch (error) {
    return next(error);
  }
};
