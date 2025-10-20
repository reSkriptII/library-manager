import { NextFunction, Request, Response } from "express";
import { psqlPool } from "../util/db.js";
import { sendResponse } from "../util/sendResponse.js";

type role = "user" | "librarian" | "admin";

export function checkRole(requiredRole: role) {
  return async function (req: Request, res: Response, next: NextFunction) {
    if (!req.user || req.user?.role != undefined) {
      return sendResponse(res, false, 401, "role error");
    }
    const userId = req.user?.id;

    try {
      const result = await psqlPool.query(
        "SELECT role FROM users WHERE user_id = $1",
        [userId]
      );
      const userRole = result.rows[0]?.role;
      if (userRole == undefined) {
        return sendResponse(res, false, 403, requiredRole + " role required");
      }

      if (compareRolePrivilege(userRole, requiredRole)) {
        req.user.role = userRole;
        return next();
      }
    } catch (err) {
      console.log(err);
    }
  };
}

function compareRolePrivilege(userRole: role, requiredRole: role): boolean {
  if (requiredRole === "user") return true;

  if (requiredRole === "librarian") {
    if (["librarian", "admin"].includes(userRole)) return true;
    else return false;
  }

  if (requiredRole === "admin") {
    if (userRole === "admin") return true;
    else return false;
  }
  return false;
}
