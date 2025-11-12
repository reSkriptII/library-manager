import { psqlPool } from "../util/db.js";

export function isUserExist(userId: number) {
  return psqlPool
    .query("SELECT 1 FROM users WHERE user_id = $1", [userId])
    .then((r) => Boolean(r.rows[0]));
}
