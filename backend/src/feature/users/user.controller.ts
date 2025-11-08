import { Controller } from "#src/types/express.js";
import * as Users from "./users.types.js";

export const getMe: Users.GetMeCtrler = async function (req, res) {};
export const getUserFromId: Users.GetUserCtrler = async function (req, res) {};

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
