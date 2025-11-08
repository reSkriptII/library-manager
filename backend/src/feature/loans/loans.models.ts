import { psqlPool } from "#src/util/db.js";

type LoanData = {
  loan_id: number;
  borrower_id: number;
  book_id: number;
  borrow_time: Date;
  due_date: Date;
  return_time: Date;
};

export type SearchLoans = {
  active?: boolean | null;
  bookId?: number | null;
  borrowerId?: number | null;
};
export function searchLoans(search: SearchLoans): Promise<LoanData[]> {
  const { active = null, bookId = null, borrowerId = null } = search;
  return psqlPool
    .query(
      `SELECT loan_id, borrower_id, book_id, borrow_time, due_date, return_time FROM loans
    WHERE ($1 = false OR return_time IS NULL)
      AND ($2::int IS NULL OR book_id = $2::int)
      AND ($3::int IS NULL OR borrower_id = $3::int)`,
      [active, bookId, borrowerId]
    )
    .then((r) => r.rows);
}
export function createLoans(bookId: number, borrowerId: number) {
  return psqlPool
    .query(
      "INSERT INTO loans (borrower_id, book_id) VALUES ($1, $2) RETURNING loan_id as id, due_date",
      [borrowerId, bookId]
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

export function getLoanById(loanId: number): Promise<LoanData | null> {
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
