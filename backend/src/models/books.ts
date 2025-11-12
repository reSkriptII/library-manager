import { psqlPool } from "../util/db.js";

export function isBookExist(id: number) {
  return psqlPool
    .query("SELECT 1 FROM books WHERE book_id = $1", [id])
    .then((r) => r.rows.length > 0);
}
export function isBookAvailable(id: number) {
  return psqlPool
    .query(
      `SELECT 1 FROM reservations WHERE book_id = $1
      UNION
      SELECT 1 FROM loans WHERE return_time = null AND book_id = $1`,
      [id]
    )
    .then((r) => r.rows.length === 0);
}
