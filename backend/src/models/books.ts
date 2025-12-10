import { psqlPool } from "../util/db.js";

export function isBookExist(id: number) {
  return psqlPool
    .query("SELECT 1 FROM books WHERE book_id = $1", [id])
    .then((r) => r.rows.length > 0);
}

/** make a query to database if book with book_id = id available for loan
 *
 * check if book have no unreturned loan
 */
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
