import { psqlPool } from "#src/util/db.js";
import type { UserData } from "#src/types/models.js";

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

export function isUserExist(userId: number) {
  return psqlPool
    .query("SELECT 1 FROM users WHERE user_id = $1", [userId])
    .then((r) => Boolean(r.rows[0]));
}
