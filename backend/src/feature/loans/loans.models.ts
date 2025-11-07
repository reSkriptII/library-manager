import { psqlPool } from "#src/util/db.js";

export function createLoans(bookId: number, borrowerId: number) {
  return psqlPool
    .query(
      "INSERT INTO loans (user_id, book_id) VALUES ($1, $2) RETURNING borrow_id as id, due_date",
      [borrowerId, bookId]
    )
    .then((r) => r.rows[0] as { id: number; due_date: string });
}
