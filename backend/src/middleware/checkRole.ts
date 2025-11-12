import { NextFunction, Request, Response } from "express";
import { psqlPool } from "../util/db.js";

export function checkRole(requiredRole: UserRole) {
  return async function (req: Request, res: Response, next: NextFunction) {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).send({ message: "Unauthenticated" });
    }

    let userRole = req.user.role;
    if (!userRole) {
      try {
        userRole = await psqlPool
          .query("SELECT role FROM users WHERE user_id = $1", [userId])
          .then((r) => r.rows[0]?.role as UserRole);
      } catch (error) {
        return next(error);
      }

      if (
        userRole != "member" &&
        userRole != "librarian" &&
        userRole != "admin"
      ) {
        return res.status(403).send("Role not found");
      }
      req.user.role = userRole;
    }

    const hasPrivilege = compareRolePrivilege(userRole, requiredRole);
    if (!hasPrivilege) {
      return res.status(403).send("Unprivileged");
    }
    return next();
  };
}

function compareRolePrivilege(
  userRole: UserRole,
  requiredRole: UserRole
): boolean {
  if (requiredRole === "member") return true;

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
