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
