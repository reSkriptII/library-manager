import { psqlPool } from "#src/util/db.js";
import type { UserData } from "./users.types.js";

export function getUserById(id: number) {
  return psqlPool
    .query(
      `SELECT user_id as id, name, email, role
      FROM users
      WHERE user_id = $1`,
      [id]
    )
    .then((r) => r.rows[0] as UserData);
}

export function setUserName(id: number, name: string) {
  return psqlPool.query("UPDATE users SET name = $2 WHERE user_id = $1", [
    id,
    name,
  ]);
}
export function setUserRole(id: number, role: UserRole) {
  return psqlPool.query("UPDATE users SET role = $2 WHERE user_id = $1", [
    id,
    role,
  ]);
}

export function deleteUser(id: number) {
  return psqlPool.query("DELETE FROM users WHERE user_id = $1", [id]);
}
