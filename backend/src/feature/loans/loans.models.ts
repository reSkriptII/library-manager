import { psqlPool } from "../../util/db.js";
import type { LoanObject } from "./loans.types.js";

export { searchLoans } from "../../models/loans.js";
export type { SearchLoans } from "../../models/loans.js";

export function createLoans(
  bookId: number,
  borrowerId: number,
  borrowInterval: string
) {
  return psqlPool
    .query(
      "INSERT INTO loans (borrower_id, book_id, due_date) VALUES ($1, $2, NOW() + $3::interval) RETURNING loan_id as id, due_date",
      [borrowerId, bookId, borrowInterval]
    )
    .then((r) => r.rows[0] as { id: number; due_date: string });
}

export function returnBook(loanId: number) {
  return psqlPool
    .query(
      `UPDATE loans 
      SET return_time = NOW()
      WHERE loan_id = $1 
      RETURNING return_time, due_date`,
      [loanId]
    )
    .then((r) => r.rows[0] as { return_time: Date; due_date: Date });
}

export function getLoanById(loanId: number): Promise<LoanObject | null> {
  return psqlPool
    .query(
      `SELECT loan_id, borrower_id, book_id, borrow_time, due_date, return_time FROM loans 
    WHERE loan_id = $1 ORDER BY return_time DESC NULLS FIRST`,
      [loanId]
    )
    .then((r) => r.rows[0] ?? null);
}

export async function verifyLoan(
  loanId: number,
  bookId: number,
  borrowerId: number
) {
  return psqlPool.query("");
}
