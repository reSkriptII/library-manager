import { Controller } from "#src/types/express.js";
import * as Models from "./users.model.js";
import * as Users from "./users.types.js";

export const getMe: Users.GetMeCtrler = async function (req, res) {
  const user = await Models.getUserById(req.user?.id as number);
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }
  return res.status(200).send(user);
};

export const getUserById: Users.GetUserCtrler = async function (req, res) {
  const userId = Number(req.params.id);
  if (Number.isInteger(userId)) {
    return res.status(400).send({ message: "Invalid user ID" });
  }

  const user = await Models.getUserById(userId);
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }
  return res.status(200).send(user);
};

export const getMyAvatar: Controller = async function (req, res) {};
export const getAvatar: Controller = async function (req, res) {};
export const updateAvatar: Controller = async function (req, res) {};
export const deleteAvatar: Controller = async function (req, res) {};

export const setUserName: Users.SetUserNameCtrler = async function (
  req,
  res
) {};
export const setUserRole: Users.SetUserRoleCtrler = async function (
  req,
  res
) {};
export const deleteUser: Users.DeleteUserCtrler = async function (req, res) {};
