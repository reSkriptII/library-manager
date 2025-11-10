import { createReadStream } from "fs";
import { Controller } from "#src/types/express.js";
import * as models from "./users.models.js";
import * as services from "./users.services.js";
import * as Users from "./users.types.js";
import { cleanFile } from "#src/util/files.js";

export const getMe: Users.GetMeCtrler = async function (req, res) {
  const user = await models.getUserById(req.user.id);
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }
  return res.status(200).send(user);
};

export const getUserById: Users.GetUserCtrler = async function (req, res) {
  const userId = Number(req.params.id);
  if (!Number.isInteger(userId)) {
    return res.status(400).send({ message: "Invalid user ID" });
  }

  const user = await models.getUserById(userId);
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }
  return res.status(200).send(user);
};

export const getMyAvatar: Controller = async function (req, res) {
  const bookCoverImgData = await services.getAvatarData(req.user.id);
  if (bookCoverImgData == null) {
    return res.status(404).send({ message: "Image not found" });
  }

  res.setHeader("Content-Type", bookCoverImgData?.mimeType);
  createReadStream(bookCoverImgData.path).pipe(res);
  return;
};
export const getAvatar: Controller = async function (req, res) {
  const userId = Number(req.params.id);
  if (!Number.isInteger(userId)) {
    return res.status(400).send({ message: "Invalid user ID" });
  }

  const bookCoverImgData = await services.getAvatarData(userId);
  if (bookCoverImgData == null) {
    return res.status(404).send({ message: "Image not found" });
  }

  res.setHeader("Content-Type", bookCoverImgData?.mimeType);
  createReadStream(bookCoverImgData.path).pipe(res);
};

export const updateAvatar: Controller = async function (req, res) {
  try {
    if (req.file && !req.file.mimetype.startsWith("image/")) {
      return res.status(400).send({ message: "Invalid file type" });
    }

    await services.updateAvatar(req.user.id, req.file);
    return res.status(204).send();
  } finally {
    if (req.file) cleanFile(req.file);
  }
};

export const setUserName: Users.SetUserNameCtrler = async function (req, res) {
  const userId = Number(req.params.id);
  const name = req.body.name;

  if (!Number.isInteger(userId)) {
    return res.status(400).send({ message: "Invalid user ID" });
  }
  if (typeof name !== "string") {
    return res.status(400).send({ message: "Invalid name" });
  }

  await services.setUserName(userId, name);
  return res.status(204).send();
};
export const setUserRole: Users.SetUserRoleCtrler = async function (req, res) {
  const userId = Number(req.params.id);
  const role = req.body.role;
  if (!Number.isInteger(userId)) {
    return res.status(400).send({ message: "Invalid user ID" });
  }
  if (role !== "member" && role !== "librarian" && role !== "admin") {
    return res.status(400).send({ message: "Invalid role" });
  }

  await services.setUserRole(userId, role);
  return res.status(204).send();
};

export const deleteUser: Users.DeleteUserCtrler = async function (req, res) {
  const userId = Number(req.params.id);

  if (!Number.isInteger(userId)) {
    return res.status(400).send({ message: "Invalid user ID" });
  }

  await services.deleteUser(userId);
  return res.status(204).send();
};

export const getMyLoan: Users.GetMyLoanCtrler = async function (req, res) {
  const userId = req.user.id;
  const loans = await services.getMyLoan(userId);
  return res.status(200).send(loans);
};
