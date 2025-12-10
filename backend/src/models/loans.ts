import { psqlPool } from "../util/db.js";
import { LoanObject } from "../types/models.js";

export type SearchLoans = {
  active?: boolean | null;
  bookId?: number | null;
  borrowerId?: number | null;
};

/**
 * make a query to database, search by book_id and/or borrower_id
 *
 * search filter is ignored if is null or undefined
 *
 * @param {number} search.bookId - search by book_id.
 * @param {number} search.borrowerId - search by borrower_id.
 * @param {boolean} search.active - filter for active (borrowed) or not-active loan.
 * @returns {LoanObject[]} an array of loan that met search conditions
 */
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
