import { psqlPool } from "#src/util/db.js";

export function isUserExist(userId: number) {
  return psqlPool
    .query("SELECT 1 FROM users WHERE user_id = $1", [userId])
    .then((r) => Boolean(r.rows[0]));
}

export function isUserBorrowingBooks(userId: number) {
  return psqlPool
    .query(
      "SELECT 1 FROM loans WHERE borrower_id = $1 AND return_time = null",
      [userId]
    )
    .then((r) => Boolean(r.rows.length));
}
