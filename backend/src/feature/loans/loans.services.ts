import * as models from "./loans.models.js";
import * as bookModels from "#src/models/books.js";
import * as userModels from "#src/models/users.js";
import { psqlPool } from "#src/util/db.js";
import { OutgoingMessage } from "http";

export type LoanBook =
  | { ok: true; id: number; dueDate: Date }
  | { ok: false; message: string };

export async function loanBook(
  bookId: number,
  borrowerId: number
): Promise<LoanBook> {
  const [isBookExist, isBookAvailable] = await Promise.all([
    bookModels.isBookExist(bookId),
    bookModels.isBookAvailable(bookId),
  ]);
  if (!isBookExist) {
    return { ok: false, message: "Book not exist" };
  }
  if (!isBookAvailable) {
    return { ok: false, message: "Book not available" };
  }

  const isUserExist = await userModels.isUserExist(borrowerId);
  if (!isUserExist) {
    return { ok: false, message: "User not found" };
  }

  const loan = await models.createLoans(bookId, bookId);
  return { ok: true, id: loan.id, dueDate: new Date(loan.due_date) };
}

export type ReturnBook =
  | { ok: true; dueDate: Date; returnTime: Date; lateReturn: boolean }
  | { ok: false; status: number; message: string };

export async function returnBook(
  loanId: number,
  checkProps?: { bookId: number; borrowerId: number }
): Promise<ReturnBook> {
  const loan = await models.getLoanById(loanId);
  if (loan == null) {
    return { ok: false, status: 404, message: "Loan not found" };
  }
  if (loan.return_time != null) {
    return { ok: false, status: 409, message: "Loan is returned" };
  }
  if (checkProps) {
    if (
      checkProps.bookId != loan.book_id ||
      checkProps.borrowerId != loan.user_id
    ) {
      return {
        ok: false,
        status: 400,
        message: "user ID and book ID don't match the loan",
      };
    }
  }

  const { return_time, due_date } = await models.returnBook(loanId);
  return {
    ok: true,
    dueDate: due_date,
    returnTime: return_time,
    lateReturn: return_time > due_date,
  };
}

export async function verifyLoan(
  loanId: number,
  bookId: number,
  borrowerId: number
) {}
