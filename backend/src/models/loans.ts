import { psqlPool } from "#src/util/db.js";
import { LoanObject } from "#src/types/models.js";

export type SearchLoans = {
  active?: boolean | null;
  bookId?: number | null;
  borrowerId?: number | null;
};
export function searchLoans(search: SearchLoans): Promise<LoanObject[]> {
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
