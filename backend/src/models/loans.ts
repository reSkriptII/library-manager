import { psqlPool } from "../util/db.js";
import { LoanObject } from "../types/models.js";

export type SearchLoans = {
  active?: boolean | null;
  bookId?: number | null;
  borrowerId?: number | null;
};
export function searchLoans(search: SearchLoans): Promise<LoanObject[]> {
  const { active = null, bookId = null, borrowerId = null } = search;
  return psqlPool
    .query(
      `SELECT loan_id, loans.borrower_id, loans.book_id, books.title,
        loans.borrow_time, loans.due_date, loans.return_time 
      FROM loans
      LEFT JOIN books ON books.book_id = loans.book_id
      WHERE ($1 = false OR return_time IS NULL)
        AND ($2::int IS NULL OR loans.book_id = $2::int)
        AND ($3::int IS NULL OR borrower_id = $3::int)`,
      [active, bookId, borrowerId]
    )
    .then((r) => r.rows);
}
